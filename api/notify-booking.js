import { setCorsHeaders } from './utils/cors.js'
import { sendBookingNotificationEmail } from './utils/email.js'

export default async function handler(req, res) {
  if (setCorsHeaders(req, res)) return

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const booking = req.body || {}

    if (!booking.name || !booking.email) {
      return res.status(400).json({ error: 'Client name and email are required for notification.' })
    }

    const result = await sendBookingNotificationEmail(booking)

    return res.status(200).json({
      success: true,
      message: 'Booking notification sent to administrator.',
      result
    })
  } catch (err) {
    console.error('Notify booking error:', err)
    return res.status(500).json({
      error: 'Failed to send notification email: ' + err.message
    })
  }
}
