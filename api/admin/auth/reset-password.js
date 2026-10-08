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
    const { email, otp, newPassword } = req.body || {}
    const inputEmail = (email || '').trim().toLowerCase()
    const cleanOtp = String(otp || '').trim()
    const cleanPassword = String(newPassword || '').trim()

    if (!inputEmail || inputEmail !== ADMIN_EMAIL) {
      return res.status(400).json({ error: 'Invalid administrator email address.' })
    }

    if (!cleanOtp) {
      return res.status(400).json({ error: 'Verification code is required.' })
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' })
    }

    // Verify OTP
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

    if (new Date(otpRecord.expires_at) < new Date()) {
      await supabase.from('admin_otps').update({ used: true }).eq('id', otpRecord.id)
      return res.status(400).json({ error: 'Verification code has expired.' })
    }

    const candidateHash = crypto.createHash('sha256').update(otpRecord.salt + cleanOtp).digest('hex')
    if (candidateHash !== otpRecord.otp_hash) {
      return res.status(400).json({ error: 'Incorrect verification code.' })
    }

    // Mark OTP as used
    await supabase.from('admin_otps').update({ used: true }).eq('id', otpRecord.id)

    // Hash new password and save in site_content table
    const newHash = crypto.createHash('sha256').update(cleanPassword).digest('hex')
    await supabase.from('site_content').upsert({
      key: 'admin_auth_config',
      data: {
        admin_email: ADMIN_EMAIL,
        password_hash: newHash,
        updated_at: new Date().toISOString()
      },
      updated_at: new Date().toISOString()
    })

    const token = jwt.sign(
      { sub: 'sovereign_admin', email: ADMIN_EMAIL, role: 'admin', jti: crypto.randomUUID() },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    return res.status(200).json({
      success: true,
      message: 'Master password successfully updated.',
      token,
      admin: {
        email: ADMIN_EMAIL,
        role: 'Master Admin'
      }
    })
  } catch (err) {
    console.error('Reset password error:', err)
    return res.status(500).json({ error: 'Unable to update password: ' + err.message })
  }
}
