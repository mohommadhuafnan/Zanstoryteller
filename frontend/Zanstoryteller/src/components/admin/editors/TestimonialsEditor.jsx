import React, { useState } from 'react'
import { Sparkles, Plus, Trash2, Quote } from 'lucide-react'
import { useCMS } from '../../../context/CMSContext'

export default function TestimonialsEditor() {
  const { data, updateTestimonial, addTestimonial, deleteTestimonial } = useCMS()
  const testimonials = data.testimonialsData || []
  const [isAdding, setIsAdding] = useState(false)
  const [newTestimonial, setNewTestimonial] = useState({
    author: '',
    role: '',
    date: '2025',
    quote: ''
  })

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!newTestimonial.author || !newTestimonial.quote) return
    addTestimonial(newTestimonial)
    setIsAdding(false)
    setNewTestimonial({
      author: '',
      role: '',
      date: '2025',
      quote: ''
    })
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#0d1b2a] uppercase font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D8BB7B]" />
            <span>08 / Client Reflections</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Client Testimonials & Reviews</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage genuine client reviews and testimonials shown on the website ({testimonials.length} reviews).
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0d1b2a] hover:bg-[#1b263b] text-white text-xs font-medium uppercase tracking-wider rounded-xl shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D8BB7B]" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Grid of Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((test, idx) => (
          <div
            key={test.id || idx}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Quote className="w-3.5 h-3.5 text-[#D8BB7B]" />
                Review #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete review from "${test.author}"?`)) {
                    deleteTestimonial(idx)
                  }
                }}
                className="text-slate-400 hover:text-red-600 transition p-1"
                title="Delete testimonial"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Client / Couple Names
                </label>
                <input
                  type="text"
                  value={test.author || ''}
                  onChange={(e) => updateTestimonial(idx, { author: e.target.value })}
                  placeholder="e.g. Elena & David"
                  className="w-full text-sm font-semibold p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                    Occasion / Location
                  </label>
                  <input
                    type="text"
                    value={test.role || ''}
                    onChange={(e) => updateTestimonial(idx, { role: e.target.value })}
                    placeholder="e.g. Destination Wedding, Galle"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={test.date || ''}
                    onChange={(e) => updateTestimonial(idx, { date: e.target.value })}
                    placeholder="November 2024"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Quote / Feedback
                </label>
                <textarea
                  rows={4}
                  value={test.quote || ''}
                  onChange={(e) => updateTestimonial(idx, { quote: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a] resize-none"
                  placeholder="Enter client review quote..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Testimonial Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 mb-1">
              Add New Client Review
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Feature an authentic client reflection.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Client Names *
                </label>
                <input
                  type="text"
                  required
                  value={newTestimonial.author}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, author: e.target.value })}
                  placeholder="e.g. Maya & Roshan"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Occasion
                  </label>
                  <input
                    type="text"
                    value={newTestimonial.role}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                    placeholder="e.g. Sunset Ceremony, Bentota"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={newTestimonial.date}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, date: e.target.value })}
                    placeholder="2025"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Review Quote *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newTestimonial.quote}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                  placeholder="Words from the client..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none resize-none"
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
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
