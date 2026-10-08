import { Router } from 'express'
import multer from 'multer'
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../services/cloudinaryService.js'
import { supabase } from '../supabase.js'

const router = Router()

// Strict validation: Only allow JPG, JPEG, PNG, and WebP formats
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

const upload = multer({
  storage: multer.memoryStorage(), // In-memory buffer only (Never stored on local filesystem)
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
      cb(null, true)
    } else {
      const error = new Error('Unsupported file type. Only JPG, JPEG, PNG, and WebP images are allowed.')
      error.code = 'INVALID_FILE_TYPE'
      cb(error, false)
    }
  }
})

/**
 * Middleware wrapper to catch Multer file validation and size limit errors cleanly
 */
function handleMulterUpload(req, res, next) {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File too large. Maximum allowed size is 5 MB.'
        })
      }
      if (err.code === 'INVALID_FILE_TYPE' || err.message?.includes('Unsupported file type')) {
        return res.status(400).json({
          success: false,
          error: err.message
        })
      }
      return res.status(400).json({
        success: false,
        error: err.message || 'Image upload validation failed.'
      })
    }
    next()
  })
}

/**
 * POST /api/upload
 * Upload an image directly to Cloudinary storage via in-memory stream.
 * Automatically converts image to WebP and returns secure_url and publicId.
 */
router.post('/', handleMulterUpload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file uploaded. Please select an image.'
      })
    }

    const folderName = req.body.folder || 'products'
    const targetFolder = `zanstoryteller/${folderName}`

    // Upload directly to Cloudinary with WebP conversion
    const uploadResult = await uploadImageToCloudinary(req.file.buffer, {
      folder: targetFolder,
      format: 'webp'
    })

    // Optionally record in database mediaLibrary list (URL only, no binary/base64 stored)
    try {
      const { data: existingContent } = await supabase
        .from('site_content')
        .select('data')
        .eq('key', 'mediaLibrary')
        .single()

      const currentList = Array.isArray(existingContent?.data) ? existingContent.data : []
      const newEntry = {
        id: 'img_' + Date.now(),
        name: req.file.originalname,
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        folder: targetFolder,
        size: uploadResult.bytes || req.file.size,
        format: uploadResult.format || 'webp',
        storageMethod: 'cloudinary',
        uploadedAt: new Date().toISOString()
      }

      await supabase
        .from('site_content')
        .upsert({
          key: 'mediaLibrary',
          data: [newEntry, ...currentList].slice(0, 100),
          updated_at: new Date().toISOString()
        })
    } catch (dbErr) {
      // Non-blocking notice
      console.warn('Database mediaLibrary update notice:', dbErr.message)
    }

    // Required response format
    return res.status(200).json({
      success: true,
      image: {
        url: uploadResult.url,
        publicId: uploadResult.publicId
      },
      url: uploadResult.url,
      publicId: uploadResult.publicId
    })
  } catch (err) {
    console.error('Cloudinary upload failure in /api/upload:', err)
    return res.status(500).json({
      success: false,
      error: 'Cloudinary upload failure',
      message: err.message
    })
  }
})

/**
 * GET /api/upload/list
 * Retrieve media library images list
 */
router.get('/list', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('data')
      .eq('key', 'mediaLibrary')
      .single()

    if (error) {
      return res.status(200).json({ success: true, files: [] })
    }

    return res.status(200).json({ success: true, files: data?.data || [] })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
})

/**
 * DELETE /api/upload
 * Delete image from Cloudinary and remove from mediaLibrary list
 */
router.delete('/', async (req, res) => {
  try {
    const { id, publicId } = req.body
    if (!id && !publicId) {
      return res.status(400).json({ success: false, error: 'Image id or publicId required' })
    }

    if (publicId) {
      await deleteImageFromCloudinary(publicId).catch((err) => {
        console.warn('Cloudinary delete notice:', err.message)
      })
    }

    try {
      const { data } = await supabase
        .from('site_content')
        .select('data')
        .eq('key', 'mediaLibrary')
        .single()

      const currentList = Array.isArray(data?.data) ? data.data : []
      const updatedList = currentList.filter(
        (img) => img.id !== id && img.publicId !== publicId
      )

      await supabase
        .from('site_content')
        .upsert({
          key: 'mediaLibrary',
          data: updatedList,
          updated_at: new Date().toISOString()
        })
    } catch (e) {
      console.warn('Database deletion sync notice:', e.message)
    }

    return res.status(200).json({ success: true, message: 'Image deleted successfully' })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
})

export default router
