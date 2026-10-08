import crypto from 'crypto'
import { setCorsHeaders } from '../../utils/cors.js'
import { supabase } from '../../utils/supabase.js'
import { sendOtpEmail, ADMIN_EMAIL } from '../../utils/email.js'

export default async function handler(req, res) {
  if (setCorsHeaders(req, res)) return

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, purpose } = req.body || {}
    const inputEmail = (email || '').trim().toLowerCase()

    if (!inputEmail || inputEmail !== ADMIN_EMAIL) {
      return res.status(400).json({ error: 'Invalid administrator email address.' })
    }

    const rawOtp = String(crypto.randomInt(1000, 10000))
    const salt = crypto.randomBytes(16).toString('hex')
    const otpHash = crypto.createHash('sha256').update(salt + rawOtp).digest('hex')
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    // Invalidate old OTPs
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

    await sendOtpEmail(ADMIN_EMAIL, rawOtp, purpose || 'Admin Login')

    return res.status(200).json({
      success: true,
      message: 'Verification code sent.',
      expiresInMinutes: 5
    })
  } catch (err) {
    console.error('Request OTP error:', err)
    return res.status(500).json({ error: 'Unable to send verification code: ' + err.message })
  }
}
