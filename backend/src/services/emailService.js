import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

let transporter = null

function getTransporter() {
  if (transporter) return transporter

  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

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
 * Send OTP verification email to the single administrator
 * @param {string} to - Destination email (strictly verified before calling)
 * @param {string} otp - 4-digit verification code
 * @returns {Promise<{ sent: boolean, mode: string }>}
 */
export async function sendOtpEmail(to, otp) {
  const mailTransporter = getTransporter()
  const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || '5'
  const sender = process.env.SMTP_FROM || `"Zan Storyteller Security" <${to}>`

  // Format professional email content
  const subject = 'Your Admin Verification Code'
  const textBody = `Your administrator verification code is:
${otp}

This code will expire in ${expiryMinutes} minutes.
If you did not request this code, you can ignore this email.`

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b131e; color: #f0f0f0; margin: 0; padding: 24px; }
    .card { max-width: 480px; margin: 0 auto; background-color: #111f30; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .header { text-align: center; margin-bottom: 24px; }
    .brand { font-size: 20px; font-weight: 300; letter-spacing: 3px; color: #ffffff; text-transform: uppercase; margin: 0; }
    .sub { font-size: 11px; letter-spacing: 2px; color: #D8BB7B; text-transform: uppercase; margin-top: 6px; }
    .divider { width: 40px; height: 1px; background: rgba(255,255,255,0.2); margin: 16px auto 0; }
    .msg { font-size: 14px; color: #c4d1e0; line-height: 1.6; text-align: center; margin-top: 20px; }
    .otp-box { text-align: center; margin: 28px 0; background: #0d1b2a; border: 1px solid rgba(216,187,123,0.3); border-radius: 12px; padding: 20px; }
    .otp-code { font-size: 38px; font-weight: 700; letter-spacing: 12px; color: #D8BB7B; font-family: 'Courier New', monospace; display: inline-block; padding-left: 12px; }
    .notice { font-size: 12px; color: #8fa0b5; text-align: center; line-height: 1.5; }
    .footer { text-align: center; margin-top: 32px; font-size: 11px; color: #5f7188; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 class="brand">Zan Storyteller</h1>
      <p class="sub">Master Control Admin Security</p>
      <div class="divider"></div>
    </div>
    <p class="msg">A request was made to authenticate into the Zan Storyteller Admin Portal. Use the single-use security code below:</p>
    <div class="otp-box">
      <div class="otp-code">${otp}</div>
    </div>
    <p class="notice">This code will expire in <strong>${expiryMinutes} minutes</strong> and can only be used once.<br>If you did not request this code, no action is needed.</p>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Zan Storyteller Studio. All rights reserved.
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
        text: textBody,
        html: htmlBody
      })
      console.log(`📧 [EMAIL] Verification code successfully sent via SMTP to ${to}`)
      return { sent: true, mode: 'smtp' }
    } catch (err) {
      console.error('⚠️ [EMAIL ERROR] Failed to send email via SMTP transporter:', err.message)
      // Fall through to console logging for resilience
    }
  }

  // Development / Console Fallback Mode
  console.log(`
================================================================================
🔒 [ZAN STORYTELLER SECURE ADMIN OTP DISPATCH]
================================================================================
Target Admin Email : ${to}
Generated Code     : ${otp}
Expiration Window  : ${expiryMinutes} minutes
Timestamp          : ${new Date().toISOString()}
--------------------------------------------------------------------------------
(Notice: Configure SMTP_HOST & SMTP_USER in backend/.env to dispatch via live inbox)
================================================================================
`)

  return { sent: true, mode: 'console' }
}
