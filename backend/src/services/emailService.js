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

const LOGO_URL = 'https://res.cloudinary.com/dtpeeydfz/image/upload/v1791466439/zanstoryteller/branding/zan_logo_gold.png'

/**
 * Send OTP verification email to the sovereign administrator
 */
export async function sendOtpEmail(to, otp, purpose = 'Admin Login') {
  const mailTransporter = getTransporter()
  const sender = process.env.SMTP_FROM || `"Zan Storyteller Studio" <mohommadhuafnan756@gmail.com>`
  const isPasswordReset = purpose.toLowerCase().includes('password')

  const subject = isPasswordReset
    ? `🔑 Password Reset Code: ${otp} - Zan Storyteller`
    : `🛡️ Sovereign Admin Security Code: ${otp} - Zan Storyteller`

  const otpArray = String(otp).trim().split('')

  const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="color-scheme" content="light dark"/>
  <meta name="supported-color-schemes" content="light dark"/>
  <title>${subject}</title>
  <style type="text/css">
    :root { color-scheme: light dark; supported-color-schemes: light dark; }
    body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    .brand-title { color: #ffffff !important; }
    .gold-accent { color: #D8BB7B !important; }
    .otp-num { color: #D8BB7B !important; }
    @media (prefers-color-scheme: dark) {
      .brand-title { color: #ffffff !important; }
      .gold-accent { color: #D8BB7B !important; }
      .otp-num { color: #D8BB7B !important; }
    }
  </style>
</head>
<body bgcolor="#03070d" style="margin: 0; padding: 0; background-color: #03070d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#03070d" style="background-color: #03070d; table-layout: fixed; padding: 36px 12px;">
    <tr>
      <td align="center" valign="top">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#0a1422" style="max-width: 520px; background-color: #0a1422; border: 1px solid #c9a85c; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
          <tr>
            <td align="center" bgcolor="#0e1a2b" style="padding: 40px 24px 28px; background-color: #0e1a2b; border-bottom: 1px solid rgba(201, 168, 92, 0.3);">
              <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 18px;">
                <tr>
                  <td align="center">
                    <img src="${LOGO_URL}" alt="Zan Storyteller" width="70" style="display: block; width: 70px; max-width: 70px; height: auto; border: 0; outline: none; margin: 0 auto;" />
                  </td>
                </tr>
              </table>
              <h1 class="brand-title" style="margin: 0; font-family: 'Cinzel', 'Times New Roman', Georgia, serif; font-size: 22px; font-weight: 500; letter-spacing: 5px; color: #ffffff !important; text-transform: uppercase; text-align: center;">
                ZAN STORYTELLER
              </h1>
              <p class="gold-accent" style="margin: 8px 0 0; font-family: 'SF Mono', Consolas, Monaco, monospace; font-size: 11px; font-weight: 600; letter-spacing: 3px; color: #D8BB7B !important; text-transform: uppercase; text-align: center;">
                ${isPasswordReset ? 'PASSWORD RECOVERY' : 'SOVEREIGN ADMIN ACCESS'}
              </p>
              <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 16px auto 0;">
                <tr>
                  <td width="50" height="2" bgcolor="#D8BB7B" style="background-color: #D8BB7B; font-size: 1px; line-height: 1px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="#0a1422" style="padding: 34px 28px 26px; text-align: center; background-color: #0a1422;">
              <p style="margin: 0 0 26px; font-size: 14px; line-height: 1.7; color: #cbd5e1 !important; text-align: center;">
                ${
                  isPasswordReset
                    ? 'A master password reset request was initiated for your administrator account. Use your single-use verification code below to authorize the change:'
                    : 'A sovereign login authorization request was initiated for the Zan Storyteller Studio. Enter this secure single-use code to proceed:'
                }
              </p>
              <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 22px;">
                <tr>
                  ${otpArray
                    .map(
                      (digit) => `
                    <td style="padding: 0 6px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="58" height="72" bgcolor="#060e18" style="background-color: #060e18 !important; border: 2px solid #D8BB7B !important; border-radius: 12px; text-align: center; box-shadow: 0 4px 14px rgba(216, 187, 123, 0.15);">
                        <tr>
                          <td align="center" valign="middle" height="68" bgcolor="#060e18" style="background-color: #060e18 !important; text-align: center;">
                            <span class="otp-num" style="font-family: 'SF Mono', Consolas, Monaco, monospace; font-size: 38px; font-weight: 800; color: #D8BB7B !important; line-height: 1; display: inline-block;">
                              ${digit}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  `
                    )
                    .join('')}
                </tr>
              </table>
              <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 28px;">
                <tr>
                  <td bgcolor="#112236" style="background-color: #112236; border: 1px solid #D8BB7B; border-radius: 20px; padding: 7px 20px; text-align: center;">
                    <span class="gold-accent" style="font-family: 'SF Mono', Consolas, monospace; font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #D8BB7B !important; text-transform: uppercase;">
                      ⏱️ EXPIRES IN 5 MINUTES &bull; SINGLE USE ONLY
                    </span>
                  </td>
                </tr>
              </table>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#060d16" style="background-color: #060d16; border-left: 3px solid #D8BB7B; border-radius: 8px; margin: 0 0 28px;">
                <tr>
                  <td style="padding: 14px 18px; text-align: left;">
                    <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #94a3b8 !important;">
                      <strong style="color: #e2e8f0 !important;">Security Notice:</strong> This passcode is strictly confidential. If you did not initiate this authorization, no action is needed and your account remains fully secured.
                    </p>
                  </td>
                </tr>
              </table>
              <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
                <tr>
                  <td align="center" bgcolor="#D8BB7B" style="background-color: #D8BB7B; border-radius: 12px; box-shadow: 0 6px 20px rgba(216, 187, 123, 0.3);">
                    <a href="https://zanstoryteller.vercel.app/admin224" target="_blank" style="display: inline-block; padding: 14px 32px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 2px; color: #0a1422 !important; text-decoration: none; text-transform: uppercase;">
                      Open Sovereign Admin &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="#060d16" style="padding: 24px 28px; background-color: #060d16; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b !important; letter-spacing: 1px;">
                &copy; ${new Date().getFullYear()} Zan Storyteller Studio &bull; Maldives / Sri Lanka
              </p>
              <p style="margin: 6px 0 0; font-size: 10px; color: #475569 !important; letter-spacing: 0.5px;">
                Authorized Sovereign Access Gateway
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
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
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject}</title>
</head>
<body bgcolor="#03070d" style="margin: 0; padding: 0; background-color: #03070d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#03070d" style="background-color: #03070d; table-layout: fixed; padding: 36px 12px;">
    <tr>
      <td align="center" valign="top">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#0a1422" style="max-width: 560px; background-color: #0a1422; border: 1px solid #c9a85c; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
          <tr>
            <td align="center" bgcolor="#0e1a2b" style="padding: 36px 24px 24px; background-color: #0e1a2b; border-bottom: 1px solid rgba(201, 168, 92, 0.25);">
              <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 16px;">
                <tr>
                  <td align="center">
                    <img src="${LOGO_URL}" alt="Zan Storyteller" width="60" style="display: block; width: 60px; height: auto; border: 0;" />
                  </td>
                </tr>
              </table>
              <h1 style="margin: 0; font-family: 'Cinzel', 'Times New Roman', Georgia, serif; font-size: 22px; font-weight: 400; letter-spacing: 5px; color: #ffffff !important; text-transform: uppercase;">
                ZAN STORYTELLER
              </h1>
              <p style="margin: 6px 0 0; font-family: 'SF Mono', Consolas, monospace; font-size: 11px; font-weight: 600; letter-spacing: 3px; color: #D8BB7B !important; text-transform: uppercase;">
                NEW CLIENT RESERVATION
              </p>
              <div style="width: 44px; height: 2px; background-color: #D8BB7B; margin: 14px auto 0;"></div>
            </td>
          </tr>
          <tr>
            <td bgcolor="#0a1422" style="padding: 28px 24px; background-color: #0a1422;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#112236" style="background-color: #112236; border: 1px solid rgba(216, 187, 123, 0.3); border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td align="center" style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #D8BB7B !important;">
                    ✨ A new photoshoot reservation has arrived from the website!
                  </td>
                </tr>
              </table>
              <table border="0" cellpadding="12" cellspacing="0" width="100%" bgcolor="#060e18" style="background-color: #060e18; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; margin-bottom: 24px; font-size: 13px;">
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td width="36%" style="color: #64748b !important; font-family: monospace; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">Client Name</td>
                  <td style="color: #D8BB7B !important; font-weight: 700; font-size: 14px;">${name}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="color: #64748b !important; font-family: monospace; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">Session Type</td>
                  <td style="color: #f1f5f9 !important; font-weight: 600;">${sessionType}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="color: #64748b !important; font-family: monospace; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">Requested Date</td>
                  <td style="color: #D8BB7B !important; font-weight: 600;">${date}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="color: #64748b !important; font-family: monospace; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">Preferred Time</td>
                  <td style="color: #f1f5f9 !important;">${time}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="color: #64748b !important; font-family: monospace; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">Location</td>
                  <td style="color: #f1f5f9 !important;">${location}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="color: #64748b !important; font-family: monospace; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">Phone Number</td>
                  <td style="color: #38bdf8 !important;"><a href="tel:${cleanPhone}" style="color: #38bdf8; text-decoration: none;">${phone}</a></td>
                </tr>
                <tr>
                  <td style="color: #64748b !important; font-family: monospace; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">Email Address</td>
                  <td style="color: #38bdf8 !important;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></td>
                </tr>
              </table>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#060e18" style="background-color: #060e18; border-left: 3px solid #D8BB7B; border-radius: 0 10px 10px 0; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <p style="margin: 0 0 6px; font-family: monospace; font-size: 11px; color: #D8BB7B !important; text-transform: uppercase; letter-spacing: 1px;">
                      Client Vision &amp; Notes:
                    </p>
                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #cbd5e1 !important; font-style: italic;">
                      "${message}"
                    </p>
                  </td>
                </tr>
              </table>
              <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 18px;">
                <tr>
                  <td align="center" bgcolor="#D8BB7B" style="background-color: #D8BB7B; border-radius: 12px; box-shadow: 0 6px 20px rgba(216, 187, 123, 0.3);">
                    <a href="https://zanstoryteller.vercel.app/admin224" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 12px; font-weight: 700; letter-spacing: 2px; color: #0a1422 !important; text-decoration: none; text-transform: uppercase;">
                      Open Sovereign Admin Portal &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              <p style="text-align: center; margin: 0; font-size: 12px; color: #94a3b8;">
                <a href="tel:${cleanPhone}" style="color: #38bdf8; text-decoration: none; margin: 0 8px;">📞 Call Client</a>
                &bull;
                <a href="${whatsappUrl}" target="_blank" style="color: #38bdf8; text-decoration: none; margin: 0 8px;">💬 WhatsApp Chat</a>
                &bull;
                <a href="mailto:${email}" style="color: #38bdf8; text-decoration: none; margin: 0 8px;">✉️ Reply Email</a>
              </p>
            </td>
          </tr>
          <tr>
            <td bgcolor="#060d16" style="padding: 20px 24px; background-color: #060d16; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b !important;">
                &copy; ${new Date().getFullYear()} Zan Storyteller Studio &bull; Maldives / Sri Lanka
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
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
