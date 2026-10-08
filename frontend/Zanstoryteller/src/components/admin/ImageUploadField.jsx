import React, { useState, useRef } from 'react'
import { Upload, Link2, Trash2, Eye, Check, X, RefreshCw, Image as ImageIcon, Cloud } from 'lucide-react'
import { compressImageFile, fileToBase64, isValidImageUrl, formatBytes } from '../../utils/imageHandler'
import { uploadImageToSupabase } from '../../utils/supabase'

export default function ImageUploadField({
  label = "Section Image",
  currentImage,
  onImageChange,
  onImageDelete,
  aspectHint = "Recommended: High resolution 1600×1200 or 1920×1080",
  allowDelete = true
}) {
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [previewZoom, setPreviewZoom] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      setUploadStatus('Optimizing image...')

      // Step 1: Ultra-fast client-side WebP optimization
      // Shrinks raw 10MB-40MB camera photos to lightweight ~200-400KB WebP in ~100ms
      const { file: optimizedFile, compressedSize } = await compressImageFile(file, {
        maxWidth: 2200,
        maxHeight: 2200,
        quality: 0.85
      })

      const sizeLabel = formatBytes(compressedSize)
      setUploadStatus(`Uploading (${sizeLabel})...`)
      
      // Step 2: Stream the compressed 250KB WebP directly to Supabase Storage (<1 second)
      try {
        const uploadRes = await uploadImageToSupabase(optimizedFile, 'site-media')
        if (uploadRes && uploadRes.url) {
          onImageChange(uploadRes.url)
          return
        }
      } catch (storageErr) {
        console.warn("Supabase storage upload failed, falling back to local encoding:", storageErr)
      }

      // Step 3: Safe fallback with bounded base64 if storage is completely offline
      setUploadStatus('Saving local copy...')
      const base64 = await fileToBase64(optimizedFile, 1600, 1600, 0.80)
      onImageChange(base64)
    } catch (err) {
      alert("Error processing image: " + err.message)
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

    onImageChange(urlInput.trim())
    setUrlInput('')
    setIsUrlModalOpen(false)
  }

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
        {/* Thumbnail Preview */}
        <div className="relative group w-28 h-20 sm:w-32 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shadow-sm flex items-center justify-center">
          {currentImage ? (
            <>
              <img
                src={currentImage}
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

          {isUploading && (
            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white text-[10px] font-mono text-center p-1">
              <RefreshCw className="w-4 h-4 animate-spin mb-1 text-[#D8BB7B]" />
              <span className="line-clamp-2">{uploadStatus || 'Uploading...'}</span>
            </div>
          )}
        </div>

        {/* Controls & Action Buttons */}
        <div className="flex-1 min-w-0 space-y-2 w-full">
          <div className="flex flex-wrap items-center gap-2">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />

            {/* Upload from PC */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0d1b2a] hover:bg-[#1b263b] text-white rounded-lg text-xs font-medium tracking-wide shadow-sm transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#D8BB7B]" />
              <span>Upload from PC</span>
            </button>

            {/* Paste Image URL */}
            <button
              type="button"
              onClick={() => setIsUrlModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium tracking-wide shadow-sm transition cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Paste URL</span>
            </button>

            {/* Delete / Clear Image */}
            {allowDelete && currentImage && onImageDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Remove this image?")) {
                    onImageDelete()
                  }
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>

          {/* Current Path & Format Info */}
          <div className="text-[11px] text-slate-500 truncate max-w-md font-mono flex items-center gap-2">
            {currentImage?.includes('supabase.co') || currentImage?.includes('zanstoryteller-images') ? (
              <span className="text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded font-sans text-[10px] font-semibold flex items-center gap-1">
                <Cloud className="w-3 h-3 text-sky-600 inline" /> Supabase Cloud Storage (Fast CDN)
              </span>
            ) : currentImage?.startsWith('data:image/webp') ? (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-sans text-[10px] font-semibold flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600 inline" /> Converted to WebP (HD Quality Preserved)
              </span>
            ) : currentImage?.startsWith('data:image') ? (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-sans text-[10px] font-semibold flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600 inline" /> Converted to Web-Ready Image
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
                placeholder="https://images.unsplash.com/... or /about/...webp"
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
      {previewZoom && currentImage && (
        <div
          onClick={() => setPreviewZoom(false)}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-black rounded-lg overflow-hidden border border-white/20">
            <img
              src={currentImage}
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
