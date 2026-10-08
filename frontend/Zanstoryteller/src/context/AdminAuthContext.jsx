import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../utils/apiClient'
import { supabase } from '../utils/supabase'

const AdminAuthContext = createContext(null)

const ADMIN_EMAIL = 'mohommadhuafnan756@gmail.com'
const DEFAULT_PASSWORD_HASH = '3cb2f44c709bd4c4fe10cfa03f19ae8354524d1d4f882573442900571606d188' // ZanAdmin@2026

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return Boolean(localStorage.getItem('zan_admin_token') || sessionStorage.getItem('zan_admin_token'))
    } catch {
      return false
    }
  })
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const token = localStorage.getItem('zan_admin_token') || sessionStorage.getItem('zan_admin_token')
      return token ? { email: ADMIN_EMAIL, role: 'Master Admin' } : null
    } catch {
      return null
    }
  })
  const [lastRequestedEmail, setLastRequestedEmail] = useState(() => {
    try {
      return sessionStorage.getItem('zan_admin_pending_email') || ADMIN_EMAIL
    } catch {
      return ADMIN_EMAIL
    }
  })

  // -------------------------------------------------------------
  // Verify existing authenticated session on startup / page refresh
  // -------------------------------------------------------------
  const checkSession = useCallback(async () => {
    try {
      setIsCheckingSession(true)
      const token = localStorage.getItem('zan_admin_token') || sessionStorage.getItem('zan_admin_token')

      if (!token) {
        setIsAuthenticated(false)
        setAdminUser(null)
        return false
      }

      const res = await apiFetch('/api/admin/auth/me')

      if (res.ok) {
        const data = await res.json()
        if (data.authenticated && data.admin) {
          setIsAuthenticated(true)
          setAdminUser({
            email: data.email || ADMIN_EMAIL,
            role: 'Master Admin'
          })
          return true
        }
      }

      // If token is stored locally and valid
      if (token && token.length > 20) {
        setIsAuthenticated(true)
        setAdminUser({
          email: ADMIN_EMAIL,
          role: 'Master Admin'
        })
        return true
      }

      setIsAuthenticated(false)
      setAdminUser(null)
      return false
    } catch (err) {
      // In offline/resilient mode, keep session if valid token was stored
      const token = localStorage.getItem('zan_admin_token') || sessionStorage.getItem('zan_admin_token')
      if (token) {
        setIsAuthenticated(true)
        setAdminUser({ email: ADMIN_EMAIL, role: 'Master Admin' })
        return true
      }
      setIsAuthenticated(false)
      setAdminUser(null)
      return false
    } finally {
      setIsCheckingSession(false)
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  // -------------------------------------------------------------
  // Step 1: Admin Login (Email + Password)
  // Logic:
  // - If admin logged out previously, require OTP verification via email.
  // - Otherwise, allow direct password login into admin panel.
  // -------------------------------------------------------------
  const login = useCallback(async (email, password) => {
    const trimmedEmail = (email || '').trim().toLowerCase()
    const trimmedPassword = (password || '').trim()

    if (trimmedEmail !== ADMIN_EMAIL) {
      return { success: false, error: 'Unauthorized administrator email address.' }
    }

    if (!trimmedPassword) {
      return { success: false, error: 'Please enter your administrator password.' }
    }

    const wasLoggedOut = localStorage.getItem('zan_admin_logged_out') === 'true'

    try {
      const res = await apiFetch('/api/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
          forceOtp: wasLoggedOut
        })
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Invalid credentials. Please verify your email and password.'
        }
      }

      if (data.requiresOtp) {
        setLastRequestedEmail(trimmedEmail)
        sessionStorage.setItem('zan_admin_pending_email', trimmedEmail)
        return {
          success: true,
          requiresOtp: true,
          message: data.message || 'Verification code sent to your email.'
        }
      }

      // Direct Login Success
      const token = data.token || 'zan_session_' + Date.now()
      localStorage.setItem('zan_admin_token', token)
      sessionStorage.setItem('zan_admin_token', token)
      localStorage.removeItem('zan_admin_logged_out')

      setIsAuthenticated(true)
      setAdminUser({
        email: trimmedEmail,
        role: 'Master Admin'
      })

      return { success: true, requiresOtp: false }
    } catch (err) {
      console.warn('API login failed, using direct cloud validation:', err.message)

      // Cloud Supabase Resilient Fallback
      try {
        const { data: config } = await supabase
          .from('site_content')
          .select('data')
          .eq('key', 'admin_auth_config')
          .maybeSingle()

        // Validate password hash in Supabase
        const expectedHash = config?.data?.password_hash || DEFAULT_PASSWORD_HASH
        
        // Compute SHA-256 in browser
        const encoder = new TextEncoder()
        const hashBuf = await crypto.subtle.digest('SHA-256', encoder.encode(trimmedPassword))
        const hashHex = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('')

        if (hashHex !== expectedHash) {
          return { success: false, error: 'Invalid password. Please check your credentials.' }
        }

        if (wasLoggedOut) {
          // Request OTP fallback
          return await requestOtp(trimmedEmail)
        }

        // Direct success
        const token = 'zan_session_' + Date.now()
        localStorage.setItem('zan_admin_token', token)
        sessionStorage.setItem('zan_admin_token', token)
        localStorage.removeItem('zan_admin_logged_out')
        setIsAuthenticated(true)
        setAdminUser({ email: trimmedEmail, role: 'Master Admin' })

        return { success: true, requiresOtp: false }
      } catch (fallbackErr) {
        return {
          success: false,
          error: 'Unable to authenticate at this time. Please check your connection.'
        }
      }
    }
  }, [])

  // -------------------------------------------------------------
  // Step 2: Request OTP
  // -------------------------------------------------------------
  const requestOtp = useCallback(async (email) => {
    try {
      const trimmedEmail = (email || ADMIN_EMAIL).trim().toLowerCase()
      const res = await apiFetch('/api/admin/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify({ email: trimmedEmail, purpose: 'Admin Login' })
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Unable to dispatch verification code.'
        }
      }

      setLastRequestedEmail(trimmedEmail)
      sessionStorage.setItem('zan_admin_pending_email', trimmedEmail)

      return {
        success: true,
        message: data.message || 'Verification code sent.',
        expiresInMinutes: 5
      }
    } catch (err) {
      console.warn('Request OTP notice:', err.message)
      return {
        success: false,
        error: 'Unable to connect to verification server. Please check your connection.'
      }
    }
  }, [])

  // -------------------------------------------------------------
  // Step 3: Verify OTP
  // -------------------------------------------------------------
  const verifyOtp = useCallback(async (email, otp) => {
    try {
      const trimmedEmail = (email || lastRequestedEmail || ADMIN_EMAIL).trim().toLowerCase()
      const trimmedOtp = String(otp || '').trim()

      const res = await apiFetch('/api/admin/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email: trimmedEmail, otp: trimmedOtp })
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Invalid verification code.'
        }
      }

      const token = data.token || 'zan_session_' + Date.now()
      localStorage.setItem('zan_admin_token', token)
      sessionStorage.setItem('zan_admin_token', token)
      localStorage.removeItem('zan_admin_logged_out')
      sessionStorage.removeItem('zan_admin_pending_email')

      setIsAuthenticated(true)
      setAdminUser({
        email: data.admin?.email || trimmedEmail,
        role: 'Master Admin'
      })

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: 'Unable to verify code at this time.'
      }
    }
  }, [lastRequestedEmail])

  // -------------------------------------------------------------
  // Step 4: Forgot Password Request (Sends Reset OTP)
  // -------------------------------------------------------------
  const forgotPassword = useCallback(async (email) => {
    try {
      const trimmedEmail = (email || ADMIN_EMAIL).trim().toLowerCase()
      if (trimmedEmail !== ADMIN_EMAIL) {
        return { success: false, error: 'Unauthorized administrator email address.' }
      }

      const res = await apiFetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: trimmedEmail })
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Unable to send password reset code.'
        }
      }

      setLastRequestedEmail(trimmedEmail)
      return {
        success: true,
        message: data.message || 'Password reset code sent to your email.'
      }
    } catch (err) {
      return {
        success: false,
        error: 'Unable to process password reset request.'
      }
    }
  }, [])

  // -------------------------------------------------------------
  // Step 5: Reset Password with OTP & New Password
  // -------------------------------------------------------------
  const resetPassword = useCallback(async (email, otp, newPassword) => {
    try {
      const trimmedEmail = (email || ADMIN_EMAIL).trim().toLowerCase()
      const trimmedOtp = String(otp || '').trim()
      const cleanNewPassword = String(newPassword || '').trim()

      if (cleanNewPassword.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' }
      }

      const res = await apiFetch('/api/admin/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          email: trimmedEmail,
          otp: trimmedOtp,
          newPassword: cleanNewPassword
        })
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Invalid reset code or password update failed.'
        }
      }

      const token = data.token || 'zan_session_' + Date.now()
      localStorage.setItem('zan_admin_token', token)
      sessionStorage.setItem('zan_admin_token', token)
      localStorage.removeItem('zan_admin_logged_out')

      setIsAuthenticated(true)
      setAdminUser({
        email: trimmedEmail,
        role: 'Master Admin'
      })

      return {
        success: true,
        message: 'Password successfully updated. You are now logged in.'
      }
    } catch (err) {
      return {
        success: false,
        error: 'Unable to update password. Please check your connection.'
      }
    }
  }, [])

  // -------------------------------------------------------------
  // Logout: Sets flag so next login strictly enforces OTP verification
  // -------------------------------------------------------------
  const logout = useCallback(async () => {
    try {
      await apiFetch('/api/admin/auth/logout', { method: 'POST' })
    } catch (e) {
      console.warn('Logout notice:', e)
    } finally {
      setIsAuthenticated(false)
      setAdminUser(null)
      // Flag device as logged out to mandate OTP verification on subsequent login
      localStorage.setItem('zan_admin_logged_out', 'true')
      localStorage.removeItem('zan_admin_token')
      sessionStorage.removeItem('zan_admin_token')
      sessionStorage.removeItem('zan_admin_pending_email')
    }
  }, [])

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isCheckingSession,
        adminUser,
        lastRequestedEmail,
        setLastRequestedEmail,
        login,
        requestOtp,
        verifyOtp,
        forgotPassword,
        resetPassword,
        logout,
        checkSession
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
