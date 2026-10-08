import React, { useState } from 'react'
import { Sparkles, Plus, Trash2 } from 'lucide-react'
import { useCMS } from '../../../context/CMSContext'
import ImageUploadField from '../ImageUploadField'

export default function EditorialCarouselEditor() {
  const { data, updateEditorialImage, addEditorialImage, deleteEditorialImage } = useCMS()
  const [isAdding, setIsAdding] = useState(false)
  const [newImage, setNewImage] = useState({
    title: '',
    subtitle: '',
    alt: '',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85'
  })

  const images = data.editorialCarouselImages || []

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!newImage.image) return
    addEditorialImage(newImage)
    setIsAdding(false)
    setNewImage({
      title: '',
      subtitle: '',
      alt: '',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85'
    })
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#0d1b2a] uppercase font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D8BB7B]" />
            <span>02.5 / Horizontal Scroller</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Editorial Moments Carousel</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage the infinite horizontally-scrollable editorial photoshoot series ({images.length} frames).
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0d1b2a] hover:bg-[#1b263b] text-white text-xs font-medium uppercase tracking-wider rounded-xl shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D8BB7B]" />
          <span>Add Carousel Photo</span>
        </button>
      </div>

      {/* Grid of Carousel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((item, idx) => (
          <div
            key={item.id || idx}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 relative"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-mono font-medium">
                Frame #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete photo "${item.title || 'Frame ' + (idx + 1)}"?`)) {
                    deleteEditorialImage(idx)
                  }
                }}
                className="text-slate-400 hover:text-red-600 transition p-1"
                title="Delete photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <ImageUploadField
              label="Carousel Image"
              currentImage={item.image}
              onImageChange={(img) => updateEditorialImage(idx, { image: img })}
              onImageDelete={() => updateEditorialImage(idx, { image: '' })}
              aspectHint="Vertical or square editorial photo"
            />

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => updateEditorialImage(idx, { title: e.target.value })}
                  placeholder="e.g. Midnight Noir Abaya"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Subtitle / Collection
                </label>
                <input
                  type="text"
                  value={item.subtitle || ''}
                  onChange={(e) => updateEditorialImage(idx, { subtitle: e.target.value })}
                  placeholder="e.g. Archival Modest Couture"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Alt Description
                </label>
                <input
                  type="text"
                  value={item.alt || ''}
                  onChange={(e) => updateEditorialImage(idx, { alt: e.target.value })}
                  placeholder="Description of the frame"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Slide Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 mb-1">
              Add Carousel Photo
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Insert a new photo into the editorial scroller.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <ImageUploadField
                label="Photo"
                currentImage={newImage.image}
                onImageChange={(img) => setNewImage({ ...newImage, image: img })}
                onImageDelete={() => setNewImage({ ...newImage, image: '' })}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  placeholder="e.g. Desert Twilight"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={newImage.subtitle}
                  onChange={(e) => setNewImage({ ...newImage, subtitle: e.target.value })}
                  placeholder="e.g. Fine Art Couture"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium bg-[#0d1b2a] text-white rounded-xl shadow-md hover:bg-[#1b263b] transition"
                >
                  Add Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
