import React from 'react'
import { Calendar, Clock, Camera, MapPin, User, Mail, Phone, CheckCircle2, ShieldCheck } from 'lucide-react'

// Format YYYY-MM-DD into "Saturday, 10 October 2026"
function formatDateDisplay(dateString) {
  if (!dateString) return 'Not selected'
  try {
    const parts = dateString.split('-').map(Number)
    const date = new Date(parts[0], parts[1] - 1, parts[2])
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  } catch {
    return dateString
  }
}

export default function BookingSummary({
  formData,
  selectedDate,
  selectedTime,
  selectedType,
  onSubmit,
  isSubmitting,
  isValid
}) {
  return (
    <div className="w-full bg-[#0d0d0d] border border-white/15 rounded-sm p-6 sm:p-8 sticky top-24">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
        <span className="w-2 h-2 rounded-full bg-white" />
        <h3 className="text-base sm:text-lg font-light text-white uppercase tracking-wider font-mono">
          Your Session Summary
        </h3>
      </div>

      <div className="space-y-4 mb-8 text-xs sm:text-sm font-mono">
        {/* Date */}
        <div className="flex items-start justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-white/50">
            <Calendar className="w-3.5 h-3.5" />
            <span>DATE</span>
          </div>
          <span className={`text-right font-medium ${selectedDate ? 'text-white' : 'text-white/30 italic'}`}>
            {formatDateDisplay(selectedDate)}
          </span>
        </div>

        {/* Time */}
        <div className="flex items-start justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-white/50">
            <Clock className="w-3.5 h-3.5" />
            <span>TIME</span>
          </div>
          <span className={`text-right font-medium ${selectedTime ? 'text-white' : 'text-white/30 italic'}`}>
            {selectedTime || 'Not selected'}
          </span>
        </div>

        {/* Session Type */}
        <div className="flex items-start justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-white/50">
            <Camera className="w-3.5 h-3.5" />
            <span>SESSION</span>
          </div>
          <span className={`text-right font-medium ${selectedType ? 'text-white' : 'text-white/30 italic'}`}>
            {selectedType || 'Not selected'}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-start justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-white/50">
            <MapPin className="w-3.5 h-3.5" />
            <span>LOCATION</span>
          </div>
          <span className="text-right text-white/80 max-w-[180px] truncate">
            {formData.location || 'Studio / To be agreed'}
          </span>
        </div>

        {/* Client Name */}
        <div className="flex items-start justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-white/50">
            <User className="w-3.5 h-3.5" />
            <span>NAME</span>
          </div>
          <span className={`text-right font-medium ${formData.name ? 'text-white' : 'text-white/30 italic'}`}>
            {formData.name || '—'}
          </span>
        </div>

        {/* Email */}
        <div className="flex items-start justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-white/50">
            <Mail className="w-3.5 h-3.5" />
            <span>EMAIL</span>
          </div>
          <span className={`text-right ${formData.email ? 'text-white/90' : 'text-white/30 italic'} max-w-[180px] truncate`}>
            {formData.email || '—'}
          </span>
        </div>

        {/* Phone */}
        <div className="flex items-start justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-white/50">
            <Phone className="w-3.5 h-3.5" />
            <span>PHONE</span>
          </div>
          <span className={`text-right ${formData.phone ? 'text-white/90' : 'text-white/30 italic'}`}>
            {formData.phone || '—'}
          </span>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!isValid || isSubmitting}
        className={`w-full py-4 px-6 rounded-sm font-mono text-xs uppercase tracking-[0.25em] font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
          isValid && !isSubmitting
            ? 'bg-white text-black hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] cursor-pointer'
            : 'bg-white/10 text-white/30 border border-white/10 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <>
            <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            <span>PROCESSING...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>CONFIRM BOOKING</span>
          </>
        )}
      </button>

      {/* Safety Notice */}
      <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-mono text-white/40 tracking-wider text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-white/40" />
        <span>No upfront payment required to request session</span>
      </div>
    </div>
  )
}
