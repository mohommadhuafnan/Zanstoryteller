import React, { useState } from 'react'
import { Sparkles, Plus, Trash2 } from 'lucide-react'
import { useCMS } from '../../../context/CMSContext'
import ImageUploadField from '../ImageUploadField'

export default function AboutEditor() {
  const { data, updateAbout } = useCMS()
  const about = data.aboutData || {}

  const handleFieldChange = (field, value) => {
    updateAbout({
      ...about,
      [field]: value
    })
  }

  const handleParagraphChange = (index, value) => {
    const updated = [...(about.paragraphs || [])]
    updated[index] = value
    handleFieldChange('paragraphs', updated)
  }

  const handleAddParagraph = () => {
    const updated = [...(about.paragraphs || []), ""]
    handleFieldChange('paragraphs', updated)
  }

  const handleDeleteParagraph = (index) => {
    if ((about.paragraphs || []).length <= 1) return
    const updated = about.paragraphs.filter((_, i) => i !== index)
    handleFieldChange('paragraphs', updated)
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#0d1b2a] uppercase font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#D8BB7B]" />
          <span>02 / The Storyteller Profile</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">About Zan Storyteller</h2>
        <p className="text-xs text-slate-500 mt-1">
          Update the founder's portrait, core philosophy statements, and introduction biography.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        {/* Founder Portrait Upload */}
        <ImageUploadField
          label="Founder Portrait / Profile Image"
          currentImage={about.image}
          onImageChange={(newImg) => handleFieldChange('image', newImg)}
          onImageDelete={() => handleFieldChange('image', '')}
          aspectHint="Vertical Portrait (e.g. 1000×1300 px)"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Section Label
            </label>
            <input
              type="text"
              value={about.label || ''}
              onChange={(e) => handleFieldChange('label', e.target.value)}
              className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
              placeholder="e.g. ABOUT ZAN STORYTELLER"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Badge / Established Tag
            </label>
            <input
              type="text"
              value={about.badge || ''}
              onChange={(e) => handleFieldChange('badge', e.target.value)}
              className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
              placeholder="e.g. EST. 2020 • CEYLON & WORLDWIDE"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Main Section Heading
            </label>
            <textarea
              rows={2}
              value={about.heading || ''}
              onChange={(e) => handleFieldChange('heading', e.target.value)}
              className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none resize-none font-sans"
              placeholder="WE DON'T JUST\nCAPTURE MOMENTS.\nWE TELL STORIES."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Portrait Alt Text (SEO & Accessibility)
            </label>
            <input
              type="text"
              value={about.imageAlt || ''}
              onChange={(e) => handleFieldChange('imageAlt', e.target.value)}
              className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
              placeholder="e.g. Mohammad Zan - Founder & Cinematographer of Zan Storyteller"
            />
          </div>
        </div>

        {/* Biography Paragraphs */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Biography & Narrative Paragraphs
            </label>
            <button
              type="button"
              onClick={handleAddParagraph}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#0d1b2a] bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Paragraph</span>
            </button>
          </div>

          <div className="space-y-3">
            {(about.paragraphs || []).map((p, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-xs font-mono text-slate-400 mt-3 shrink-0">
                  #{idx + 1}
                </span>
                <textarea
                  rows={2}
                  value={p}
                  onChange={(e) => handleParagraphChange(idx, e.target.value)}
                  className="flex-1 text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none resize-none"
                  placeholder="Enter biography paragraph..."
                />
                {(about.paragraphs || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteParagraph(idx)}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition mt-1"
                    title="Remove paragraph"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
