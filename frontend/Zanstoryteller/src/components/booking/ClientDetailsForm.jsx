import React from 'react'
import { User, Mail, Phone, MapPin, MessageSquare, AlertCircle } from 'lucide-react'

export default function ClientDetailsForm({ formData, onChange, errors }) {
  return (
    <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm p-5 sm:p-7">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <User className="w-4 h-4 text-white/60" />
          <h3 className="text-sm sm:text-base font-light text-white uppercase tracking-wider font-mono">
            Client Details
          </h3>
        </div>
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
          * Required Fields
        </span>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
            Full Name *
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="e.g. Elena Rostova"
              className={`w-full bg-[#121212] border px-4 py-3 rounded-sm text-sm font-sans text-white placeholder-white/25 focus:outline-none transition-colors ${
                errors.name ? 'border-red-500/80 focus:border-red-500' : 'border-white/15 focus:border-white'
              }`}
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-400 font-mono flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
            Email Address *
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="e.g. elena@example.com"
              className={`w-full bg-[#121212] border px-4 py-3 rounded-sm text-sm font-sans text-white placeholder-white/25 focus:outline-none transition-colors ${
                errors.email ? 'border-red-500/80 focus:border-red-500' : 'border-white/15 focus:border-white'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-400 font-mono flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
            Phone Number *
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              placeholder="e.g. +94 77 123 4567"
              className={`w-full bg-[#121212] border px-4 py-3 rounded-sm text-sm font-sans text-white placeholder-white/25 focus:outline-none transition-colors ${
                errors.phone ? 'border-red-500/80 focus:border-red-500' : 'border-white/15 focus:border-white'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="mt-1.5 text-xs text-red-400 font-mono flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>

        {/* Preferred Location */}
        <div>
          <label htmlFor="location" className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
            Preferred Location
          </label>
          <div className="relative">
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={onChange}
              placeholder="Venue, city, studio, or address"
              className="w-full bg-[#121212] border border-white/15 focus:border-white px-4 py-3 rounded-sm text-sm font-sans text-white placeholder-white/25 focus:outline-none transition-colors"
            />
          </div>
          <span className="block mt-1 text-[11px] text-white/40 font-mono">
            Sessions can take place at our studio, on location, or destination worldwide.
          </span>
        </div>

        {/* Message / Details */}
        <div>
          <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
            Tell us about your photography session
          </label>
          <div className="relative">
            <textarea
              id="message"
              name="message"
              rows={3}
              value={formData.message}
              onChange={onChange}
              placeholder="Share your vision, expected guest count, vibe, or any special moments you want preserved..."
              className="w-full bg-[#121212] border border-white/15 focus:border-white px-4 py-3 rounded-sm text-sm font-sans text-white placeholder-white/25 focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
