import React, { useState } from 'react'
import { Sparkles, Plus, Trash2 } from 'lucide-react'
import { useCMS } from '../../../context/CMSContext'
import ImageUploadField from '../ImageUploadField'

export default function PortfolioEditor() {
  const { data, updatePortfolioItem, addPortfolioItem, deletePortfolioItem } = useCMS()
  const items = data.portfolioItems || []
  const categories = data.portfolioCategories || ["WEDDINGS", "PORTRAITS", "EVENTS", "COMMERCIAL"]

  const [isAdding, setIsAdding] = useState(false)
  const [newItem, setNewItem] = useState({
    title: '',
    category: 'WEDDINGS',
    location: 'Sri Lanka',
    year: '2025',
    targetUrl: '/gallery/wedding',
    colSpan: 'col-span-12 sm:col-span-6 md:col-span-6',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85'
  })

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!newItem.title || !newItem.image) return
    addPortfolioItem(newItem)
    setIsAdding(false)
    setNewItem({
      title: '',
      category: 'WEDDINGS',
      location: 'Sri Lanka',
      year: '2025',
      targetUrl: '/gallery/wedding',
      colSpan: 'col-span-12 sm:col-span-6 md:col-span-6',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85'
    })
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#0d1b2a] uppercase font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D8BB7B]" />
            <span>04 / Portfolio Showcase</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Featured Stories Grid</h2>
          <p className="text-xs text-slate-500 mt-1">
            Curate the key portfolio pieces showcased on the main homepage ({items.length} stories).
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0d1b2a] hover:bg-[#1b263b] text-white text-xs font-medium uppercase tracking-wider rounded-xl shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D8BB7B]" />
          <span>Add Story</span>
        </button>
      </div>

      {/* Grid of Portfolio Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-mono font-medium">
                {item.category} • {item.year}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete story "${item.title}"?`)) {
                    deletePortfolioItem(idx)
                  }
                }}
                className="text-slate-400 hover:text-red-600 transition p-1"
                title="Delete portfolio item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <ImageUploadField
              label="Story Cover Photo"
              currentImage={item.image}
              onImageChange={(img) => updatePortfolioItem(idx, { image: img })}
              onImageDelete={() => updatePortfolioItem(idx, { image: '' })}
              aspectHint="Fine art photo (1200×800 or 1000×1200)"
            />

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Story Title
                </label>
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => updatePortfolioItem(idx, { title: e.target.value })}
                  placeholder="e.g. Serenade in Kandy"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Category
                </label>
                <select
                  value={item.category || 'WEDDINGS'}
                  onChange={(e) => updatePortfolioItem(idx, { category: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                >
                  {categories.filter(c => c !== 'ALL').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Year
                </label>
                <input
                  type="text"
                  value={item.year || ''}
                  onChange={(e) => updatePortfolioItem(idx, { year: e.target.value })}
                  placeholder="2025"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={item.location || ''}
                  onChange={(e) => updatePortfolioItem(idx, { location: e.target.value })}
                  placeholder="e.g. Galle Fort, Sri Lanka"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Story Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 mb-1">
              Add Featured Story
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Publish a new portfolio highlight.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <ImageUploadField
                label="Story Cover Photo"
                currentImage={newItem.image}
                onImageChange={(img) => setNewItem({ ...newItem, image: img })}
                onImageDelete={() => setNewItem({ ...newItem, image: '' })}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="e.g. Celestial Twilight"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  >
                    {categories.filter(c => c !== 'ALL').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={newItem.year}
                    onChange={(e) => setNewItem({ ...newItem, year: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  placeholder="e.g. Nuwara Eliya"
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
                  Create Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
