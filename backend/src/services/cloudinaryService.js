import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

// Configure Cloudinary with environment variables (Never hardcode secrets!)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

/**
 * Upload an image buffer directly to Cloudinary without storing to local filesystem.
 * Automatically converts any incoming image (JPG, PNG, HEIC, TIFF, etc.) to modern WebP format.
 *
 * @param {Buffer} buffer - In-memory image buffer from multer
 * @param {Object} options - Upload options
 * @param {string} [options.folder='zanstoryteller/products'] - Target folder in Cloudinary
 * @param {string} [options.publicId] - Optional specific public ID
 * @returns {Promise<{ url: string, publicId: string, format: string, width: number, height: number, bytes: number }>}
 */
export function uploadImageToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return reject(new Error('Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not configured.'))
    }

    if (!buffer || !Buffer.isBuffer(buffer)) {
      return reject(new Error('Invalid image buffer provided for Cloudinary upload.'))
    }

    const folder = options.folder || 'zanstoryteller/products'

    const uploadOptions = {
      folder,
      resource_type: 'image',
      format: 'webp', // Automatically converts any uploaded file format into WebP
      quality: 'auto:best',
      ...options
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload_stream error:', error)
          return reject(new Error(error.message || 'Failed to upload image to Cloudinary'))
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes
        })
      }
    )

    uploadStream.end(buffer)
  })
}

/**
 * Delete an image from Cloudinary by its publicId
 * @param {string} publicId
 * @returns {Promise<Object>}
 */
export async function deleteImageFromCloudinary(publicId) {
  if (!publicId) return { result: 'not found' }
  return await cloudinary.uploader.destroy(publicId)
}

export { cloudinary }
