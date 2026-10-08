import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { setCorsHeaders } from './_lib/cors.js'
import { supabase } from './_lib/supabase.js'
import { sendOtpEmail, sendBookingNotificationEmail, ADMIN_EMAIL } from './_lib/email.js'

const JWT_SECRET = process.env.JWT_SECRET || 'zan_jwt_secret_99f3810a7b45e20d8847c2b512a86efd02a_production_key_2026'
const DEFAULT_PASSWORD_HASH = '3cb2f44c709bd4c4fe10cfa03f19ae8354524d1d4f882573442900571606d188' // ZanAdmin@2026

export default async function handler(req, res) {
  if (setCorsHeaders(req, res)) return

  const url = req.url || '/'
  const pathname = url.split('?')[0].replace(/\/$/, '')
  const method = req.method

  // Safely parse body if passed as string or stream
  let body = req.body || {}
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch {}
  } else if (!req.body || (typeof req.body === 'object' && Object.keys(req.body).length === 0)) {
    if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
      try {
        const buffers = []
        for await (const chunk of req) {
          buffers.push(chunk)
        }
        const raw = Buffer.concat(buffers).toString()
        if (raw) {
          body = JSON.parse(raw)
        }
      } catch {}
    }
  }

  // 1. HEALTH CHECK
  if (pathname === '/api/health' || pathname === '/api') {
    return res.status(200).json({ status: 'ok', project: 'Zan Storyteller Sovereign API' })
  }

  // 2. ADMIN LOGIN (POST)
  if (pathname === '/api/admin/auth/login' && method === 'POST') {
    try {
      const { email, password, forceOtp } = body || {}
      const inputEmail = (email || '').trim().toLowerCase()

      if (!inputEmail || inputEmail !== ADMIN_EMAIL) {
        return res.status(401).json({ error: 'Invalid administrator email address.' })
      }

      if (!password) {
        return res.status(400).json({ error: 'Password is required.' })
      }

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
      } catch (e) {}

      const inputHash = crypto.createHash('sha256').update(String(password).trim()).digest('hex')
      if (inputHash !== expectedHash) {
        return res.status(401).json({ error: 'Invalid password. Please check credentials or use Forgot Password.' })
      }

      if (forceOtp) {
        const rawOtp = String(crypto.randomInt(1000, 10000))
        const salt = crypto.randomBytes(16).toString('hex')
        const otpHash = crypto.createHash('sha256').update(salt + rawOtp).digest('hex')
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

        await supabase.from('admin_otps').update({ used: true }).eq('email', ADMIN_EMAIL).eq('used', false)
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

      const token = jwt.sign(
        { sub: 'sovereign_admin', email: ADMIN_EMAIL, role: 'admin', jti: crypto.randomUUID() },
        JWT_SECRET,
        { expiresIn: '24h' }
      )

      return res.status(200).json({
        success: true,
        requiresOtp: false,
        token,
        admin: { email: ADMIN_EMAIL, role: 'Master Admin' }
      })
    } catch (err) {
      return res.status(500).json({ error: 'Server authentication error: ' + err.message })
    }
  }

  // 3. REQUEST OTP (POST)
  if (pathname === '/api/admin/auth/request-otp' && method === 'POST') {
    try {
      const { email, purpose } = body || {}
      const inputEmail = (email || '').trim().toLowerCase()

      if (!inputEmail || inputEmail !== ADMIN_EMAIL) {
        return res.status(400).json({ error: 'Invalid administrator email address.' })
      }

      const rawOtp = String(crypto.randomInt(1000, 10000))
      const salt = crypto.randomBytes(16).toString('hex')
      const otpHash = crypto.createHash('sha256').update(salt + rawOtp).digest('hex')
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

      await supabase.from('admin_otps').update({ used: true }).eq('email', ADMIN_EMAIL).eq('used', false)
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

      return res.status(200).json({ success: true, message: 'Verification code sent.', expiresInMinutes: 5 })
    } catch (err) {
      return res.status(500).json({ error: 'Unable to send verification code: ' + err.message })
    }
  }

  // 4. VERIFY OTP (POST)
  if (pathname === '/api/admin/auth/verify-otp' && method === 'POST') {
    try {
      const { email, otp } = body || {}
      const inputEmail = (email || '').trim().toLowerCase()
      const cleanOtp = String(otp || '').trim()

      if (!inputEmail || inputEmail !== ADMIN_EMAIL || !cleanOtp) {
        return res.status(400).json({ error: 'Invalid verification details.' })
      }

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
        return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' })
      }

      const candidateHash = crypto.createHash('sha256').update(otpRecord.salt + cleanOtp).digest('hex')
      if (candidateHash !== otpRecord.otp_hash) {
        const nextAttempts = (otpRecord.attempts || 0) + 1
        await supabase.from('admin_otps').update({ attempts: nextAttempts, used: nextAttempts >= otpRecord.max_attempts }).eq('id', otpRecord.id)
        return res.status(400).json({ error: 'Incorrect verification code.' })
      }

      await supabase.from('admin_otps').update({ used: true }).eq('id', otpRecord.id)

      const token = jwt.sign(
        { sub: 'sovereign_admin', email: ADMIN_EMAIL, role: 'admin', jti: crypto.randomUUID() },
        JWT_SECRET,
        { expiresIn: '24h' }
      )

      return res.status(200).json({
        success: true,
        message: 'Authentication successful.',
        token,
        admin: { email: ADMIN_EMAIL, role: 'Master Admin' }
      })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error: ' + err.message })
    }
  }

  // 5. FORGOT PASSWORD (POST)
  if (pathname === '/api/admin/auth/forgot-password' && method === 'POST') {
    try {
      const { email } = body || {}
      const inputEmail = (email || '').trim().toLowerCase()

      if (!inputEmail || inputEmail !== ADMIN_EMAIL) {
        return res.status(400).json({ error: 'Invalid administrator email address.' })
      }

      const rawOtp = String(crypto.randomInt(1000, 10000))
      const salt = crypto.randomBytes(16).toString('hex')
      const otpHash = crypto.createHash('sha256').update(salt + rawOtp).digest('hex')
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

      await supabase.from('admin_otps').update({ used: true }).eq('email', ADMIN_EMAIL).eq('used', false)
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

      await sendOtpEmail(ADMIN_EMAIL, rawOtp, 'Password Reset')

      return res.status(200).json({ success: true, message: 'Password reset code dispatched to administrator email.' })
    } catch (err) {
      return res.status(500).json({ error: 'Unable to initiate password reset: ' + err.message })
    }
  }

  // 6. RESET PASSWORD (POST)
  if (pathname === '/api/admin/auth/reset-password' && method === 'POST') {
    try {
      const { email, otp, newPassword } = body || {}
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

      await supabase.from('admin_otps').update({ used: true }).eq('id', otpRecord.id)

      const newHash = crypto.createHash('sha256').update(cleanPassword).digest('hex')
      await supabase.from('site_content').upsert({
        key: 'admin_auth_config',
        data: { admin_email: ADMIN_EMAIL, password_hash: newHash, updated_at: new Date().toISOString() },
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
        admin: { email: ADMIN_EMAIL, role: 'Master Admin' }
      })
    } catch (err) {
      return res.status(500).json({ error: 'Unable to update password: ' + err.message })
    }
  }

  // 7. SESSION ME (GET)
  if (pathname === '/api/admin/auth/me' && method === 'GET') {
    try {
      const authHeader = req.headers.authorization || ''
      const token = authHeader.replace(/^Bearer\s+/i, '')

      if (!token) {
        return res.status(401).json({ authenticated: false, error: 'No token provided' })
      }

      const decoded = jwt.verify(token, JWT_SECRET)
      if (decoded && decoded.email === ADMIN_EMAIL) {
        return res.status(200).json({ authenticated: true, admin: true, email: ADMIN_EMAIL })
      }

      return res.status(401).json({ authenticated: false, error: 'Invalid token' })
    } catch (err) {
      return res.status(401).json({ authenticated: false, error: 'Session expired' })
    }
  }

  // 8. LOGOUT (POST)
  if (pathname === '/api/admin/auth/logout' && method === 'POST') {
    return res.status(200).json({ success: true, message: 'Logged out successfully.' })
  }

  // 9. NOTIFY BOOKING (POST)
  if (pathname === '/api/notify-booking' && method === 'POST') {
    try {
      const booking = body || {}
      if (!booking.name || !booking.email) {
        return res.status(400).json({ error: 'Client name and email are required.' })
      }

      const result = await sendBookingNotificationEmail(booking)
      return res.status(200).json({ success: true, message: 'Booking notification sent to administrator.', result })
    } catch (err) {
      return res.status(500).json({ error: 'Failed to send notification: ' + err.message })
    }
  }

  // 10. BOOKINGS (GET / POST / PATCH / DELETE)
  if (pathname === '/api/bookings') {
    if (method === 'GET') {
      try {
        const { status, limit = 100 } = req.query || {}
        let query = supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(Number(limit))
        if (status && status !== 'all') query = query.eq('status', status)
        const { data, error } = await query
        if (error) return res.status(500).json({ error: error.message })
        return res.status(200).json({ bookings: data || [] })
      } catch (err) {
        return res.status(500).json({ error: err.message })
      }
    }

    if (method === 'POST') {
      try {
        const { name, email, phone, location, sessionType, date, time, message } = body || {}
        if (!name || !email || !phone) return res.status(400).json({ error: 'Name, email, and phone are required.' })

        const record = {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          location: (location || 'Studio / To be agreed').trim(),
          session_type: sessionType || 'Unspecified',
          date: date || null,
          time: time || null,
          message: (message || '').trim(),
          status: 'pending',
          created_at: new Date().toISOString()
        }

        const { data, error } = await supabase.from('bookings').insert([record]).select()
        if (error) return res.status(500).json({ error: error.message })

        const created = data?.[0] || record
        sendBookingNotificationEmail(created).catch(() => {})
        return res.status(201).json({ success: true, booking: created })
      } catch (err) {
        return res.status(500).json({ error: err.message })
      }
    }

    if (method === 'PATCH') {
      try {
        const { id, status: st, notes } = body || {}
        if (!id) return res.status(400).json({ error: 'Booking ID required' })

        const upd = {}
        if (st) upd.status = st
        if (notes !== undefined) upd.notes = notes

        const { data, error } = await supabase.from('bookings').update(upd).eq('id', id).select()
        if (error) return res.status(500).json({ error: error.message })
        return res.status(200).json({ success: true, booking: data?.[0] })
      } catch (err) {
        return res.status(500).json({ error: err.message })
      }
    }

    if (method === 'DELETE') {
      try {
        const { id } = req.query || req.body || {}
        if (!id) return res.status(400).json({ error: 'Booking ID required' })
        const { error } = await supabase.from('bookings').delete().eq('id', id)
        if (error) return res.status(500).json({ error: error.message })
        return res.status(200).json({ success: true, message: 'Booking removed.' })
      } catch (err) {
        return res.status(500).json({ error: err.message })
      }
    }
  }

  return res.status(404).json({ error: `Route not found: ${pathname}` })
}
