import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://cixleelzsctwspdtoffh.supabase.co'
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_16yegiH2CxP4x0Lu6OcATg_QzXSaomQ'

export const supabase = createClient(supabaseUrl, supabaseKey)
