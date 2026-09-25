import React from 'react'
import { Camera, Check, AlertCircle } from 'lucide-react'

const SESSION_TYPES = [
  {
    id: 'Wedding Photography',
    label: 'Wedding Photography',
    desc: 'Cinematic, documentary-style storytelling for sacred celebrations and rituals.'
  },
  {
    id: 'Portrait Photography',
    label: 'Portrait Photography',
    desc: 'Editorial, artistic, and natural portraits capturing raw presence and character.'
  },
  {
    id: 'Event Photography',
    label: 'Event Photography',
    desc: 'Unobtrusive, atmospheric coverage of private dinners, galas, and gatherings.'
  },
  {
    id: 'Commercial Photography',
    label: 'Commercial Photography',
    desc: 'Refined brand visuals, architectural spaces, lookbooks, and campaigns.'
  },
  {
    id: 'Other',
    label: 'Other',
    desc: 'Custom commissions, visual documentaries, or unique creative assignments.'
  }
]

export default function SessionType({ selectedType, onSelectType, error }) {
  return (
    <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm p-5 sm:p-7">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Camera className="w-4 h-4 text-white/60" />
          <h3 className="text-sm sm:text-base font-light text-white uppercase tracking-wider font-mono">
            What Are You Looking For?
          </h3>
        </div>
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
          Select One
        </span>
      </div>

      <div className="space-y-2.5">
        {SESSION_TYPES.map((type) => {
          const isSelected = selectedType === type.id

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onSelectType(type.id)}
              className={`w-full p-4 rounded-sm text-left transition-all duration-200 border flex items-center justify-between group cursor-pointer ${
                isSelected
                  ? 'bg-white/[0.08] border-white text-white shadow-[0_0_25px_rgba(255,255,255,0.06)]'
                  : 'bg-[#121212]/80 border-white/10 text-white/70 hover:border-white/30 hover:bg-white/[0.03] hover:text-white'
              }`}
              aria-pressed={isSelected}
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-white/30 group-hover:bg-white/60'}`} />
                  <span className="text-xs sm:text-sm font-mono uppercase tracking-wider font-medium text-white">
                    {type.label}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-white/50 font-light mt-1.5 pl-4 max-w-md">
                  {type.desc}
                </p>
              </div>

              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'border-white bg-white text-black'
                    : 'border-white/20 group-hover:border-white/50'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          )
        })}
      </div>

      {error && (
        <div className="mt-4 p-2.5 rounded-sm bg-red-950/30 border border-red-500/30 text-xs text-red-300 font-mono flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
