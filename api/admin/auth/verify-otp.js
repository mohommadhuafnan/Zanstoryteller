import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { setCorsHeaders } from '../../utils/cors.js'
import { supabase } from '../../utils/supabase.js'
import { ADMIN_EMAIL } from '../../utils/email.js'

const JWT_SECRET = process.env.JWT_SECRET || 'zan_jwt_secret_99f3810a7b45e20d8847c2b512a86efd02a_production_key_2026'

export default async function handler(req, res) {
  if (setCorsHeaders(req, res)) return

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, otp } = req.body || {}
    const inputEmail = (email || '').trim().toLowerCase()
    const cleanOtp = String(otp || '').trim()

    if (!inputEmail || inputEmail !== ADMIN_EMAIL || !cleanOtp) {
      return res.status(400).json({ error: 'Invalid verification details.' })
    }

    // Retrieve active OTP record
    const { data: records, error } = await supabase
      .from('admin_otps')
      .select('*')
      .eq('email', ADMIN_EMAIL)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)

    if (error || !records || records.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired verification code.' })
    }

    const otpRecord = records[0]

    // Check expiration
    if (new Date(otpRecord.expires_at) < new Date()) {
      await supabase.from('admin_otps').update({ used: true }).eq('id', otpRecord.id)
      return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' })
    }

    // Check attempt limit
    if (otpRecord.attempts >= otpRecord.max_attempts) {
      await supabase.from('admin_otps').update({ used: true }).eq('id', otpRecord.id)
      return res.status(429).json({ error: 'Too many invalid attempts. Please request a new code.' })
    }

    // Hash check
    const candidateHash = crypto.createHash('sha256').update(otpRecord.salt + cleanOtp).digest('hex')
    if (candidateHash !== otpRecord.otp_hash) {
      const nextAttempts = (otpRecord.attempts || 0) + 1
      await supabase
        .from('admin_otps')
        .update({
          attempts: nextAttempts,
          used: nextAttempts >= otpRecord.max_attempts
        })
        .eq('id', otpRecord.id)

      return res.status(400).json({ error: 'Incorrect verification code.' })
    }

    // Mark as used
    await supabase.from('admin_otps').update({ used: true }).eq('id', otpRecord.id)

    // Generate JWT token
    const token = jwt.sign(
      { sub: 'sovereign_admin', email: ADMIN_EMAIL, role: 'admin', jti: crypto.randomUUID() },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      token,
      admin: {
        email: ADMIN_EMAIL,
        role: 'Master Admin'
      }
    })
  } catch (err) {
    console.error('Verify OTP error:', err)
    return res.status(500).json({ error: 'Internal server error: ' + err.message })
  }
}
