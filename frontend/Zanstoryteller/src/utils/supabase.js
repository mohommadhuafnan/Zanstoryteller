import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cixleelzsctwspdtoffh.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_16yegiH2CxP4x0Lu6OcATg_QzXSaomQ'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const STORAGE_BUCKET = 'zanstoryteller-images'

/**
 * Upload an image file directly to Supabase Storage.
 * Falls back to backend endpoint or returns clean error if not configured.
 * @param {File|Blob} file 
 * @param {string} folder 
 * @returns {Promise<{ url: string, path: string }>}
 */
export async function uploadImageToSupabase(file, folder = 'portfolio') {
  if (!file) throw new Error('No file provided')

  const fileExt = file.name ? file.name.split('.').pop() : 'jpg'
  const cleanBaseName = file.name ? file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_") : 'image'
  const filePath = `${folder}/${Date.now()}_${cleanBaseName}.${fileExt}`

  // Try direct Supabase Storage upload
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'image/jpeg'
      })

    if (error) {
      console.warn('Direct Supabase storage upload notice:', error.message)
      // Attempt backend fallback if available
      return await uploadViaBackendFallback(file, folder)
    }

    const { data: publicData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath)

    const finalUrl = publicData.publicUrl
    recordImageInDatabase({
      name: file.name,
      url: finalUrl,
      path: filePath,
      folder
    }).catch(() => {})

    return {
      url: finalUrl,
      path: filePath
    }
  } catch (err) {
    console.warn('Supabase storage exception, trying backend fallback:', err.message)
    return await uploadViaBackendFallback(file, folder)
  }
}

/**
 * Persist image entry in database mediaLibrary
 */
export async function recordImageInDatabase(imageInfo) {
  try {
    const { data } = await supabase
      .from('site_content')
      .select('data')
      .eq('key', 'mediaLibrary')
      .single()

    const current = Array.isArray(data?.data) ? data.data : []
    const newEntry = {
      id: 'img_' + Date.now(),
      ...imageInfo,
      uploadedAt: new Date().toISOString()
    }
    const updated = [newEntry, ...current.filter(i => i.url !== imageInfo.url)].slice(0, 100)

    await supabase
      .from('site_content')
      .upsert({
        key: 'mediaLibrary',
        data: updated,
        updated_at: new Date().toISOString()
      })
  } catch (e) {
    console.warn('recordImageInDatabase notice:', e)
  }
}

/**
 * Fallback to backend API upload if direct client upload faces CORS / bucket policy restrictions
 */
async function uploadViaBackendFallback(file, folder) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  // In production without an explicit backend URL, skip localhost fetch to prevent 60-second connection timeouts
  if (!backendUrl && typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    throw new Error('Supabase direct upload failed. Storage bucket unreachable.')
  }

  const targetUrl = backendUrl || 'http://localhost:5000'
  const formData = new FormData()
  formData.append('image', file)
  formData.append('folder', folder)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 6000)

  try {
    const res = await fetch(`${targetUrl}/api/upload`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.message || `Upload failed with status ${res.status}`)
    }

    const result = await res.json()
    return {
      url: result.url,
      path: result.path || ''
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Fetch CMS data from Supabase site_content table
 */
export async function fetchCMSFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')

    if (error) {
      console.warn('Could not fetch site_content from Supabase:', error.message)
      return null
    }

    if (!data || data.length === 0) return null

    // Transform row array [{ key: 'aboutData', data: {...} }] to map
    const mapped = {}
    data.forEach(item => {
      mapped[item.key] = item.data
    })
    return mapped
  } catch (err) {
    console.warn('fetchCMSFromSupabase error:', err)
    return null
  }
}

/**
 * Persist CMS data to Supabase site_content table
 */
export async function persistCMSToSupabase(cmsState) {
  try {
    const entries = Object.entries(cmsState).map(([key, value]) => ({
      key,
      data: value,
      updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('site_content')
      .upsert(entries, { onConflict: 'key' })

    if (error) {
      console.warn('Failed to upsert site_content in Supabase:', error.message)
      return false
    }
    return true
  } catch (err) {
    console.warn('persistCMSToSupabase error:', err)
    return false
  }
}

/**
 * Submit booking reservation to Supabase bookings table
 */
export async function submitBookingToSupabase(bookingData) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          location: bookingData.location,
          session_type: bookingData.sessionType,
          date: bookingData.date,
          time: bookingData.time,
          message: bookingData.message,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.warn('Supabase booking direct insert notice:', error.message)
      // Fallback to backend API
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
      const res = await fetch(`${backendUrl}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      })
      if (!res.ok) {
        throw new Error('Failed to record booking')
      }
      return await res.json()
    }

    return data?.[0] || bookingData
  } catch (err) {
    console.warn('submitBookingToSupabase error:', err)
    throw err
  }
}
