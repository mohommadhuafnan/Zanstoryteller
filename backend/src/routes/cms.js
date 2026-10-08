import { Router } from 'express'
import { supabase } from '../supabase.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

/**
 * GET /api/cms
 * Fetch all CMS sections from site_content
 */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    const contentMap = {}
    if (data) {
      data.forEach(row => {
        contentMap[row.key] = row.data
      })
    }

    return res.status(200).json({ content: contentMap })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message })
  }
})

/**
 * POST /api/cms
 * Save full or partial CMS state to Supabase
 */
router.post('/', requireAdmin, async (req, res) => {
  try {
    const payload = req.body
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Payload must be an object of key-value CMS sections' })
    }

    const records = Object.entries(payload).map(([key, data]) => ({
      key,
      data,
      updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('site_content')
      .upsert(records, { onConflict: 'key' })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ success: true, count: records.length })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message })
  }
})

export default router
