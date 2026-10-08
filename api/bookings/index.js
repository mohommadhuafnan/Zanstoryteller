import { setCorsHeaders } from '../utils/cors.js'
import { supabase } from '../utils/supabase.js'
import { sendBookingNotificationEmail } from '../utils/email.js'

export default async function handler(req, res) {
  if (setCorsHeaders(req, res)) return

  const method = req.method

  // 1. GET /api/bookings - Fetch bookings
  if (method === 'GET') {
    try {
      const { status, limit = 100 } = req.query || {}
      let query = supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(Number(limit))

      if (status && status !== 'all') {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) {
        return res.status(500).json({ error: error.message })
      }

      return res.status(200).json({ bookings: data || [] })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  // 2. POST /api/bookings - Insert booking and send email notification
  if (method === 'POST') {
    try {
      const { name, email, phone, location, sessionType, date, time, message } = req.body || {}

      if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Name, email, and phone are required.' })
      }

      const bookingRecord = {
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

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingRecord])
        .select()

      if (error) {
        console.error('Supabase booking insert error:', error)
        return res.status(500).json({ error: error.message })
      }

      const inserted = data?.[0] || bookingRecord

      // Send email notification to admin asynchronously
      sendBookingNotificationEmail(inserted).catch((mailErr) => {
        console.warn('Booking email dispatch notice:', mailErr.message)
      })

      return res.status(201).json({
        success: true,
        booking: inserted
      })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  // 3. PATCH /api/bookings - Update booking status or notes
  if (method === 'PATCH') {
    try {
      const { id, status, notes } = req.body || {}
      if (!id) {
        return res.status(400).json({ error: 'Booking ID is required' })
      }

      const updates = {}
      if (status) updates.status = status
      if (notes !== undefined) updates.notes = notes

      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) {
        return res.status(500).json({ error: error.message })
      }

      return res.status(200).json({ success: true, booking: data?.[0] })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  // 4. DELETE /api/bookings - Delete booking
  if (method === 'DELETE') {
    try {
      const { id } = req.query || req.body || {}
      if (!id) {
        return res.status(400).json({ error: 'Booking ID is required' })
      }

      const { error } = await supabase.from('bookings').delete().eq('id', id)

      if (error) {
        return res.status(500).json({ error: error.message })
      }

      return res.status(200).json({ success: true, message: 'Booking removed.' })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
