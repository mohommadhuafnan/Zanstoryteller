import React from 'react'
import { Clock, AlertCircle } from 'lucide-react'

const AVAILABLE_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM'
]

export default function TimeSlots({ selectedTime, onSelectTime, selectedDate, error }) {
  // Check if selected date is a Friday
  const isFriday = selectedDate ? new Date(selectedDate).getDay() === 5 : false

  return (
    <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm p-5 sm:p-7">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-white/60" />
          <h3 className="text-sm sm:text-base font-light text-white uppercase tracking-wider font-mono">
            Select A Time
          </h3>
        </div>
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
          9:00 AM – 6:00 PM
        </span>
      </div>

      {!selectedDate ? (
        <div className="py-8 text-center text-xs sm:text-sm text-white/40 font-mono">
          Please select a session date on the calendar above to view available time slots.
        </div>
      ) : isFriday ? (
        <div className="py-8 text-center text-xs text-red-300 font-mono flex flex-col items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span>The studio is closed on Fridays. No time slots available.</span>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2.5">
          {AVAILABLE_SLOTS.map((slot) => {
            const isSelected = selectedTime === slot

            return (
              <button
                key={slot}
                type="button"
                onClick={() => onSelectTime(slot)}
                className={`py-3 px-2 rounded-sm font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.25)] ring-1 ring-white'
                    : 'bg-[#121212] text-white/70 border border-white/10 hover:border-white/30 hover:bg-white/[0.05] hover:text-white'
                }`}
                aria-pressed={isSelected}
              >
                {slot}
              </button>
            )
          })}
        </div>
      )}

      {error && (
        <div className="mt-4 p-2.5 rounded-sm bg-red-950/30 border border-red-500/30 text-xs text-red-300 font-mono flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
