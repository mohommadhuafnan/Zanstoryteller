import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, ShieldCheck, AlertCircle } from 'lucide-react'
import BookingCalendar from './BookingCalendar'
import TimeSlots from './TimeSlots'
import SessionType from './SessionType'
import ClientDetailsForm from './ClientDetailsForm'
import BookingSummary from './BookingSummary'
import BookingSuccess from './BookingSuccess'

export default function BookingPage({ onNavigateHome }) {
  // Set SEO metadata for the booking page
  useEffect(() => {
    const originalTitle = document.title
    document.title = 'Book a Photography Session | Zanstoryteller'

    let metaDesc = document.querySelector('meta[name="description"]')
    const originalDesc = metaDesc ? metaDesc.getAttribute('content') : ''
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Choose a date and time and send your photography session request to Zanstoryteller.')
    }

    // Scroll to top on page mount
    window.scrollTo({ top: 0, behavior: 'instant' })

    return () => {
      document.title = originalTitle
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute('content', originalDesc)
      }
    }
  }, [])

  // Booking Flow State
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedType, setSelectedType] = useState('Portrait Photography')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    message: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)

  // Handle client input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Handle date selection with automatic Friday check
  const handleDateSelect = (dateString) => {
    const parts = dateString.split('-').map(Number)
    const d = new Date(parts[0], parts[1] - 1, parts[2])
    if (d.getDay() === 5) {
      // Friday
      setErrors((prev) => ({
        ...prev,
        date: "We're closed on Fridays. Please choose another date."
      }))
      setSelectedDate('')
      setSelectedTime('')
      return
    }

    setSelectedDate(dateString)
    setErrors((prev) => ({ ...prev, date: '' }))
  }

  // Handle time selection
  const handleTimeSelect = (timeSlot) => {
    setSelectedTime(timeSlot)
    setErrors((prev) => ({ ...prev, time: '' }))
  }

  // Handle session type selection
  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId)
    setErrors((prev) => ({ ...prev, sessionType: '' }))
  }

  // Comprehensive Form Validation
  const validateForm = () => {
    const newErrors = {}

    // 1. Date Validation
    if (!selectedDate) {
      newErrors.date = 'Please select a session date.'
    } else {
      const parts = selectedDate.split('-').map(Number)
      const dateObj = new Date(parts[0], parts[1] - 1, parts[2])
      // MANDATORY FRIDAY CHECK: 5 is Friday
      if (dateObj.getDay() === 5) {
        newErrors.date = "We're closed on Fridays. Please choose another date."
      }
    }

    // 2. Time Validation
    if (!selectedTime) {
      newErrors.time = 'Please select a time.'
    }

    // 3. Session Type
    if (!selectedType) {
      newErrors.sessionType = 'Please select a photography type.'
    }

    // 4. Full Name
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name.'
    }

    // 5. Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.'
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.'
    }

    // 6. Phone number format
    const phoneClean = formData.phone.replace(/[\s\-\(\)\+]/g, '')
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number.'
    } else if (phoneClean.length < 7 || !/^\d+$/.test(phoneClean)) {
      newErrors.phone = 'Please enter a valid phone number.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Overall form validity check for submit button
  const isValid = Boolean(
    selectedDate &&
    selectedTime &&
    selectedType &&
    formData.name.trim() &&
    formData.email.trim() &&
    formData.phone.trim()
  )

  // Submit Booking Request
  const handleSubmit = (e) => {
    if (e) e.preventDefault()

    if (!validateForm()) {
      // Scroll to the first error
      window.scrollTo({ top: 200, behavior: 'smooth' })
      return
    }

    setIsSubmitting(true)

    // Data payload structured for future Node.js/Express backend integration
    const bookingPayload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      location: formData.location.trim() || 'Studio / To be agreed',
      sessionType: selectedType,
      date: selectedDate,
      time: selectedTime,
      message: formData.message.trim(),
      submittedAt: new Date().toISOString()
    }

    // Simulate reliable frontend submission (can be swapped for API call)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmittedData(bookingPayload)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 700)
  }

  // Reset booking form to book another session
  const handleBookAnother = () => {
    setSubmittedData(null)
    setSelectedDate('')
    setSelectedTime('')
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      message: ''
    })
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-white/20 pt-24 pb-28 px-6 sm:px-10 md:px-14">
      {/* Top Floating Back Link */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors cursor-pointer py-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      {submittedData ? (
        // -------------------------------------------------------------
        // SUCCESS STATE SCREEN
        // -------------------------------------------------------------
        <BookingSuccess
          bookingData={submittedData}
          onBookAnother={handleBookAnother}
          onGoHome={onNavigateHome}
        />
      ) : (
        // -------------------------------------------------------------
        // MAIN BOOKING FORM INTERACTION
        // -------------------------------------------------------------
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1 rounded-full border border-white/10 bg-white/[0.03]">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/70">
                Zanstoryteller
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white uppercase leading-[1.08] mb-4">
              Book Your Session
            </h1>

            <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed">
              Choose a date and time that works for you, then tell us a little about your photography needs.
            </p>
          </div>

          {/* Opening Hours Banner (Always clearly visible before date selection) */}
          <div className="max-w-4xl mx-auto mb-10 p-5 sm:p-6 rounded-sm bg-[#0c0c0c] border border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/15 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-white/80" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-[0.25em] text-white/40 uppercase block">
                  Studio Availability
                </span>
                <span className="text-xs sm:text-sm font-mono text-white tracking-wider uppercase font-medium">
                  Opening Hours
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-xs font-mono">
              <div>
                <span className="text-white/40 block text-[10px] uppercase tracking-wider">Saturday – Thursday</span>
                <span className="text-white font-medium">9:00 AM – 6:00 PM</span>
              </div>

              <div className="sm:border-l sm:border-white/10 sm:pl-8">
                <span className="text-red-400/70 block text-[10px] uppercase tracking-wider">Friday</span>
                <span className="text-red-400 font-semibold tracking-wider">CLOSED</span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-white/50 border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-6">
              <span className="text-red-300 font-medium block">Please note:</span>
              <span>We are closed on Fridays.</span>
            </div>
          </div>

          {/* Two-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Calendar & Time Slots */}
            <div className="lg:col-span-7 space-y-6">
              {/* Interactive Calendar */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono tracking-[0.25em] text-white/50 uppercase">
                    Step 01 / Select Date
                  </span>
                </div>
                <BookingCalendar
                  selectedDate={selectedDate}
                  onSelectDate={handleDateSelect}
                  error={errors.date}
                />
              </div>

              {/* Time Slots Selection */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono tracking-[0.25em] text-white/50 uppercase">
                    Step 02 / Select Time Slot
                  </span>
                </div>
                <TimeSlots
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSelectTime={handleTimeSelect}
                  error={errors.time}
                />
              </div>
            </div>

            {/* Right Column: Session Type, Client Details & Summary */}
            <div className="lg:col-span-5 space-y-6">
              {/* Session Type */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono tracking-[0.25em] text-white/50 uppercase">
                    Step 03 / Session Focus
                  </span>
                </div>
                <SessionType
                  selectedType={selectedType}
                  onSelectType={handleTypeSelect}
                  error={errors.sessionType}
                />
              </div>

              {/* Client Information Form */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono tracking-[0.25em] text-white/50 uppercase">
                    Step 04 / Your Information
                  </span>
                </div>
                <ClientDetailsForm
                  formData={formData}
                  onChange={handleInputChange}
                  errors={errors}
                />
              </div>

              {/* Booking Summary & Confirm Button */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono tracking-[0.25em] text-white/50 uppercase">
                    Step 05 / Review & Submit
                  </span>
                </div>
                <BookingSummary
                  formData={formData}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  selectedType={selectedType}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  isValid={isValid}
                />
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </div>
  )
}
