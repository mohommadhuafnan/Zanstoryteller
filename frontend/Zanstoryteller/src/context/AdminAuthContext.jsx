import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../utils/apiClient'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [adminUser, setAdminUser] = useState(null)
  const [lastRequestedEmail, setLastRequestedEmail] = useState(() => {
    try {
      return sessionStorage.getItem('zan_admin_pending_email') || ''
    } catch {
      return ''
    }
  })

  // -------------------------------------------------------------
  // Verify existing authenticated session on startup / page refresh
  // -------------------------------------------------------------
  const checkSession = useCallback(async () => {
    try {
      setIsCheckingSession(true)
      const res = await apiFetch('/api/admin/auth/me')

      if (res.ok) {
        const data = await res.json()
        if (data.authenticated && data.admin) {
          setIsAuthenticated(true)
          setAdminUser({
            email: data.email,
            role: 'Master Admin'
          })
          return true
        }
      }

      // Not authenticated or expired
      setIsAuthenticated(false)
      setAdminUser(null)
      sessionStorage.removeItem('zan_admin_token')
      return false
    } catch (err) {
      console.warn('Session check network notice:', err.message)
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
  // Step 1: Request OTP for the administrator email
  // -------------------------------------------------------------
  const requestOtp = useCallback(async (email) => {
    try {
      const trimmedEmail = email.trim()
      const res = await apiFetch('/api/admin/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify({ email: trimmedEmail })
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Unable to send verification code.'
        }
      }

      setLastRequestedEmail(trimmedEmail)
      try {
        sessionStorage.setItem('zan_admin_pending_email', trimmedEmail)
      } catch {}

      return {
        success: true,
        message: data.message || 'Verification code sent.',
        expiresInMinutes: data.expiresInMinutes || 5
      }
    } catch (err) {
      return {
        success: false,
        error: 'Unable to connect to verification server. Please check your connection.'
      }
    }
  }, [])

  // -------------------------------------------------------------
  // Step 2: Verify OTP
  // -------------------------------------------------------------
  const verifyOtp = useCallback(async (email, otp) => {
    try {
      const trimmedEmail = (email || lastRequestedEmail).trim()
      const trimmedOtp = String(otp).trim()

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

      // Store fallback Bearer token for client headers & update state
      if (data.token) {
        try {
          sessionStorage.setItem('zan_admin_token', data.token)
          sessionStorage.removeItem('zan_admin_pending_email')
        } catch {}
      }

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
  // Logout
  // -------------------------------------------------------------
  const logout = useCallback(async () => {
    try {
      await apiFetch('/api/admin/auth/logout', { method: 'POST' })
    } catch (e) {
      console.warn('Logout notice:', e)
    } finally {
      setIsAuthenticated(false)
      setAdminUser(null)
      try {
        sessionStorage.removeItem('zan_admin_token')
        sessionStorage.removeItem('zan_admin_pending_email')
      } catch {}
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
        requestOtp,
        verifyOtp,
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
