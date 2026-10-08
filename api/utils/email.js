import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587
const SMTP_SECURE = process.env.SMTP_SECURE === 'true'
const SMTP_USER = process.env.SMTP_USER || 'mohommadhuafnan756@gmail.com'
const SMTP_PASS = process.env.SMTP_PASS || 'nnyonqjgybqgfjes'
const SMTP_FROM = process.env.SMTP_FROM || '"Zan Storyteller Studio" <mohommadhuafnan756@gmail.com>'
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'mohommadhuafnan756@gmail.com').trim().toLowerCase()

let transporter = null

function getTransporter() {
  if (transporter) return transporter

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  })

  return transporter
}

/**
 * Send luxury OTP verification email
 */
export async function sendOtpEmail(to, otp, purpose = 'Admin Login') {
  const mailTransporter = getTransporter()
  const isPasswordReset = purpose.toLowerCase().includes('password')
  const subject = isPasswordReset
    ? `🔑 Password Reset Code: ${otp} - Zan Storyteller`
    : `🛡️ Sovereign Admin Security Code: ${otp} - Zan Storyteller`

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      margin: 0;
      padding: 32px 16px;
      background-color: #050b14;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 520px;
      margin: 0 auto;
      background: linear-gradient(180deg, #0d1b2a 0%, #08111c 100%);
      border: 1px solid rgba(216, 187, 123, 0.25);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .header {
      padding: 36px 32px 24px;
      text-align: center;
      background: radial-gradient(circle at 50% 0%, rgba(216, 187, 123, 0.12) 0%, transparent 70%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .shield-badge {
      display: inline-block;
      width: 48px;
      height: 48px;
      line-height: 48px;
      border-radius: 14px;
      background: #111f30;
      border: 1px solid #D8BB7B;
      color: #D8BB7B;
      font-size: 22px;
      margin-bottom: 16px;
    }
    .brand-title {
      margin: 0;
      font-size: 22px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      font-weight: 300;
      color: #ffffff;
    }
    .brand-sub {
      margin: 6px 0 0;
      font-size: 11px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #D8BB7B;
      font-weight: 500;
    }
    .content {
      padding: 32px;
      text-align: center;
    }
    .lead-text {
      font-size: 14px;
      line-height: 1.6;
      color: #94a3b8;
      margin: 0 0 24px;
    }
    .otp-card {
      background: #060e18;
      border: 1px solid rgba(216, 187, 123, 0.4);
      border-radius: 16px;
      padding: 24px;
      margin: 20px 0;
      box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
    }
    .otp-code {
      font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace;
      font-size: 42px;
      font-weight: 700;
      letter-spacing: 14px;
      color: #D8BB7B;
      margin: 0;
      padding-left: 14px;
      text-shadow: 0 0 20px rgba(216, 187, 123, 0.35);
    }
    .expiry-pill {
      display: inline-block;
      margin-top: 14px;
      padding: 4px 12px;
      background: rgba(216, 187, 123, 0.1);
      border: 1px solid rgba(216, 187, 123, 0.2);
      border-radius: 20px;
      font-size: 11px;
      color: #D8BB7B;
      font-family: monospace;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .security-notice {
      margin-top: 28px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 12px;
      border-left: 3px solid #D8BB7B;
      text-align: left;
      font-size: 12px;
      color: #64748b;
      line-height: 1.5;
    }
    .footer {
      padding: 24px 32px;
      text-align: center;
      background: #050b14;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 11px;
      color: #475569;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="shield-badge">🛡️</div>
      <h1 class="brand-title">Zan Storyteller</h1>
      <p class="brand-sub">Sovereign Admin Security</p>
    </div>
    <div class="content">
      <p class="lead-text">
        ${
          isPasswordReset
            ? 'A request was received to reset the master administrator password for Zan Storyteller Studio.'
            : 'An administrator login verification was initiated for Sovereign Master Access.'
        }
        Use the single-use passcode below to complete authentication:
      </p>
      <div class="otp-card">
        <div class="otp-code">${otp}</div>
        <div class="expiry-pill">Expires in 5 Minutes</div>
      </div>
      <div class="security-notice">
        <strong>Security Notice:</strong> Never share this code with anyone. If you did not request this authorization, no changes will be made to your sovereign account.
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Zan Storyteller Studio &bull; Maldives / Sri Lanka
    </div>
  </div>
</body>
</html>
`

  const info = await mailTransporter.sendMail({
    from: SMTP_FROM,
    to,
    subject,
    text: `Your Zan Storyteller verification code is: ${otp}. Valid for 5 minutes.`,
    html
  })

  return { success: true, messageId: info.messageId }
}

/**
 * Send photoshoot booking notification email to Admin
 */
export async function sendBookingNotificationEmail(booking) {
  const mailTransporter = getTransporter()
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      margin: 0;
      padding: 32px 16px;
      background-color: #050b14;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 580px;
      margin: 0 auto;
      background: linear-gradient(180deg, #0d1b2a 0%, #08111c 100%);
      border: 1px solid rgba(216, 187, 123, 0.3);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .header {
      padding: 36px 32px 24px;
      text-align: center;
      background: radial-gradient(circle at 50% 0%, rgba(216, 187, 123, 0.15) 0%, transparent 75%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .cam-badge {
      display: inline-block;
      width: 48px;
      height: 48px;
      line-height: 48px;
      border-radius: 14px;
      background: #111f30;
      border: 1px solid #D8BB7B;
      color: #D8BB7B;
      font-size: 22px;
      margin-bottom: 16px;
    }
    .brand-title {
      margin: 0;
      font-size: 22px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      font-weight: 300;
      color: #ffffff;
    }
    .brand-sub {
      margin: 6px 0 0;
      font-size: 11px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #D8BB7B;
      font-weight: 600;
    }
    .content {
      padding: 32px;
    }
    .alert-banner {
      background: rgba(216, 187, 123, 0.1);
      border: 1px solid rgba(216, 187, 123, 0.3);
      border-radius: 12px;
      padding: 14px 18px;
      margin-bottom: 24px;
      font-size: 13px;
      color: #D8BB7B;
      text-align: center;
      font-weight: 500;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      background: #060e18;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.06);
    }
    .details-table td {
      padding: 14px 18px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      font-size: 13px;
    }
    .details-table tr:last-child td {
      border-bottom: none;
    }
    .label-col {
      color: #64748b;
      font-family: monospace;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.1em;
      width: 38%;
    }
    .val-col {
      color: #f1f5f9;
      font-weight: 500;
    }
    .highlight {
      color: #D8BB7B;
      font-weight: 600;
    }
    .message-box {
      background: #091422;
      border-left: 3px solid #D8BB7B;
      border-radius: 0 12px 12px 0;
      padding: 16px 20px;
      margin-bottom: 28px;
    }
    .message-title {
      font-size: 11px;
      font-family: monospace;
      color: #D8BB7B;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      margin: 0 0 8px;
    }
    .message-text {
      margin: 0;
      font-size: 13px;
      line-height: 1.6;
      color: #cbd5e1;
      font-style: italic;
    }
    .cta-container {
      text-align: center;
      margin-top: 24px;
    }
    .cta-btn {
      display: inline-block;
      padding: 14px 28px;
      background: linear-gradient(135deg, #D8BB7B 0%, #C4A45B 100%);
      color: #0d1b2a !important;
      text-decoration: none;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      border-radius: 12px;
      box-shadow: 0 10px 20px rgba(216, 187, 123, 0.25);
    }
    .quick-actions {
      text-align: center;
      margin-top: 14px;
      font-size: 12px;
    }
    .quick-link {
      color: #38bdf8;
      text-decoration: none;
      margin: 0 8px;
    }
    .footer {
      padding: 20px 32px;
      text-align: center;
      background: #050b14;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 11px;
      color: #475569;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="cam-badge">📸</div>
      <h1 class="brand-title">Zan Storyteller</h1>
      <p class="brand-sub">New Booking Reservation</p>
    </div>
    <div class="content">
      <div class="alert-banner">
        ✨ New Photoshoot Request Received via Website
      </div>

      <table class="details-table">
        <tr>
          <td class="label-col">Client Name</td>
          <td class="val-col highlight">${name}</td>
        </tr>
        <tr>
          <td class="label-col">Session Type</td>
          <td class="val-col">${sessionType}</td>
        </tr>
        <tr>
          <td class="label-col">Requested Date</td>
          <td class="val-col highlight">${date}</td>
        </tr>
        <tr>
          <td class="label-col">Requested Time</td>
          <td class="val-col">${time}</td>
        </tr>
        <tr>
          <td class="label-col">Location</td>
          <td class="val-col">${location}</td>
        </tr>
        <tr>
          <td class="label-col">Phone Number</td>
          <td class="val-col"><a href="tel:${cleanPhone}" style="color: #38bdf8; text-decoration: none;">${phone}</a></td>
        </tr>
        <tr>
          <td class="label-col">Email Address</td>
          <td class="val-col"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></td>
        </tr>
      </table>

      <div class="message-box">
        <p class="message-title">Client Vision &amp; Special Request</p>
        <p class="message-text">"${message}"</p>
      </div>

      <div class="cta-container">
        <a href="https://zanstoryteller.vercel.app/admin224" class="cta-btn" target="_blank">
          Open Sovereign Admin Portal &rarr;
        </a>
      </div>

      <div class="quick-actions">
        <a href="tel:${cleanPhone}" class="quick-link">📞 Call Client</a>
        &bull;
        <a href="${whatsappUrl}" class="quick-link" target="_blank">💬 WhatsApp Chat</a>
        &bull;
        <a href="mailto:${email}" class="quick-link">✉️ Reply Email</a>
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Zan Storyteller Studio &bull; Maldives / Sri Lanka
    </div>
  </div>
</body>
</html>
`

  const info = await mailTransporter.sendMail({
    from: SMTP_FROM,
    to: ADMIN_EMAIL,
    subject,
    text: `New Photoshoot Booking Request from ${name} (${sessionType}) on ${date} at ${time}. Phone: ${phone}, Email: ${email}. Notes: ${message}`,
    html
  })

  return { success: true, messageId: info.messageId }
}
