import { Router } from 'express'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { supabase } from '../supabase.js'
import { sendOtpEmail } from '../services/emailService.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

/**
 * Helper to record security audit logs in Supabase
 */
async function recordAuditLog(event, email, status, req, metadata = {}) {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
    const userAgent = req.headers['user-agent'] || 'unknown'

    await supabase.from('admin_audit_logs').insert([
      {
        event,
        email: email ? email.substring(0, 100) : null,
        ip_address: String(ip).substring(0, 60),
        user_agent: String(userAgent).substring(0, 255),
        status,
        metadata,
        created_at: new Date().toISOString()
      }
    ])
  } catch (err) {
    console.warn('Failed to record security audit log:', err.message)
  }
}

/**
 * Constant-time sleep helper to mitigate timing attacks on invalid credentials
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * POST /api/admin/auth/request-otp
 * Step 1: Admin enters email to receive a secure single-use OTP
 */
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body || {}
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()

    if (!adminEmail) {
      console.error('FATAL: ADMIN_EMAIL environment variable is not defined!')
      return res.status(500).json({ error: 'Server security configuration error.' })
    }

    const inputEmail = (email || '').trim().toLowerCase()

    // 1. Strict authority check: email MUST match ADMIN_EMAIL exactly
    if (!inputEmail || inputEmail !== adminEmail) {
      // Artificial delay to prevent timing differences
      await delay(250)
      await recordAuditLog('otp_request_rejected', inputEmail, 'rejected', req, {
        reason: 'unauthorized_email'
      })
      // Generic error message: do not reveal whether the email exists or belongs to an admin
      return res.status(400).json({ error: 'Unable to send verification code.' })
    }

    // 2. Rate limiting check: Max 3 OTP requests within the last 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString()
    const { data: recentOtps, error: countError } = await supabase
      .from('admin_otps')
      .select('id')
      .eq('email', adminEmail)
      .gte('created_at', fifteenMinutesAgo)

    if (!countError && recentOtps && recentOtps.length >= 3) {
      await recordAuditLog('otp_request_rate_limited', adminEmail, 'blocked', req, {
        recentCount: recentOtps.length
      })
      return res.status(429).json({
        error: 'Too many attempts. Please try again later.'
      })
    }

    // 3. Mark previous unexpired, unused OTPs as used to prevent concurrency/replay attacks
    await supabase
      .from('admin_otps')
      .update({ used: true })
      .eq('email', adminEmail)
      .eq('used', false)

    // 4. Generate cryptographically secure OTP
    const digits = Number(process.env.OTP_DIGITS) || 4
    const minVal = Math.pow(10, digits - 1)
    const maxVal = Math.pow(10, digits)
    const rawOtp = String(crypto.randomInt(minVal, maxVal))

    // 5. Generate secure salt and hash OTP (never store plain OTPs)
    const salt = crypto.randomBytes(16).toString('hex')
    const otpHash = crypto.createHash('sha256').update(salt + rawOtp).digest('hex')

    const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES) || 5
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString()

    // 6. Save hashed OTP into Supabase
    const { error: insertError } = await supabase.from('admin_otps').insert([
      {
        email: adminEmail,
        otp_hash: otpHash,
        salt,
        attempts: 0,
        max_attempts: 5,
        expires_at: expiresAt,
        used: false,
        created_at: new Date().toISOString()
      }
    ])

    if (insertError) {
      console.error('Failed to store OTP in database:', insertError.message)
      return res.status(500).json({ error: 'Unable to send verification code.' })
    }

    // 7. Dispatch OTP via Email Service
    await sendOtpEmail(adminEmail, rawOtp)
    await recordAuditLog('otp_request_success', adminEmail, 'success', req)

    return res.status(200).json({
      success: true,
      message: 'Verification code sent.',
      expiresInMinutes: expiryMinutes
    })
  } catch (err) {
    console.error('Error in request-otp endpoint:', err)
    return res.status(500).json({ error: 'Unable to send verification code.' })
  }
})

/**
 * POST /api/admin/auth/verify-otp
 * Step 2: Verify the OTP, enforce attempt limits and expiration, create authenticated session
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body || {}
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
    const inputEmail = (email || '').trim().toLowerCase()

    if (!inputEmail || inputEmail !== adminEmail || !otp) {
      await delay(200)
      return res.status(400).json({ error: 'Invalid verification code.' })
    }

    // 1. Retrieve the latest active OTP record for this email
    const { data: records, error: fetchError } = await supabase
      .from('admin_otps')
      .select('*')
      .eq('email', adminEmail)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)

    if (fetchError || !records || records.length === 0) {
      await delay(200)
      return res.status(400).json({ error: 'Invalid verification code.' })
    }

    const otpRecord = records[0]

    // 2. Check Expiration
    if (new Date(otpRecord.expires_at) < new Date()) {
      await supabase.from('admin_otps').update({ used: true }).eq('id', otpRecord.id)
      await recordAuditLog('otp_expired', adminEmail, 'failed', req)
      return res.status(400).json({
        error: 'This verification code has expired. Please request a new code.'
      })
    }

    // 3. Check Attempt Limits (Max 5 attempts)
    if (otpRecord.attempts >= otpRecord.max_attempts) {
      await supabase.from('admin_otps').update({ used: true }).eq('id', otpRecord.id)
      await recordAuditLog('otp_max_attempts_exceeded', adminEmail, 'blocked', req)
      return res.status(429).json({
        error: 'Too many attempts. Please try again later.'
      })
    }

    // 4. Constant-time verification comparison
    const candidateHash = crypto
      .createHash('sha256')
      .update(otpRecord.salt + String(otp).trim())
      .digest('hex')

    const bufCandidate = Buffer.from(candidateHash, 'hex')
    const bufStored = Buffer.from(otpRecord.otp_hash, 'hex')

    const isMatch = bufCandidate.length === bufStored.length && crypto.timingSafeEqual(bufCandidate, bufStored)

    if (!isMatch) {
      const nextAttempts = (otpRecord.attempts || 0) + 1
      const isNowExceeded = nextAttempts >= otpRecord.max_attempts

      await supabase
        .from('admin_otps')
        .update({
          attempts: nextAttempts,
          used: isNowExceeded
        })
        .eq('id', otpRecord.id)

      await recordAuditLog('otp_verification_failed', adminEmail, 'failed', req, {
        attempts: nextAttempts
      })

      if (isNowExceeded) {
        return res.status(429).json({
          error: 'Too many attempts. Please try again later.'
        })
      }

      return res.status(400).json({
        error: 'Invalid verification code.'
      })
    }

    // 5. Success! Mark OTP as used immediately (single-use protection)
    await supabase.from('admin_otps').update({ used: true }).eq('id', otpRecord.id)

    // 6. Sign secure JWT session token
    const jwtSecret = process.env.JWT_SECRET
    const sessionExpiresIn = process.env.JWT_EXPIRES_IN || '24h'

    const payload = {
      sub: 'sovereign_admin',
      email: adminEmail,
      role: 'admin',
      jti: crypto.randomUUID()
    }

    const token = jwt.sign(payload, jwtSecret, { expiresIn: sessionExpiresIn })

    // 7. Store authentication in HttpOnly SameSite cookie
    const isProduction = process.env.NODE_ENV === 'production'
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    })

    await recordAuditLog('admin_login_success', adminEmail, 'success', req)

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      token, // Also provided in JSON for clients that utilize header-based Authorization
      admin: {
        email: adminEmail,
        role: 'admin'
      }
    })
  } catch (err) {
    console.error('Error in verify-otp endpoint:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * GET /api/admin/auth/me
 * Validate existing session token on application load / page refresh.
 * Preserves admin login across page refreshes, tab changes, and navigations.
 */
router.get('/me', requireAdmin, (req, res) => {
  return res.status(200).json({
    authenticated: true,
    admin: true,
    email: req.admin.email
  })
})

/**
 * POST /api/admin/auth/logout
 * Destroys the admin session cookie and logs the event
 */
router.post('/logout', (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production'
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  })

  recordAuditLog('admin_logout', req.admin?.email || 'admin', 'success', req)

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  })
})

/**
 * GET /api/admin/auth/audit-logs
 * View recent security audit records (Admin Only)
 */
router.get('/audit-logs', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ logs: data || [] })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
