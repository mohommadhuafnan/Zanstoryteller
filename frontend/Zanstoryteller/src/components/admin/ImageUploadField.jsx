import React, { useState, useRef } from 'react'
import { Upload, Link2, Trash2, Eye, Check, X, RefreshCw, Image as ImageIcon, Cloud } from 'lucide-react'
import { uploadImageToCloudinary } from '../../utils/cloudinaryUpload'
import { isValidImageUrl } from '../../utils/imageHandler'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export default function ImageUploadField({
  label = "Section Image",
  currentImage,
  onImageChange,
  onImageDelete,
  aspectHint = "Supported: JPG, PNG, WebP (Max 5MB) - Automatically converted to WebP",
  allowDelete = true
}) {
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [previewZoom, setPreviewZoom] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [localPreview, setLocalPreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 1. Validation: Allowed formats
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      alert("Invalid image format! Only JPG, JPEG, PNG, and WebP files are supported.")
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // 2. Validation: Maximum file size (5 MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      alert(`File is too large (${sizeMb} MB). Maximum allowed size is 5 MB.`)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // 3. Show instant preview in admin UI before/during upload
    const objectUrl = URL.createObjectURL(file)
    setLocalPreview(objectUrl)

    try {
      setIsUploading(true)
      setUploadStatus('Uploading to Cloudinary (Converting to WebP)...')

      // 4. Upload to Cloudinary via backend service
      const res = await uploadImageToCloudinary(file, 'products')

      if (res && res.url) {
        onImageChange(res.url)
      } else {
        throw new Error('No Cloudinary URL returned from upload service.')
      }
    } catch (err) {
      console.error("Cloudinary upload failed:", err)
      alert(`Upload failed: ${err.message}`)
      setLocalPreview(null) // Revert preview on failure
    } finally {
      setIsUploading(false)
      setUploadStatus('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleUrlSubmit = (e) => {
    e.preventDefault()
    if (!urlInput.trim()) return

    if (!isValidImageUrl(urlInput)) {
      alert("Please provide a valid image URL (http/https or relative path)")
      return
    }

    setLocalPreview(null)
    onImageChange(urlInput.trim())
    setUrlInput('')
    setIsUrlModalOpen(false)
  }

  const handleDelete = () => {
    if (window.confirm("Remove this image?")) {
      setLocalPreview(null)
      if (onImageDelete) onImageDelete()
    }
  }

  const displayedImage = localPreview || currentImage

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        {aspectHint && (
          <span className="text-[11px] text-slate-400 font-mono">
            {aspectHint}
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
        {/* Thumbnail Preview: Shows instant preview before/during upload and uploaded image after */}
        <div className="relative group w-28 h-20 sm:w-32 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shadow-sm flex items-center justify-center">
          {displayedImage ? (
            <>
              <img
                src={displayedImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div 
                onClick={() => setPreviewZoom(true)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition text-white"
                title="View full size"
              >
                <Eye className="w-5 h-5" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 text-xs">
              <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
              <span>No image</span>
            </div>
          )}

          {/* Loading/Uploading State */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white text-[10px] font-mono text-center p-2 z-20">
              <RefreshCw className="w-4 h-4 animate-spin mb-1 text-[#D8BB7B]" />
              <span className="line-clamp-2 leading-tight">{uploadStatus || 'Uploading...'}</span>
            </div>
          )}
        </div>

        {/* Controls & Action Buttons */}
        <div className="flex-1 min-w-0 space-y-2 w-full">
          <div className="flex flex-wrap items-center gap-2">
            {/* Hidden File Input (Enforces image/* accept with strict 5MB backend check) */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />

            {/* Upload from PC */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0d1b2a] hover:bg-[#1b263b] text-white rounded-lg text-xs font-medium tracking-wide shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5 text-[#D8BB7B]" />
              <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
            </button>

            {/* Paste Image URL */}
            <button
              type="button"
              onClick={() => setIsUrlModalOpen(true)}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium tracking-wide shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              <Link2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Paste URL</span>
            </button>

            {/* Delete / Clear Image */}
            {allowDelete && displayedImage && onImageDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>

          {/* Current Path & Format Info Display */}
          <div className="text-[11px] text-slate-500 truncate max-w-md font-mono flex items-center gap-2">
            {currentImage?.includes('cloudinary.com') ? (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-sans text-[10px] font-semibold flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600 inline" /> Cloudinary Storage (WebP HD)
              </span>
            ) : currentImage?.includes('supabase.co') || currentImage?.includes('zanstoryteller-images') ? (
              <span className="text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded font-sans text-[10px] font-semibold flex items-center gap-1">
                <Cloud className="w-3 h-3 text-sky-600 inline" /> Cloud Storage
              </span>
            ) : currentImage?.startsWith('data:image/webp') ? (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-sans text-[10px] font-semibold flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600 inline" /> WebP Format
              </span>
            ) : (
              <span className="truncate" title={currentImage}>{currentImage || 'No image attached'}</span>
            )}
          </div>
        </div>
      </div>

      {/* URL Input Modal */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Paste Image URL
              </h3>
              <button
                onClick={() => setIsUrlModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
                className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
                autoFocus
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUrlModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium bg-[#0d1b2a] text-white rounded-xl shadow-md hover:bg-[#1b263b] transition"
                >
                  Apply Image URL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Preview Zoom Modal */}
      {previewZoom && displayedImage && (
        <div
          onClick={() => setPreviewZoom(false)}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-black rounded-lg overflow-hidden border border-white/20">
            <img
              src={displayedImage}
              alt="Zoom Preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setPreviewZoom(false)}
              className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
