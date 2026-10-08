import loginHandler from './admin/auth/login.js'
import requestOtpHandler from './admin/auth/request-otp.js'
import verifyOtpHandler from './admin/auth/verify-otp.js'
import forgotPasswordHandler from './admin/auth/forgot-password.js'
import resetPasswordHandler from './admin/auth/reset-password.js'
import meHandler from './admin/auth/me.js'
import logoutHandler from './admin/auth/logout.js'
import bookingsHandler from './bookings/index.js'
import notifyBookingHandler from './notify-booking.js'
import { setCorsHeaders } from './utils/cors.js'

export default async function handler(req, res) {
  if (setCorsHeaders(req, res)) return

  // Parse path without query strings
  const url = req.url || '/'
  const pathname = url.split('?')[0].replace(/\/$/, '')

  if (pathname === '/api/admin/auth/login') {
    return loginHandler(req, res)
  }
  if (pathname === '/api/admin/auth/request-otp') {
    return requestOtpHandler(req, res)
  }
  if (pathname === '/api/admin/auth/verify-otp') {
    return verifyOtpHandler(req, res)
  }
  if (pathname === '/api/admin/auth/forgot-password') {
    return forgotPasswordHandler(req, res)
  }
  if (pathname === '/api/admin/auth/reset-password') {
    return resetPasswordHandler(req, res)
  }
  if (pathname === '/api/admin/auth/me') {
    return meHandler(req, res)
  }
  if (pathname === '/api/admin/auth/logout') {
    return logoutHandler(req, res)
  }
  if (pathname === '/api/bookings') {
    return bookingsHandler(req, res)
  }
  if (pathname === '/api/notify-booking') {
    return notifyBookingHandler(req, res)
  }
  if (pathname === '/api/health' || pathname === '/api') {
    return res.status(200).json({ status: 'ok', project: 'Zan Storyteller Serverless API' })
  }

  return res.status(404).json({ error: `Route not found: ${pathname}` })
}
