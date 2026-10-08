import jwt from 'jsonwebtoken'
import { setCorsHeaders } from '../../utils/cors.js'
import { ADMIN_EMAIL } from '../../utils/email.js'

const JWT_SECRET = process.env.JWT_SECRET || 'zan_jwt_secret_99f3810a7b45e20d8847c2b512a86efd02a_production_key_2026'

export default async function handler(req, res) {
  if (setCorsHeaders(req, res)) return

  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.replace(/^Bearer\s+/i, '')

    if (!token) {
      return res.status(401).json({ authenticated: false, error: 'No token provided' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded && decoded.email === ADMIN_EMAIL) {
      return res.status(200).json({
        authenticated: true,
        admin: true,
        email: ADMIN_EMAIL
      })
    }

    return res.status(401).json({ authenticated: false, error: 'Invalid token' })
  } catch (err) {
    return res.status(401).json({ authenticated: false, error: 'Session expired' })
  }
}
