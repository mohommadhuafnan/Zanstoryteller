import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Middleware: requireAdmin
 * Authoritative backend check enforcing that only the verified sovereign admin can access.
 * Rejects requests from non-admin users, tampered tokens, or expired sessions.
 */
export function requireAdmin(req, res, next) {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
    const jwtSecret = process.env.JWT_SECRET

    if (!jwtSecret) {
      console.error('FATAL: JWT_SECRET environment variable is missing!')
      return res.status(500).json({ error: 'Internal security configuration error.' })
    }

    // 1. Extract token from HttpOnly cookie or Authorization Bearer header
    let token = null

    if (req.cookies && req.cookies.admin_token) {
      token = req.cookies.admin_token
    } else if (req.headers.authorization) {
      const parts = req.headers.authorization.split(' ')
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1]
      }
    }

    if (!token) {
      return res.status(401).json({
        authenticated: false,
        error: 'Your session has expired. Please sign in again.'
      })
    }

    // 2. Verify signature and claims
    let decoded
    try {
      decoded = jwt.verify(token, jwtSecret)
    } catch (err) {
      return res.status(401).json({
        authenticated: false,
        error: 'Your session has expired. Please sign in again.'
      })
    }

    // 3. Strictly verify admin role and admin email against server environment
    const tokenEmail = (decoded.email || '').trim().toLowerCase()
    const tokenRole = decoded.role

    if (tokenRole !== 'admin' || tokenEmail !== adminEmail) {
      console.warn(`[SECURITY VIOLATION] Unauthorized token presented: role=${tokenRole}, email=${tokenEmail}`)
      return res.status(403).json({
        authenticated: false,
        error: 'Forbidden: Administrator authorization required.'
      })
    }

    // 4. Attach admin context to request
    req.admin = {
      sub: decoded.sub,
      email: tokenEmail,
      role: 'admin'
    }

    next()
  } catch (err) {
    console.error('Unexpected error in requireAdmin middleware:', err)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Authentication verification failure.'
    })
  }
}
