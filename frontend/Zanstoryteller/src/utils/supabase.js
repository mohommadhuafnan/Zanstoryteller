import { createClient } from '@supabase/supabase-js'
import { apiFetch, BACKEND_URL } from './apiClient'

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

  let fileToUpload = file
  if (file instanceof File || file instanceof Blob) {
    try {
      const { compressImageFile } = await import('./imageHandler')
      const compressed = await compressImageFile(file, { maxWidth: 2400, maxHeight: 2400, quality: 0.88 })
      if (compressed?.file) {
        fileToUpload = compressed.file
      }
    } catch (convErr) {
      console.warn('Pre-upload WebP conversion notice:', convErr?.message)
    }
  }

  const fileExt = fileToUpload.name ? fileToUpload.name.split('.').pop() : 'webp'
  const cleanBaseName = fileToUpload.name ? fileToUpload.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_") : 'image'
  const filePath = `${folder}/${Date.now()}_${cleanBaseName}.${fileExt}`

  // Try direct Supabase Storage upload
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: true,
        contentType: fileToUpload.type || 'image/webp'
      })

    if (error) {
      console.warn('Direct Supabase storage upload notice:', error.message)
      // Attempt backend fallback if available
      return await uploadViaBackendFallback(fileToUpload, folder)
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
  const targetUrl = BACKEND_URL || ''
  const formData = new FormData()
  formData.append('image', file)
  formData.append('folder', folder)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

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
    const payload = {
      name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone,
      location: bookingData.location || 'Studio / To be agreed',
      session_type: bookingData.sessionType || bookingData.session_type || 'Photoshoot',
      date: bookingData.date || null,
      time: bookingData.time || null,
      message: bookingData.message || '',
      status: 'pending',
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([payload])
      .select()

    const created = data?.[0] || payload

    // Dispatch instant notification email to administrator
    apiFetch('/api/notify-booking', {
      method: 'POST',
      body: JSON.stringify(created)
    }).catch((e) => console.warn('Email notify API notice:', e.message))

    if (error) {
      console.warn('Supabase booking direct insert notice:', error.message)
      // Fallback to backend API
      const backendUrl = BACKEND_URL
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

    return created
  } catch (err) {
    console.warn('submitBookingToSupabase error:', err)
    throw err
  }
}
