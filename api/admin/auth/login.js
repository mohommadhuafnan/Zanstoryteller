import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { setCorsHeaders } from '../../utils/cors.js'
import { supabase } from '../../utils/supabase.js'
import { sendOtpEmail, ADMIN_EMAIL } from '../../utils/email.js'

const JWT_SECRET = process.env.JWT_SECRET || 'zan_jwt_secret_99f3810a7b45e20d8847c2b512a86efd02a_production_key_2026'
const DEFAULT_PASSWORD_HASH = '3cb2f44c709bd4c4fe10cfa03f19ae8354524d1d4f882573442900571606d188' // ZanAdmin@2026

export default async function handler(req, res) {
  if (setCorsHeaders(req, res)) return

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password, forceOtp } = req.body || {}
    const inputEmail = (email || '').trim().toLowerCase()

    if (!inputEmail || inputEmail !== ADMIN_EMAIL) {
      return res.status(401).json({ error: 'Invalid administrator email address.' })
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required.' })
    }

    // 1. Fetch current admin password hash from Supabase
    let expectedHash = DEFAULT_PASSWORD_HASH
    try {
      const { data } = await supabase
        .from('site_content')
        .select('data')
        .eq('key', 'admin_auth_config')
        .maybeSingle()

      if (data?.data?.password_hash) {
        expectedHash = data.data.password_hash
      }
    } catch (e) {
      console.warn('Supabase password fetch warning:', e)
    }

    // 2. Validate password
    const inputHash = crypto.createHash('sha256').update(String(password).trim()).digest('hex')
    if (inputHash !== expectedHash) {
      return res.status(401).json({ error: 'Invalid password. Please check credentials or use Forgot Password.' })
    }

    // 3. If OTP is required (e.g., after logout or initial device setup)
    if (forceOtp) {
      const rawOtp = String(crypto.randomInt(1000, 10000))
      const salt = crypto.randomBytes(16).toString('hex')
      const otpHash = crypto.createHash('sha256').update(salt + rawOtp).digest('hex')
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

      // Mark previous unused OTPs as used
      await supabase
        .from('admin_otps')
        .update({ used: true })
        .eq('email', ADMIN_EMAIL)
        .eq('used', false)

      await supabase.from('admin_otps').insert([
        {
          email: ADMIN_EMAIL,
          otp_hash: otpHash,
          salt,
          attempts: 0,
          max_attempts: 5,
          expires_at: expiresAt,
          used: false,
          created_at: new Date().toISOString()
        }
      ])

      await sendOtpEmail(ADMIN_EMAIL, rawOtp, 'Admin Login Verification')

      return res.status(200).json({
        success: true,
        requiresOtp: true,
        message: 'Security verification code dispatched to administrator email.'
      })
    }

    // 4. Direct login (device remembered / not requiring OTP)
    const token = jwt.sign(
      { sub: 'sovereign_admin', email: ADMIN_EMAIL, role: 'admin', jti: crypto.randomUUID() },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    return res.status(200).json({
      success: true,
      requiresOtp: false,
      token,
      admin: {
        email: ADMIN_EMAIL,
        role: 'Master Admin'
      }
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'Server authentication error: ' + err.message })
  }
}
