import React from 'react'
import { Sparkles } from 'lucide-react'
import { useCMS } from '../../../context/CMSContext'

export default function ProcessEditor() {
  const { data, updateProcessStep } = useCMS()
  const steps = data.processSteps || []

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#0d1b2a] uppercase font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#D8BB7B]" />
          <span>06 / Photography Process</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">From Moment To Memory</h2>
        <p className="text-xs text-slate-500 mt-1">
          Customize the 4-phase client experience journey (Connect, Plan, Capture, Remember).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step, idx) => (
          <div
            key={step.number || idx}
            className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-mono text-xs font-bold text-[#D8BB7B] px-2.5 py-1 bg-[#0d1b2a] rounded">
                STEP {step.number}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {step.tag}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={step.title || ''}
                  onChange={(e) => updateProcessStep(idx, { title: e.target.value })}
                  placeholder="e.g. CONNECT"
                  className="w-full text-sm font-bold uppercase p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Stage Tag
                </label>
                <input
                  type="text"
                  value={step.tag || ''}
                  onChange={(e) => updateProcessStep(idx, { tag: e.target.value })}
                  placeholder="e.g. First Encounter"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={step.description || ''}
                  onChange={(e) => updateProcessStep(idx, { description: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0d1b2a] resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
