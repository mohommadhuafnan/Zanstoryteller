import React, { useState } from 'react'
import { Sparkles, Plus, Trash2, X, Check } from 'lucide-react'
import { useCMS } from '../../../context/CMSContext'
import ImageUploadField from '../ImageUploadField'

export default function StoryScrollEditor() {
  const { data, updateStoryScrollStep, addStoryScrollStep, deleteStoryScrollStep } = useCMS()
  const steps = data.storyScrollSteps || []
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newStepData, setNewStepData] = useState({
    stage: '',
    category: '',
    keyword: '',
    quote: '',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85',
    alt: 'Cinematic visual frame'
  })

  const handleOpenAddModal = () => {
    const nextStage = String(steps.length + 1).padStart(2, '0')
    setNewStepData({
      stage: nextStage,
      category: `${nextStage} / Visual Symphony`,
      keyword: 'ETERNAL',
      quote: 'Frames that capture the pure essence of human devotion and timeless beauty.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85',
      alt: 'Artistic photography composition'
    })
    setIsAddModalOpen(true)
  }

  const handleCreateStep = (e) => {
    e.preventDefault()
    if (!newStepData.keyword.trim()) {
      alert("Please provide a core keyword")
      return
    }
    addStoryScrollStep({
      ...newStepData,
      keyword: newStepData.keyword.toUpperCase().trim()
    })
    setIsAddModalOpen(false)
  }

  const handleDeleteStep = (idx, stepName) => {
    if (steps.length <= 1) {
      alert("At least one philosophy step must remain.")
      return
    }
    if (window.confirm(`Delete pillar "${stepName || idx + 1}"?`)) {
      deleteStoryScrollStep(idx)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#0d1b2a] uppercase font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D8BB7B]" />
            <span>05 / Philosophy Scrollytelling</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">The Story Behind The Frame</h2>
          <p className="text-xs text-slate-500 mt-1">
            Edit the {steps.length} core philosophy pillars (Light, Emotion, Detail, Timeless, Heritage) that stick and transform during scrolling.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0d1b2a] hover:bg-[#1b263b] text-white rounded-xl text-xs font-semibold tracking-wider uppercase shadow-md transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#D8BB7B]" />
          <span>Add Philosophy Pillar</span>
        </button>
      </div>

      <div className="space-y-6">
        {steps.map((step, idx) => (
          <div
            key={step.stage || idx}
            className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-mono text-xs font-bold">
                  STAGE {step.stage || idx + 1}
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  Pillar {step.stage || idx + 1}: {step.keyword}
                </h3>
              </div>

              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteStep(idx, step.keyword)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition cursor-pointer"
                  title="Remove this pillar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Pillar</span>
                </button>
              )}
            </div>

            <ImageUploadField
              label={`Pillar ${step.stage || idx + 1} Background Visual`}
              currentImage={step.image}
              onImageChange={(img) => updateStoryScrollStep(idx, { image: img })}
              onImageDelete={() => updateStoryScrollStep(idx, { image: '' })}
              aspectHint="Cinematic Landscape (1920×1080 px • WebP Auto-Converted)"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  value={step.category || ''}
                  onChange={(e) => updateStoryScrollStep(idx, { category: e.target.value })}
                  placeholder="e.g. 01 / Atmospheric Element"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Core Keyword
                </label>
                <input
                  type="text"
                  value={step.keyword || ''}
                  onChange={(e) => updateStoryScrollStep(idx, { keyword: e.target.value })}
                  placeholder="e.g. LIGHT"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a] font-bold tracking-wider"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Philosophical Quote
                </label>
                <textarea
                  rows={2}
                  value={step.quote || ''}
                  onChange={(e) => updateStoryScrollStep(idx, { quote: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a] resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add New Philosophy Step */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D8BB7B]" />
                <h3 className="text-base font-bold uppercase tracking-wider text-slate-900">
                  Add Philosophy Pillar
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStep} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Stage Number
                  </label>
                  <input
                    type="text"
                    value={newStepData.stage}
                    onChange={(e) => setNewStepData({ ...newStepData, stage: e.target.value })}
                    className="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Core Keyword
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HERITAGE"
                    value={newStepData.keyword}
                    onChange={(e) => setNewStepData({ ...newStepData, keyword: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a] font-bold uppercase tracking-wider"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. 05 / Monumental Grandeur"
                  value={newStepData.category}
                  onChange={(e) => setNewStepData({ ...newStepData, category: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Philosophical Quote
                </label>
                <textarea
                  rows={2}
                  value={newStepData.quote}
                  onChange={(e) => setNewStepData({ ...newStepData, quote: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a] resize-none"
                />
              </div>

              <ImageUploadField
                label="Pillar Background Visual (Auto-Converted to WebP)"
                currentImage={newStepData.image}
                onImageChange={(img) => setNewStepData({ ...newStepData, image: img })}
                onImageDelete={() => setNewStepData({ ...newStepData, image: '' })}
                aspectHint="1920×1080 px"
              />

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#0d1b2a] text-white rounded-xl shadow-md hover:bg-[#1b263b] transition flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5 text-[#D8BB7B]" />
                  <span>Create Pillar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
