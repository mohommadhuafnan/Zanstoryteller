import { Router } from 'express'
import multer from 'multer'
import { supabase, STORAGE_BUCKET } from '../supabase.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  }
})

/**
 * POST /api/upload
 * Upload image and permanently save its record into the Supabase database.
 * Supports Supabase Storage with graceful database-backed base64 fallback.
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' })
    }

    const folder = req.body.folder || 'portfolio'
    const originalName = req.file.originalname || 'image.jpg'
    const ext = originalName.split('.').pop()
    const cleanName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
    const fileName = `${folder}/${Date.now()}_${cleanName}.${ext}`

    let imageUrl = null
    let storageMethod = 'supabase_storage'

    // 1. Try Supabase Storage bucket first
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          cacheControl: '3600',
          upsert: true
        })

      if (!error) {
        const { data: publicUrlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(fileName)
        imageUrl = publicUrlData.publicUrl
      } else {
        console.warn('Supabase storage upload notice, falling back to database storage:', error.message)
      }
    } catch (storageErr) {
      console.warn('Storage exception:', storageErr.message)
    }

    // 2. If storage bucket is not ready, store directly as database image
    if (!imageUrl) {
      storageMethod = 'database_data_url'
      const base64Data = req.file.buffer.toString('base64')
      imageUrl = `data:${req.file.mimetype};base64,${base64Data}`
    }

    const imageRecord = {
      id: 'img_' + Date.now(),
      name: originalName,
      path: fileName,
      url: imageUrl,
      folder,
      size: req.file.size,
      mimetype: req.file.mimetype,
      storageMethod,
      uploadedAt: new Date().toISOString()
    }

    // 3. Save the image into the Supabase database (site_content -> mediaLibrary)
    try {
      const { data: existingContent } = await supabase
        .from('site_content')
        .select('data')
        .eq('key', 'mediaLibrary')
        .single()

      const currentList = Array.isArray(existingContent?.data) ? existingContent.data : []
      // Prepend newest image
      const updatedList = [imageRecord, ...currentList].slice(0, 100)

      await supabase
        .from('site_content')
        .upsert({
          key: 'mediaLibrary',
          data: updatedList,
          updated_at: new Date().toISOString()
        })
    } catch (dbErr) {
      console.warn('Could not update mediaLibrary in site_content:', dbErr.message)
    }

    return res.status(200).json({
      success: true,
      url: imageUrl,
      path: fileName,
      storageMethod,
      imageRecord
    })
  } catch (err) {
    console.error('Error in /api/upload:', err)
    return res.status(500).json({ error: 'Internal server error', details: err.message })
  }
})

/**
 * GET /api/upload/list
 * Retrieve all images saved in the database
 */
router.get('/list', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('data')
      .eq('key', 'mediaLibrary')
      .single()

    if (error) {
      return res.status(200).json({ files: [] })
    }

    return res.status(200).json({ files: data?.data || [] })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

/**
 * DELETE /api/upload
 * Remove image from database mediaLibrary
 */
router.delete('/', async (req, res) => {
  try {
    const { id, path } = req.body
    if (!id && !path) {
      return res.status(400).json({ error: 'Image id or path required' })
    }

    const { data } = await supabase
      .from('site_content')
      .select('data')
      .eq('key', 'mediaLibrary')
      .single()

    const currentList = Array.isArray(data?.data) ? data.data : []
    const updatedList = currentList.filter(img => img.id !== id && img.path !== path)

    await supabase
      .from('site_content')
      .upsert({
        key: 'mediaLibrary',
        data: updatedList,
        updated_at: new Date().toISOString()
      })

    // Also attempt deleting from storage bucket if path provided
    if (path) {
      supabase.storage.from(STORAGE_BUCKET).remove([path]).catch(() => {})
    }

    return res.status(200).json({ success: true, remaining: updatedList.length })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

export default router
