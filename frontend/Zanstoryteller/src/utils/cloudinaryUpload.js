import { uploadImageToSupabase, recordImageInDatabase } from './supabase'

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
 * supporting any image size and format.
 * 
 * @param {File} file - Selected image file (PNG, JPG, WebP, AVIF, HEIC, TIFF, etc.)
 * @param {string} [folder='products'] - Target folder in Cloudinary
 * @returns {Promise<{ success: boolean, url: string, publicId: string }>}
 */
export async function uploadImageToCloudinary(file, folder = 'products') {
  if (!file) {
    throw new Error('No image file selected.')
  }

  // Allow any image file without artificial size limits
  const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|avif|gif|bmp|tiff|heic|svg)$/i.test(file.name)
  if (!isImage) {
    throw new Error('Unsupported file. Please select a valid image file.')
  }

  // 1. Direct Cloudinary REST API Upload with automatic WebP conversion
  try {
    const targetFolder = `zanstoryteller/${folder}`
    const timestamp = Math.floor(Date.now() / 1000)

    // Sign request parameters in exact alphabetical order: folder, format, timestamp
    const strToSign = `folder=${targetFolder}&format=webp&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`
    const signature = await computeSha1(strToSign)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', CLOUDINARY_API_KEY)
    formData.append('timestamp', String(timestamp))
    formData.append('folder', targetFolder)
    formData.append('format', 'webp')
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

  // 2. Resilient Fallback 1: Serverless /api/upload (Cloudinary server-side WebP conversion)
  try {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('folder', folder)

    const serverUploadRes = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (serverUploadRes.ok) {
      const data = await serverUploadRes.json()
      if (data && data.url) {
        return {
          success: true,
          url: data.url,
          publicId: data.publicId || data.path || ''
        }
      }
    }
  } catch (serverErr) {
    console.warn('/api/upload fallback notice:', serverErr.message)
  }

  // 3. Resilient Fallback 2: Supabase Storage direct upload
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

  throw new Error('Image upload failed. Please verify your connection.')
}
