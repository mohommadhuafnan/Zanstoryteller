import React from 'react'
import { Sparkles } from 'lucide-react'
import { useCMS } from '../../../context/CMSContext'
import ImageUploadField from '../ImageUploadField'

export default function VisualStatementEditor() {
  const { data, updateVisualStatement } = useCMS()
  const vs = data.visualStatementData || {}

  const handleFieldChange = (field, value) => {
    updateVisualStatement({
      ...vs,
      [field]: value
    })
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#0d1b2a] uppercase font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#D8BB7B]" />
          <span>07 / Cinematic Statement</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sticky Visual Statement</h2>
        <p className="text-xs text-slate-500 mt-1">
          The full-screen dramatic image and typography section that pins in place as testimonials scroll up.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <ImageUploadField
          label="Dramatic Background Statement Image"
          currentImage={vs.image}
          onImageChange={(img) => handleFieldChange('image', img)}
          onImageDelete={() => handleFieldChange('image', '')}
          aspectHint="Full Bleed Landscape (2000×1200 px)"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
              Top Label
            </label>
            <input
              type="text"
              value={vs.label || ''}
              onChange={(e) => handleFieldChange('label', e.target.value)}
              placeholder="ZAN STORYTELLER"
              className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
              Subtext
            </label>
            <input
              type="text"
              value={vs.subtext || ''}
              onChange={(e) => handleFieldChange('subtext', e.target.value)}
              placeholder="Photographs that endure when words fade."
              className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
              Main Headline (Use Line Breaks)
            </label>
            <textarea
              rows={3}
              value={vs.heading || ''}
              onChange={(e) => handleFieldChange('heading', e.target.value)}
              className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none resize-none font-bold uppercase tracking-wider"
              placeholder="YOUR MOMENTS\nDESERVE\nTO BE REMEMBERED."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
