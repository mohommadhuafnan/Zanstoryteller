import { v2 as cloudinary } from 'cloudinary'
import busboy from 'busboy'
import { Readable } from 'stream'

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || 'dtpeeydfz'
const API_KEY = process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY || '566583749895769'
const API_SECRET = process.env.CLOUDINARY_API_SECRET || process.env.VITE_CLOUDINARY_API_SECRET || 'K8YAdHcTQAJdhpBbpPUAdCn6Eko'

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true
})

export { cloudinary }

/**
 * Parses multipart form data from Node/Vercel HTTP incoming request stream or body
 */
export function parseMultipartForm(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || req.headers['Content-Type'] || ''
    if (!contentType.includes('multipart/form-data')) {
      return resolve({ fields: {}, fileBuffer: null, fileName: '', fileMime: '' })
    }

    try {
      const bb = busboy({ headers: req.headers, limits: { fileSize: 100 * 1024 * 1024 } })
      const fields = {}
      let fileBuffer = null
      let fileName = 'upload.jpg'
      let fileMime = 'image/jpeg'

      bb.on('file', (name, file, info) => {
        fileName = info.filename || 'upload.jpg'
        fileMime = info.mimeType || 'image/jpeg'
        const chunks = []
        file.on('data', (data) => chunks.push(data))
        file.on('end', () => {
          fileBuffer = Buffer.concat(chunks)
        })
      })

      bb.on('field', (name, val) => {
        fields[name] = val
      })

      bb.on('close', () => {
        resolve({ fields, fileBuffer, fileName, fileMime })
      })

      bb.on('error', (err) => {
        reject(err)
      })

      if (Buffer.isBuffer(req.body)) {
        bb.end(req.body)
      } else if (typeof req.body === 'string') {
        bb.end(Buffer.from(req.body))
      } else if (typeof req.pipe === 'function') {
        req.pipe(bb)
      } else if (Symbol.asyncIterator in Object(req)) {
        Readable.from(req).pipe(bb)
      } else {
        bb.end()
      }
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Upload an image buffer directly to Cloudinary with automatic WebP conversion,
 * supporting any image size and format (PNG, JPG, HEIC, TIFF, AVIF, WebP, etc.).
 *
 * @param {Buffer} buffer - Raw image buffer
 * @param {Object} options - Upload options
 * @returns {Promise<{ url: string, publicId: string, format: string, bytes: number }>}
 */
export function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const folder = options.folder || 'zanstoryteller/products'
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'webp', // Automatically convert any uploaded image to WebP
        ...options
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload_stream error:', error)
          return reject(new Error(error.message || 'Failed to upload image to Cloudinary'))
        }

        const secureUrl = result.secure_url
          ? result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/')
          : result.url

        resolve({
          url: secureUrl,
          publicId: result.public_id,
          format: result.format || 'webp',
          width: result.width,
          height: result.height,
          bytes: result.bytes
        })
      }
    )

    uploadStream.end(buffer)
  })
}
