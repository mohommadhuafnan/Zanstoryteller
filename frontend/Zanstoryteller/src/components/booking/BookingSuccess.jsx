import React from 'react'
import { motion } from 'framer-motion'
import { Check, Calendar, Clock, Camera, MapPin, Mail, Phone, ArrowLeft, RefreshCw } from 'lucide-react'

function formatDateDisplay(dateString) {
  if (!dateString) return ''
  try {
    const parts = dateString.split('-').map(Number)
    const date = new Date(parts[0], parts[1] - 1, parts[2])
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  } catch {
    return dateString
  }
}

export default function BookingSuccess({ bookingData, onBookAnother, onGoHome }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl mx-auto bg-[#0a0a0a] border border-white/15 rounded-sm p-8 sm:p-12 text-center"
    >
      {/* Top Success Badge */}
      <div className="w-16 h-16 rounded-full bg-white/[0.06] border border-white/20 flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-white stroke-[2.5]" />
      </div>

      <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02]">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-mono tracking-[0.25em] text-white/70 uppercase">
          Request Acknowledged
        </span>
      </div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-white uppercase tracking-tight font-sans mb-3">
        Booking Request Received
      </h2>

      <p className="text-base text-white/80 font-light mb-8 max-w-md mx-auto">
        Thank you, <span className="text-white font-medium">{bookingData.name}</span>. Your photography session request has been received.
      </p>

      {/* Structured Details Card */}
      <div className="bg-[#121212] border border-white/10 rounded-sm p-6 mb-8 text-left space-y-3 font-mono text-xs sm:text-sm">
        <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
          <span className="text-white/40 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            DATE
          </span>
          <span className="text-white font-medium">{formatDateDisplay(bookingData.date)}</span>
        </div>

        <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
          <span className="text-white/40 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            TIME
          </span>
          <span className="text-white font-medium">{bookingData.time}</span>
        </div>

        <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
          <span className="text-white/40 flex items-center gap-2">
            <Camera className="w-3.5 h-3.5" />
            SESSION
          </span>
          <span className="text-white font-medium">{bookingData.sessionType}</span>
        </div>

        {bookingData.location && (
          <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
            <span className="text-white/40 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              LOCATION
            </span>
            <span className="text-white font-medium">{bookingData.location}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 text-[11px] text-white/40">
          <span>Confirmation Contact</span>
          <span>{bookingData.email} • {bookingData.phone}</span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-white/60 font-light max-w-md mx-auto mb-10 leading-relaxed">
        We will contact you using the information you provided to confirm the session, discuss creative direction, and review any location requirements.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onGoHome}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] font-medium rounded-sm hover:bg-white/90 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <button
          type="button"
          onClick={onBookAnother}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/25 hover:border-white text-white font-mono text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-white/[0.05] transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Book Another Session</span>
        </button>
      </div>
    </motion.div>
  )
}
