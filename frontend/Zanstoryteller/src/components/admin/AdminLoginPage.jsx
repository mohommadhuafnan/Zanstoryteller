import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Mail, KeyRound, ArrowRight, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminLoginPage({ onNavigateHome, onLoginSuccess }) {
  const { requestOtp, verifyOtp, lastRequestedEmail } = useAdminAuth()

  // Steps: 'email' | 'otp'
  const [step, setStep] = useState(lastRequestedEmail ? 'otp' : 'email')
  const [email, setEmail] = useState(lastRequestedEmail || '')
  const [otpDigits, setOtpDigits] = useState(['', '', '', ''])
  const [errorMessage, setErrorMessage] = useState('')
  const [successNotice, setSuccessNotice] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const otpInputsRef = useRef([])

  // Resend cooldown timer countdown
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Auto focus first OTP input when switching to OTP step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus()
      }, 150)
    }
  }, [step])

  // Handle Step 1: Send Verification Code
  const handleSendCode = async (e) => {
    e?.preventDefault()
    setErrorMessage('')
    setSuccessNotice('')

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.')
      return
    }

    setIsLoading(true)
    const result = await requestOtp(email.trim())
    setIsLoading(false)

    if (!result.success) {
      setErrorMessage(result.error)
      return
    }

    setSuccessNotice('Verification code sent. Please check your inbox.')
    setStep('otp')
    setResendCooldown(60) // 60s cooldown for resending
  }

  // Handle OTP digit inputs
  const handleDigitChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, '')

    // Handle multi-character paste (e.g. user pasted full 4 digits)
    if (cleanValue.length > 1) {
      const pasted = cleanValue.slice(0, 4).split('')
      const next = ['', '', '', '']
      pasted.forEach((char, i) => {
        next[i] = char
      })
      setOtpDigits(next)
      const targetFocus = Math.min(pasted.length, 3)
      otpInputsRef.current[targetFocus]?.focus()
      return
    }

    const next = [...otpDigits]
    next[index] = cleanValue
    setOtpDigits(next)

    // Auto-advance to next box
    if (cleanValue && index < 3) {
      otpInputsRef.current[index + 1]?.focus()
    }
  }

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleVerifyCode()
    }
  }

  // Handle Step 2: Verify Code
  const handleVerifyCode = async (e) => {
    e?.preventDefault()
    setErrorMessage('')
    setSuccessNotice('')

    const fullOtp = otpDigits.join('')
    if (fullOtp.length < 4) {
      setErrorMessage('Please enter the complete 4-digit verification code.')
      return
    }

    setIsLoading(true)
    const result = await verifyOtp(email, fullOtp)
    setIsLoading(false)

    if (!result.success) {
      setErrorMessage(result.error)
      return
    }

    if (onLoginSuccess) {
      onLoginSuccess()
    }
  }

  // Resend OTP code
  const handleResend = async () => {
    if (resendCooldown > 0 || isLoading) return
    setErrorMessage('')
    setSuccessNotice('')
    setIsLoading(true)

    const result = await requestOtp(email)
    setIsLoading(false)

    if (!result.success) {
      setErrorMessage(result.error)
      return
    }

    setOtpDigits(['', '', '', ''])
    setSuccessNotice('A new verification code has been dispatched.')
    setResendCooldown(60)
    otpInputsRef.current[0]?.focus()
  }

  return (
    <div className="relative min-h-screen w-full bg-[#0d1b2a] text-white flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
      {/* Background Architectural Blueprint Grid */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Atmospheric ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1b263b] rounded-full blur-[120px] pointer-events-none opacity-60" />
      <div className="absolute -bottom-20 right-10 w-80 h-80 bg-[#415a77]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md bg-[#111f30]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1b263b] to-[#0d1b2a] border border-[#D8BB7B]/30 shadow-inner mb-4">
            <Shield className="w-7 h-7 text-[#D8BB7B]" />
          </div>

          <h1 className="text-2xl font-light tracking-[0.2em] text-white uppercase font-sans">
            {step === 'email' ? 'ADMIN LOGIN' : 'VERIFY YOUR EMAIL'}
          </h1>
          <p className="text-xs font-mono tracking-[0.2em] text-[#D8BB7B] uppercase mt-1">
            {step === 'email'
              ? 'Authorized Sovereign Access'
              : 'Enter Verification Code'}
          </p>
          <div className="w-12 h-[1px] bg-white/20 mx-auto mt-4" />
        </div>

        {/* Dynamic Alerts */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 p-3.5 rounded-xl bg-red-900/30 border border-red-500/30 flex items-center gap-3 text-red-200 text-xs"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successNotice && !errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 p-3.5 rounded-xl bg-emerald-900/30 border border-emerald-500/30 flex items-center gap-3 text-emerald-200 text-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP 1: Email Input */}
        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-5">
            <div>
              <label className="block text-[11px] font-mono tracking-wider text-slate-300 uppercase mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter administrator email"
                  autoComplete="email"
                  autoFocus
                  required
                  className="w-full bg-[#0d1b2a]/90 border border-white/15 focus:border-[#D8BB7B] focus:ring-1 focus:ring-[#D8BB7B] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition duration-200 disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D8BB7B] to-[#C4A45B] hover:from-[#e2c78a] hover:to-[#cca963] text-[#0d1b2a] font-medium text-xs font-mono tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#D8BB7B]/20 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#0d1b2a] border-t-transparent rounded-full animate-spin" />
                  Generating Security Code...
                </span>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <p className="text-center text-xs text-slate-300 leading-relaxed">
              A verification code has been sent to your administrator email.
            </p>

            {/* 4 Digit OTP Boxes */}
            <div className="flex justify-center items-center gap-3 sm:gap-4 my-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpInputsRef.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                  disabled={isLoading}
                  className="w-13 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold font-mono bg-[#0d1b2a] border border-white/20 focus:border-[#D8BB7B] focus:ring-2 focus:ring-[#D8BB7B]/30 rounded-xl text-[#D8BB7B] outline-none transition-all duration-150 shadow-inner"
                />
              ))}
            </div>

            {/* Verify Code Button */}
            <button
              type="submit"
              disabled={isLoading || otpDigits.join('').length < 4}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D8BB7B] to-[#C4A45B] hover:from-[#e2c78a] hover:to-[#cca963] text-[#0d1b2a] font-medium text-xs font-mono tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#D8BB7B]/20 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#0d1b2a] border-t-transparent rounded-full animate-spin" />
                  Verifying Security Code...
                </span>
              ) : (
                <>
                  <span>Verify Code</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* Resend and Back Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <button
                type="button"
                onClick={() => {
                  setStep('email')
                  setErrorMessage('')
                  setSuccessNotice('')
                }}
                className="text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Email</span>
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || isLoading}
                className="text-[#D8BB7B] hover:text-[#f0d8a5] transition flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-mono"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>
                  {resendCooldown > 0
                    ? `Resend Code (${resendCooldown}s)`
                    : 'Resend Code'}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* Return to website */}
        <div className="mt-8 text-center pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}
