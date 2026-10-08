import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

let transporter = null

function getTransporter() {
  if (transporter) return transporter

  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const user = process.env.SMTP_USER || 'mohommadhuafnan756@gmail.com'
  const pass = process.env.SMTP_PASS || 'nnyonqjgybqgfjes'

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user,
        pass
      }
    })
  }

  return transporter
}

/**
 * Send OTP verification email to the sovereign administrator
 */
export async function sendOtpEmail(to, otp, purpose = 'Admin Login') {
  const mailTransporter = getTransporter()
  const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || '5'
  const sender = process.env.SMTP_FROM || `"Zan Storyteller Security" <${to}>`
  const isPasswordReset = purpose.toLowerCase().includes('password')

  const subject = isPasswordReset
    ? `🔑 Password Reset Code: ${otp} - Zan Storyteller`
    : `🛡️ Sovereign Admin Security Code: ${otp} - Zan Storyteller`

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 32px 16px; background-color: #050b14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0; }
    .wrapper { max-width: 520px; margin: 0 auto; background: linear-gradient(180deg, #0d1b2a 0%, #08111c 100%); border: 1px solid rgba(216, 187, 123, 0.25); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
    .header { padding: 36px 32px 24px; text-align: center; background: radial-gradient(circle at 50% 0%, rgba(216, 187, 123, 0.12) 0%, transparent 70%); border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
    .brand-title { margin: 0; font-size: 22px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 300; color: #ffffff; }
    .brand-sub { margin: 6px 0 0; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #D8BB7B; font-weight: 500; }
    .content { padding: 32px; text-align: center; }
    .lead-text { font-size: 14px; line-height: 1.6; color: #94a3b8; margin: 0 0 24px; }
    .otp-card { background: #060e18; border: 1px solid rgba(216, 187, 123, 0.4); border-radius: 16px; padding: 24px; margin: 20px 0; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5); }
    .otp-code { font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace; font-size: 42px; font-weight: 700; letter-spacing: 14px; color: #D8BB7B; margin: 0; padding-left: 14px; text-shadow: 0 0 20px rgba(216, 187, 123, 0.35); }
    .expiry-pill { display: inline-block; margin-top: 14px; padding: 4px 12px; background: rgba(216, 187, 123, 0.1); border: 1px solid rgba(216, 187, 123, 0.2); border-radius: 20px; font-size: 11px; color: #D8BB7B; font-family: monospace; letter-spacing: 0.1em; text-transform: uppercase; }
    .security-notice { margin-top: 28px; padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; border-left: 3px solid #D8BB7B; text-align: left; font-size: 12px; color: #64748b; line-height: 1.5; }
    .footer { padding: 24px 32px; text-align: center; background: #050b14; border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 11px; color: #475569; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div style="font-size: 24px; margin-bottom: 12px;">🛡️</div>
      <h1 class="brand-title">Zan Storyteller</h1>
      <p class="brand-sub">Sovereign Admin Security</p>
    </div>
    <div class="content">
      <p class="lead-text">
        ${isPasswordReset ? 'A request was received to reset your master administrator password.' : 'An administrator verification request was initiated for Sovereign Master Access.'}
        Use the single-use passcode below to proceed:
      </p>
      <div class="otp-card">
        <div class="otp-code">${otp}</div>
        <div class="expiry-pill">Expires in ${expiryMinutes} Minutes</div>
      </div>
      <div class="security-notice">
        <strong>Security Notice:</strong> Single-use code. If you did not request this authorization, no action is needed.
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Zan Storyteller Studio &bull; Maldives / Sri Lanka
    </div>
  </div>
</body>
</html>
`

  if (mailTransporter) {
    try {
      await mailTransporter.sendMail({
        from: sender,
        to,
        subject,
        text: `Your Zan Storyteller verification code is: ${otp}`,
        html
      })
      console.log(`📧 [EMAIL] Verification code successfully sent via SMTP to ${to}`)
      return { sent: true, mode: 'smtp' }
    } catch (err) {
      console.error('⚠️ [EMAIL ERROR] SMTP failed:', err.message)
    }
  }

  return { sent: true, mode: 'console' }
}

/**
 * Send photoshoot booking notification email to Admin
 */
export async function sendBookingNotificationEmail(booking) {
  const mailTransporter = getTransporter()
  const adminEmail = (process.env.ADMIN_EMAIL || 'mohommadhuafnan756@gmail.com').trim().toLowerCase()
  const sender = process.env.SMTP_FROM || `"Zan Storyteller Bookings" <${adminEmail}>`

  const name = booking.name || 'Client'
  const sessionType = booking.sessionType || booking.session_type || 'Photoshoot'
  const date = booking.date || 'To be scheduled'
  const time = booking.time || 'Flexible'
  const location = booking.location || 'Studio / To be agreed'
  const phone = booking.phone || 'N/A'
  const email = booking.email || 'N/A'
  const message = booking.message || 'No additional message provided.'
  const cleanPhone = phone.replace(/[^0-9+]/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}`

  const subject = `📸 New Photoshoot Booking Request: ${name} (${sessionType})`

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 32px 16px; background-color: #050b14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0; }
    .wrapper { max-width: 580px; margin: 0 auto; background: linear-gradient(180deg, #0d1b2a 0%, #08111c 100%); border: 1px solid rgba(216, 187, 123, 0.3); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
    .header { padding: 36px 32px 24px; text-align: center; background: radial-gradient(circle at 50% 0%, rgba(216, 187, 123, 0.15) 0%, transparent 75%); border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .brand-title { margin: 0; font-size: 22px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 300; color: #ffffff; }
    .brand-sub { margin: 6px 0 0; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #D8BB7B; font-weight: 600; }
    .content { padding: 32px; }
    .alert-banner { background: rgba(216, 187, 123, 0.1); border: 1px solid rgba(216, 187, 123, 0.3); border-radius: 12px; padding: 14px 18px; margin-bottom: 24px; font-size: 13px; color: #D8BB7B; text-align: center; font-weight: 500; }
    .details-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; background: #060e18; border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); }
    .details-table td { padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; }
    .label-col { color: #64748b; font-family: monospace; text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; width: 38%; }
    .val-col { color: #f1f5f9; font-weight: 500; }
    .highlight { color: #D8BB7B; font-weight: 600; }
    .message-box { background: #091422; border-left: 3px solid #D8BB7B; border-radius: 0 12px 12px 0; padding: 16px 20px; margin-bottom: 28px; }
    .message-title { font-size: 11px; font-family: monospace; color: #D8BB7B; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 8px; }
    .message-text { margin: 0; font-size: 13px; line-height: 1.6; color: #cbd5e1; font-style: italic; }
    .cta-container { text-align: center; margin-top: 24px; }
    .cta-btn { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #D8BB7B 0%, #C4A45B 100%); color: #0d1b2a !important; text-decoration: none; font-size: 12px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; border-radius: 12px; }
    .footer { padding: 20px 32px; text-align: center; background: #050b14; border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 11px; color: #475569; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div style="font-size: 24px; margin-bottom: 12px;">📸</div>
      <h1 class="brand-title">Zan Storyteller</h1>
      <p class="brand-sub">New Booking Reservation</p>
    </div>
    <div class="content">
      <div class="alert-banner">✨ New Photoshoot Request Received via Website</div>
      <table class="details-table">
        <tr><td class="label-col">Client Name</td><td class="val-col highlight">${name}</td></tr>
        <tr><td class="label-col">Session Type</td><td class="val-col">${sessionType}</td></tr>
        <tr><td class="label-col">Requested Date</td><td class="val-col highlight">${date}</td></tr>
        <tr><td class="label-col">Requested Time</td><td class="val-col">${time}</td></tr>
        <tr><td class="label-col">Location</td><td class="val-col">${location}</td></tr>
        <tr><td class="label-col">Phone Number</td><td class="val-col"><a href="tel:${cleanPhone}" style="color: #38bdf8;">${phone}</a></td></tr>
        <tr><td class="label-col">Email Address</td><td class="val-col"><a href="mailto:${email}" style="color: #38bdf8;">${email}</a></td></tr>
      </table>
      <div class="message-box">
        <p class="message-title">Client Vision &amp; Special Request</p>
        <p class="message-text">"${message}"</p>
      </div>
      <div class="cta-container">
        <a href="https://zanstoryteller.vercel.app/admin224" class="cta-btn" target="_blank">Open Sovereign Admin Portal &rarr;</a>
      </div>
    </div>
    <div class="footer">&copy; ${new Date().getFullYear()} Zan Storyteller Studio &bull; Maldives / Sri Lanka</div>
  </div>
</body>
</html>
`

  if (mailTransporter) {
    try {
      await mailTransporter.sendMail({
        from: sender,
        to: adminEmail,
        subject,
        text: `New Booking Request from ${name} (${sessionType}) on ${date} at ${time}. Phone: ${phone}, Email: ${email}. Notes: ${message}`,
        html
      })
      console.log(`📧 [EMAIL] Booking notification sent to admin: ${adminEmail}`)
      return { sent: true, mode: 'smtp' }
    } catch (err) {
      console.error('⚠️ [EMAIL ERROR] SMTP failed:', err.message)
    }
  }

  return { sent: true, mode: 'console' }
}
