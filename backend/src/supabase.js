import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || 'https://cixleelzsctwspdtoffh.supabase.co'
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_16yegiH2CxP4x0Lu6OcATg_QzXSaomQ'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'zanstoryteller-images'
