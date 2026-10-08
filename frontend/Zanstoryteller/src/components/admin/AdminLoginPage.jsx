import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  KeyRound
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminLoginPage({ onNavigateHome, onLoginSuccess }) {
  const {
    login,
    verifyOtp,
    requestOtp,
    forgotPassword,
    resetPassword,
    lastRequestedEmail
  } = useAdminAuth()

  // Views: 'login' | 'otp' | 'forgot' | 'reset'
  const [view, setView] = useState('login')
  const [email, setEmail] = useState(lastRequestedEmail || 'mohommadhuafnan756@gmail.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // OTP State
  const [otpDigits, setOtpDigits] = useState(['', '', '', ''])
  const [resendCooldown, setResendCooldown] = useState(0)

  // Reset Password State
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState('')
  const [successNotice, setSuccessNotice] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const otpInputsRef = useRef([])

  // Resend cooldown timer countdown
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Auto focus first OTP input when switching to OTP view
  useEffect(() => {
    if (view === 'otp' || view === 'reset') {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus()
      }, 150)
    }
  }, [view])

  // -------------------------------------------------------------
  // Action 1: Handle Email + Password Login
  // -------------------------------------------------------------
  const handleLogin = async (e) => {
    e?.preventDefault()
    setErrorMessage('')
    setSuccessNotice('')

    if (!email.trim()) {
      setErrorMessage('Please enter your administrator email.')
      return
    }

    if (!password) {
      setErrorMessage('Please enter your administrator password.')
      return
    }

    setIsLoading(true)
    const result = await login(email, password)
    setIsLoading(false)

    if (!result.success) {
      setErrorMessage(result.error)
      return
    }

    // If OTP verification is required (e.g., after logout)
    if (result.requiresOtp) {
      setSuccessNotice('Security verification code sent to your email. Please verify below.')
      setView('otp')
      setResendCooldown(60)
      return
    }

    // Direct Login Successful!
    if (onLoginSuccess) {
      onLoginSuccess()
    }
  }

  // -------------------------------------------------------------
  // Action 2: Handle OTP Input & Verification
  // -------------------------------------------------------------
  const handleDigitChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, '')

    // Handle full paste
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

    if (cleanValue && index < 3) {
      otpInputsRef.current[index + 1]?.focus()
    }
  }

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (view === 'otp') {
        handleVerifyOtp()
      }
    }
  }

  const handleVerifyOtp = async (e) => {
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
  const handleResendOtp = async () => {
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
    setSuccessNotice('A new verification code has been dispatched to your email.')
    setResendCooldown(60)
    otpInputsRef.current[0]?.focus()
  }

  // -------------------------------------------------------------
  // Action 3: Handle Forgot Password Request
  // -------------------------------------------------------------
  const handleForgotPasswordSubmit = async (e) => {
    e?.preventDefault()
    setErrorMessage('')
    setSuccessNotice('')

    if (!email.trim()) {
      setErrorMessage('Please enter the administrator email.')
      return
    }

    setIsLoading(true)
    const result = await forgotPassword(email)
    setIsLoading(false)

    if (!result.success) {
      setErrorMessage(result.error)
      return
    }

    setSuccessNotice('Password reset code dispatched. Check your email to set a new password.')
    setView('reset')
    setOtpDigits(['', '', '', ''])
    setResendCooldown(60)
  }

  // -------------------------------------------------------------
  // Action 4: Handle Reset Password Confirmation
  // -------------------------------------------------------------
  const handleResetPasswordSubmit = async (e) => {
    e?.preventDefault()
    setErrorMessage('')
    setSuccessNotice('')

    const fullOtp = otpDigits.join('')
    if (fullOtp.length < 4) {
      setErrorMessage('Please enter the 4-digit code sent to your email.')
      return
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.')
      return
    }

    setIsLoading(true)
    const result = await resetPassword(email, fullOtp, newPassword)
    setIsLoading(false)

    if (!result.success) {
      setErrorMessage(result.error)
      return
    }

    setSuccessNotice('Password successfully updated! Logging into sovereign dashboard...')
    setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess()
      }
    }, 600)
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
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md bg-[#111f30]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1b263b] to-[#0d1b2a] border border-[#D8BB7B]/30 shadow-inner mb-4">
            <Shield className="w-7 h-7 text-[#D8BB7B]" />
          </div>

          <h1 className="text-2xl font-light tracking-[0.2em] text-white uppercase font-sans">
            {view === 'login' && 'ADMIN LOGIN'}
            {view === 'otp' && 'VERIFY EMAIL'}
            {view === 'forgot' && 'RESET PASSWORD'}
            {view === 'reset' && 'NEW PASSWORD'}
          </h1>

          <p className="text-xs font-mono tracking-[0.2em] text-[#D8BB7B] uppercase mt-1">
            {view === 'login' && 'Authorized Sovereign Access'}
            {view === 'otp' && 'Enter Verification Code'}
            {view === 'forgot' && 'Security Password Recovery'}
            {view === 'reset' && 'Enter Code & New Password'}
          </p>

          <div className="w-12 h-[1px] bg-white/20 mx-auto mt-4" />
        </div>

        {/* Dynamic Alerts */}
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div
              key="err"
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
              key="success"
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

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: EMAIL & PASSWORD LOGIN */}
        {/* ------------------------------------------------------------- */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
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
                  required
                  className="w-full bg-[#0d1b2a]/90 border border-white/15 focus:border-[#D8BB7B] focus:ring-1 focus:ring-[#D8BB7B] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition duration-200 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-mono tracking-wider text-slate-300 uppercase">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setView('forgot')
                    setErrorMessage('')
                    setSuccessNotice('')
                  }}
                  className="text-[11px] font-mono text-[#D8BB7B] hover:text-[#f0d8a5] transition cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                  className="w-full bg-[#0d1b2a]/90 border border-white/15 focus:border-[#D8BB7B] focus:ring-1 focus:ring-[#D8BB7B] rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 outline-none transition duration-200 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password}
              className="w-full mt-4 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D8BB7B] to-[#C4A45B] hover:from-[#e2c78a] hover:to-[#cca963] text-[#0d1b2a] font-semibold text-xs font-mono tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#D8BB7B]/20 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#0d1b2a] border-t-transparent rounded-full animate-spin" />
                  Authenticating Sovereign Session...
                </span>
              ) : (
                <>
                  <span>Sign In to Studio</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: OTP VERIFICATION (Mandatory after logout or 2FA) */}
        {/* ------------------------------------------------------------- */}
        {view === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <p className="text-center text-xs text-slate-300 leading-relaxed">
              A 4-digit verification code has been dispatched to{' '}
              <strong className="text-[#D8BB7B]">{email}</strong>.
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
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D8BB7B] to-[#C4A45B] hover:from-[#e2c78a] hover:to-[#cca963] text-[#0d1b2a] font-semibold text-xs font-mono tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#D8BB7B]/20 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#0d1b2a] border-t-transparent rounded-full animate-spin" />
                  Verifying Security Code...
                </span>
              ) : (
                <>
                  <span>Verify Code & Enter</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* Resend and Back Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <button
                type="button"
                onClick={() => {
                  setView('login')
                  setErrorMessage('')
                  setSuccessNotice('')
                }}
                className="text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Password</span>
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
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

        {/* ------------------------------------------------------------- */}
        {/* VIEW 3: FORGOT PASSWORD REQUEST */}
        {/* ------------------------------------------------------------- */}
        {view === 'forgot' && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
            <p className="text-center text-xs text-slate-300 leading-relaxed">
              Enter your master administrator email to receive a password recovery passcode.
            </p>

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
                  required
                  className="w-full bg-[#0d1b2a]/90 border border-white/15 focus:border-[#D8BB7B] focus:ring-1 focus:ring-[#D8BB7B] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D8BB7B] to-[#C4A45B] hover:from-[#e2c78a] hover:to-[#cca963] text-[#0d1b2a] font-semibold text-xs font-mono tracking-widest uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D8BB7B]/20 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#0d1b2a] border-t-transparent rounded-full animate-spin" />
                  Sending Code...
                </span>
              ) : (
                <>
                  <span>Send Recovery Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setView('login')
                  setErrorMessage('')
                  setSuccessNotice('')
                }}
                className="text-xs text-slate-400 hover:text-white transition inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </button>
            </div>
          </form>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 4: RESET PASSWORD WITH CODE & NEW PASSWORD */}
        {/* ------------------------------------------------------------- */}
        {view === 'reset' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            <p className="text-center text-xs text-slate-300 leading-relaxed">
              Enter the 4-digit code sent to <strong className="text-[#D8BB7B]">{email}</strong> and choose your new password.
            </p>

            {/* 4 Digit OTP Boxes */}
            <div className="flex justify-center items-center gap-3 my-2">
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
                  className="w-12 h-14 text-center text-2xl font-bold font-mono bg-[#0d1b2a] border border-white/20 focus:border-[#D8BB7B] focus:ring-2 focus:ring-[#D8BB7B]/30 rounded-xl text-[#D8BB7B] outline-none"
                />
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider text-slate-300 uppercase mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="At least 6 characters"
                  required
                  className="w-full bg-[#0d1b2a]/90 border border-white/15 focus:border-[#D8BB7B] rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider text-slate-300 uppercase mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Re-enter new password"
                  required
                  className="w-full bg-[#0d1b2a]/90 border border-white/15 focus:border-[#D8BB7B] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpDigits.join('').length < 4 || !newPassword || !confirmPassword}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D8BB7B] to-[#C4A45B] hover:from-[#e2c78a] hover:to-[#cca963] text-[#0d1b2a] font-semibold text-xs font-mono tracking-widest uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D8BB7B]/20 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#0d1b2a] border-t-transparent rounded-full animate-spin" />
                  Updating Password...
                </span>
              ) : (
                <>
                  <span>Update Password & Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setView('login')
                  setErrorMessage('')
                  setSuccessNotice('')
                }}
                className="text-xs text-slate-400 hover:text-white transition inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancel & Return</span>
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
