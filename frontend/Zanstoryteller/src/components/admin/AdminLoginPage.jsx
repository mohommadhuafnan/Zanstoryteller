import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminLoginPage({ onNavigateHome }) {
  const { login, lockoutUntil } = useAdminAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      const res = login(username, password, rememberMe)
      setIsLoading(false)
      if (!res.success) {
        setErrorMessage(res.error)
      }
    }, 450)
  }

  const handleQuickFill = () => {
    setUsername('admin')
    setPassword('zanadmin2026')
    setErrorMessage('')
  }

  const isLocked = lockoutUntil && Date.now() < lockoutUntil
  const lockSeconds = isLocked ? Math.ceil((lockoutUntil - Date.now()) / 1000) : 0

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
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md bg-[#111f30]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1b263b] to-[#0d1b2a] border border-[#D8BB7B]/30 shadow-inner mb-4">
            <Shield className="w-7 h-7 text-[#D8BB7B]" />
          </div>

          <h1 className="text-2xl font-light tracking-[0.2em] text-white uppercase font-sans">
            Zan Storyteller
          </h1>
          <p className="text-xs font-mono tracking-[0.25em] text-[#D8BB7B] uppercase mt-1">
            Master Control Admin Portal
          </p>
          <div className="w-12 h-[1px] bg-white/20 mx-auto mt-4" />
        </div>

        {/* Lockout Warning */}
        {isLocked && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-red-200 text-xs">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Security Cooldown Active</p>
              <p className="mt-0.5 text-red-200/80">Too many failed attempts. Locked for {lockSeconds} seconds.</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        <AnimatePresence>
          {errorMessage && !isLocked && (
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
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-[11px] font-mono tracking-wider text-slate-300 uppercase mb-2">
              Admin Username or Email
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLocked || isLoading}
                placeholder="admin"
                autoComplete="username"
                className="w-full bg-[#0d1b2a]/90 border border-white/15 focus:border-[#D8BB7B] focus:ring-1 focus:ring-[#D8BB7B] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition duration-200 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-mono tracking-wider text-slate-300 uppercase">
                Secure Password
              </label>
              <span className="text-[10px] text-slate-400">Route: /admin220</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked || isLoading}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full bg-[#0d1b2a]/90 border border-white/15 focus:border-[#D8BB7B] focus:ring-1 focus:ring-[#D8BB7B] rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 outline-none transition duration-200 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-[#0d1b2a] text-[#D8BB7B] focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span>Remember session on this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLocked || isLoading}
            className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D8BB7B] to-[#C4A45B] hover:from-[#e2c78a] hover:to-[#cca963] text-[#0d1b2a] font-medium text-xs font-mono tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#D8BB7B]/20 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-[#0d1b2a] border-t-transparent rounded-full animate-spin" />
                Verifying Credentials...
              </span>
            ) : (
              <>
                <span>Access Admin Studio</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Quick Credentials Demo Helper */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <KeyRound className="w-3.5 h-3.5 text-[#D8BB7B]" />
            <span>Default Access: <b>admin</b> / <b>zanadmin2026</b></span>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-[11px] font-mono text-[#D8BB7B] hover:underline uppercase tracking-wider"
          >
            Auto-fill Default Credentials
          </button>
        </div>

        {/* Return to website */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}
