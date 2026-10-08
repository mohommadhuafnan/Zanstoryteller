import { uploadImageToSupabase, recordImageInDatabase } from './supabase'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dtpeeydfz'
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '566583749895769'
const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET || 'K8YAdHcTQAJdhpBbpPUAdCn6Eko'

/**
 * Computes SHA-1 hash using Web Crypto API
 */
async function computeSha1(text) {
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest('SHA-1', enc.encode(text))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Validates and uploads an image directly to Cloudinary storage with automatic WebP conversion,
 * with seamless fallback to Supabase storage.
 * 
 * @param {File} file - Selected image file
 * @param {string} [folder='products'] - Target folder in Cloudinary
 * @returns {Promise<{ success: boolean, url: string, publicId: string }>}
 */
export async function uploadImageToCloudinary(file, folder = 'products') {
  if (!file) {
    throw new Error('No image file selected.')
  }

  // 1. Image format validation (JPG/JPEG, PNG, WebP)
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    throw new Error('Unsupported file type. Only JPG, JPEG, PNG, and WebP images are allowed.')
  }

  // 2. File size validation (Maximum 5 MB)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
    throw new Error(`File is too large (${sizeMb} MB). Maximum allowed size is 5 MB.`)
  }

  // 3. Direct Cloudinary REST API Upload
  try {
    const targetFolder = `zanstoryteller/${folder}`
    const timestamp = Math.floor(Date.now() / 1000)

    // Sign request parameters
    const strToSign = `folder=${targetFolder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`
    const signature = await computeSha1(strToSign)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', CLOUDINARY_API_KEY)
    formData.append('timestamp', String(timestamp))
    formData.append('folder', targetFolder)
    formData.append('signature', signature)

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      const data = await response.json()
      // Apply Cloudinary automatic WebP & quality optimization
      const finalUrl = data.secure_url
        ? data.secure_url.replace('/upload/', '/upload/f_auto,q_auto/')
        : data.url

      // Persist in media library catalog
      recordImageInDatabase({
        name: file.name,
        url: finalUrl,
        path: data.public_id,
        folder: targetFolder,
        format: data.format || 'webp'
      }).catch(() => {})

      return {
        success: true,
        url: finalUrl,
        publicId: data.public_id || ''
      }
    }

    const errData = await response.json().catch(() => ({}))
    console.warn('Cloudinary direct upload status notice:', response.status, errData)
  } catch (cloudinaryErr) {
    console.warn('Cloudinary direct upload attempt notice:', cloudinaryErr.message)
  }

  // 4. Resilient Fallback: Supabase Storage direct upload
  try {
    const fallbackRes = await uploadImageToSupabase(file, folder)
    if (fallbackRes && fallbackRes.url) {
      return {
        success: true,
        url: fallbackRes.url,
        publicId: fallbackRes.path || ''
      }
    }
  } catch (supabaseErr) {
    console.error('Supabase fallback upload error:', supabaseErr.message)
  }

  throw new Error('Image upload failed. Please verify your internet connection.')
}
