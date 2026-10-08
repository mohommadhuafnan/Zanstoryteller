import React, { useState } from 'react'
import { Sparkles, Plus, Trash2, Folder, Image as ImageIcon } from 'lucide-react'
import { useCMS } from '../../../context/CMSContext'
import ImageUploadField from '../ImageUploadField'

export default function MasterAlbumEditor() {
  const { data, updateCategory, addGalleryImageToCategory, deleteGalleryImageFromCategory } = useCMS()
  const categories = data.galleryCategories || []
  const [selectedCatIndex, setSelectedCatIndex] = useState(0)
  const [isAddingImage, setIsAddingImage] = useState(false)
  const [newImage, setNewImage] = useState({
    title: '',
    client: 'FEATURED',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85'
  })

  const currentCat = categories[selectedCatIndex] || categories[0]

  const handleCatFieldChange = (field, value) => {
    updateCategory(selectedCatIndex, { [field]: value })
  }

  const handleAddImageSubmit = (e) => {
    e.preventDefault()
    if (!newImage.url) return
    addGalleryImageToCategory(selectedCatIndex, newImage)
    setIsAddingImage(false)
    setNewImage({
      title: '',
      client: 'FEATURED',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85'
    })
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#0d1b2a] uppercase font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D8BB7B]" />
            <span>Portfolio & Master Album</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">14 Photography Categories</h2>
          <p className="text-xs text-slate-500 mt-1">
            Control titles, taglines, cover images, and individual gallery collections across all categories.
          </p>
        </div>

        <button
          onClick={() => setIsAddingImage(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0d1b2a] hover:bg-[#1b263b] text-white text-xs font-medium uppercase tracking-wider rounded-xl shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D8BB7B]" />
          <span>Add Photo to Category</span>
        </button>
      </div>

      {/* Category Selection Carousel / Grid */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat, idx) => (
          <button
            key={cat.id || idx}
            onClick={() => setSelectedCatIndex(idx)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              selectedCatIndex === idx
                ? 'bg-[#0d1b2a] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Folder className={`w-3.5 h-3.5 ${selectedCatIndex === idx ? 'text-[#D8BB7B]' : 'text-slate-400'}`} />
            <span>{cat.title}</span>
          </button>
        ))}
      </div>

      {/* Category Editor */}
      {currentCat && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-mono text-xs font-bold text-[#D8BB7B] bg-[#0d1b2a] px-2.5 py-1 rounded">
                CATEGORY {selectedCatIndex + 1} OF {categories.length}
              </span>
              <span className="text-xs text-slate-500">
                {(currentCat.galleryImages || []).length} Showcase Photos
              </span>
            </div>

            <ImageUploadField
              label="Category Cover Image"
              currentImage={currentCat.coverImage}
              onImageChange={(img) => handleCatFieldChange('coverImage', img)}
              onImageDelete={() => handleCatFieldChange('coverImage', '')}
              aspectHint="Hero cover photo for category page (1400×900 px)"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                  Category Title (Capital Letters)
                </label>
                <input
                  type="text"
                  value={currentCat.title || ''}
                  onChange={(e) => handleCatFieldChange('title', e.target.value)}
                  className="w-full text-base font-bold uppercase p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={currentCat.tagline || ''}
                  onChange={(e) => handleCatFieldChange('tagline', e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                  Slug / URL Identifier
                </label>
                <input
                  type="text"
                  value={currentCat.slug || ''}
                  onChange={(e) => handleCatFieldChange('slug', e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                  Category Story Description
                </label>
                <textarea
                  rows={3}
                  value={currentCat.description || ''}
                  onChange={(e) => handleCatFieldChange('description', e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Category Gallery Images Grid */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                Showcase Photos In This Category ({(currentCat.galleryImages || []).length})
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingImage(true)}
                className="text-xs text-[#0d1b2a] hover:underline font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload New</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {(currentCat.galleryImages || []).map((img, i) => (
                <div key={img.id || i} className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[4/3]">
                  <img
                    src={img.url}
                    alt={img.title || 'Category photo'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition p-2.5 flex flex-col justify-between text-white">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Remove this photo from category?")) {
                          deleteGalleryImageFromCategory(selectedCatIndex, i)
                        }
                      }}
                      className="self-end p-1.5 bg-red-600/80 hover:bg-red-600 rounded-lg text-white"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-[10px] truncate">
                      <p className="font-semibold truncate">{img.title || 'Untitled'}</p>
                      <p className="opacity-75 font-mono">{img.client || 'Client'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {isAddingImage && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 mb-1">
              Add Photo to {currentCat.title}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Upload from your computer or paste an image URL.
            </p>

            <form onSubmit={handleAddImageSubmit} className="space-y-4">
              <ImageUploadField
                label="Photo"
                currentImage={newImage.url}
                onImageChange={(img) => setNewImage({ ...newImage, url: img })}
                onImageDelete={() => setNewImage({ ...newImage, url: '' })}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Photo Title
                </label>
                <input
                  type="text"
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  placeholder="e.g. Golden Glow of Motherhood"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Client / Series Tag
                </label>
                <input
                  type="text"
                  value={newImage.client}
                  onChange={(e) => setNewImage({ ...newImage, client: e.target.value })}
                  placeholder="e.g. AMARA"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingImage(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium bg-[#0d1b2a] text-white rounded-xl shadow-md hover:bg-[#1b263b] transition"
                >
                  Insert Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
