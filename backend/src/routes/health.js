import { Router } from 'express'
import { supabase, STORAGE_BUCKET } from '../supabase.js'

const router = Router()

router.get('/', async (req, res) => {
  const status = {
    server: 'healthy',
    timestamp: new Date().toISOString(),
    supabase: {
      url: process.env.SUPABASE_URL || 'configured',
      connected: false,
      storageBucket: STORAGE_BUCKET,
      bucketReady: false
    }
  }

  try {
    // Quick test query to Supabase
    const { error: dbError } = await supabase.from('bookings').select('id').limit(1)
    if (!dbError || dbError.code === 'PGRST116' || !dbError.message.includes('FetchError')) {
      status.supabase.connected = true
    } else {
      status.supabase.dbNotice = dbError.message
    }
  } catch (e) {
    status.supabase.dbNotice = e.message
  }

  try {
    // Check if bucket exists
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    if (!bucketError && buckets) {
      status.supabase.bucketReady = buckets.some(b => b.name === STORAGE_BUCKET)
      status.supabase.existingBuckets = buckets.map(b => b.name)
    }
  } catch (e) {
    status.supabase.bucketNotice = e.message
  }

  return res.status(200).json(status)
})

export default router
