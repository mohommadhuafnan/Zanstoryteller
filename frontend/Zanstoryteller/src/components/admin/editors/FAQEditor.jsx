import React, { useState } from 'react'
import { Sparkles, Plus, Trash2, HelpCircle } from 'lucide-react'
import { useCMS } from '../../../context/CMSContext'

export default function FAQEditor() {
  const { data, updateFAQ, addFAQ, deleteFAQ } = useCMS()
  const faqs = data.faqItems || []
  const [isAdding, setIsAdding] = useState(false)
  const [newFAQ, setNewFAQ] = useState({
    category: 'BOOKING & TIMELINE',
    question: '',
    answer: ''
  })

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!newFAQ.question || !newFAQ.answer) return
    addFAQ(newFAQ)
    setIsAdding(false)
    setNewFAQ({
      category: 'BOOKING & TIMELINE',
      question: '',
      answer: ''
    })
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#0d1b2a] uppercase font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D8BB7B]" />
            <span>09.5 / Client Support</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Questions & Answers (FAQ)</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage the FAQ accordion items displayed to clients before booking ({faqs.length} items).
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0d1b2a] hover:bg-[#1b263b] text-white text-xs font-medium uppercase tracking-wider rounded-xl shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D8BB7B]" />
          <span>Add Question</span>
        </button>
      </div>

      {/* List of FAQ Cards */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={faq.id || idx}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#0d1b2a] bg-slate-100 px-2 py-0.5 rounded">
                  {faq.num || String(idx + 1).padStart(2, '0')}
                </span>
                <span className="text-xs font-mono tracking-wider text-slate-500 uppercase">
                  {faq.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete question "${faq.question}"?`)) {
                    deleteFAQ(idx)
                  }
                }}
                className="text-slate-400 hover:text-red-600 transition p-1"
                title="Delete question"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={faq.category || ''}
                  onChange={(e) => updateFAQ(idx, { category: e.target.value })}
                  placeholder="e.g. BOOKING & TIMELINE"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={faq.question || ''}
                  onChange={(e) => updateFAQ(idx, { question: e.target.value })}
                  placeholder="e.g. How far in advance should we reserve our date?"
                  className="w-full text-sm font-semibold p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Answer
                </label>
                <textarea
                  rows={3}
                  value={faq.answer || ''}
                  onChange={(e) => updateFAQ(idx, { answer: e.target.value })}
                  placeholder="Comprehensive response..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a] resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 mb-1">
              Add FAQ Item
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Add a common question and answer.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newFAQ.category}
                  onChange={(e) => setNewFAQ({ ...newFAQ, category: e.target.value })}
                  placeholder="e.g. CUSTOMIZATION"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={newFAQ.question}
                  onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                  placeholder="e.g. Do you offer raw/unprocessed photos?"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newFAQ.answer}
                  onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                  placeholder="Provide an informative explanation..."
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
                  Publish FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
