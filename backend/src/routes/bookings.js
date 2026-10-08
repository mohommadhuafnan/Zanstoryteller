import { Router } from 'express'
import { supabase } from '../supabase.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

/**
 * POST /api/bookings
 * Submit a new photography session booking
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, location, sessionType, date, time, message } = req.body

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required.' })
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
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
      ])
      .select()

    if (error) {
      console.error('Supabase booking insert error:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(201).json({
      success: true,
      booking: data?.[0]
    })
  } catch (err) {
    console.error('Error in POST /api/bookings:', err)
    return res.status(500).json({ error: 'Internal server error', details: err.message })
  }
})

/**
 * GET /api/bookings
 * Retrieve list of bookings for Admin Portal
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50 } = req.query
    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(Number(limit))

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ bookings: data || [] })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message })
  }
})

/**
 * PATCH /api/bookings/:id
 * Update status of a booking (confirmed, completed, archived)
 */
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    const updateFields = {}
    if (status) updateFields.status = status
    if (notes !== undefined) updateFields.notes = notes

    const { data, error } = await supabase
      .from('bookings')
      .update(updateFields)
      .eq('id', id)
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ success: true, booking: data?.[0] })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message })
  }
})

export default router
