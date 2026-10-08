import { BACKEND_URL } from './apiClient'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

/**
 * Validates and uploads an image to Cloudinary through the backend API.
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

  // 3. Prepare FormData for backend upload
  const formData = new FormData()
  formData.append('image', file)
  formData.append('folder', folder)

  const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('zan_admin_token') : null
  const headers = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const endpoint = `${BACKEND_URL}/api/upload`

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.error || data.message || `Upload failed with status ${response.status}`)
    }

    if (!data.success && !data.url && !data.image?.url) {
      throw new Error(data.error || 'Cloudinary upload failure')
    }

    const finalUrl = data.image?.url || data.url
    const publicId = data.image?.publicId || data.publicId || ''

    return {
      success: true,
      url: finalUrl,
      publicId
    }
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Network failure: Unable to connect to upload server. Please verify backend is running on http://localhost:5000.')
    }
    throw err
  }
}
