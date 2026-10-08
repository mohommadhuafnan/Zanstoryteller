import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AUTH_STORAGE_KEY = 'zan_admin_credentials_v2'
const SESSION_STORAGE_KEY = 'zan_admin_session_token'
const LOCKOUT_KEY = 'zan_admin_lockout'

// Default credentials
const DEFAULT_CREDENTIALS = {
  username: 'admin',
  email: 'fowzan80@gmail.com',
  password: 'zanadmin2026',
  displayName: 'Mohammad Zan',
  role: 'Master Admin'
}

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [credentials, setCredentials] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) return { ...DEFAULT_CREDENTIALS, ...JSON.parse(stored) }
    } catch {
      // fallback
    }
    return DEFAULT_CREDENTIALS
  })

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const session = sessionStorage.getItem(SESSION_STORAGE_KEY) || localStorage.getItem(SESSION_STORAGE_KEY)
      return !!session
    } catch {
      return false
    }
  })

  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockoutUntil, setLockoutUntil] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCKOUT_KEY)
      if (stored && Number(stored) > Date.now()) {
        return Number(stored)
      }
    } catch {
      // fallback
    }
    return null
  })

  // Check lockout on timer
  useEffect(() => {
    if (!lockoutUntil) return
    const interval = setInterval(() => {
      if (Date.now() >= lockoutUntil) {
        setLockoutUntil(null)
        setFailedAttempts(0)
        localStorage.removeItem(LOCKOUT_KEY)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [lockoutUntil])

  const login = useCallback((usernameOrEmail, password, rememberMe = false) => {
    // Check if locked out
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingSec = Math.ceil((lockoutUntil - Date.now()) / 1000)
      return {
        success: false,
        error: `Too many failed attempts. Security lockout active for ${remainingSec}s.`
      }
    }

    const inputUser = usernameOrEmail.trim().toLowerCase()
    const validUser = (inputUser === credentials.username.toLowerCase() || inputUser === credentials.email.toLowerCase())
    const validPass = password === credentials.password

    if (validUser && validPass) {
      const token = `zan_sec_${Date.now()}_${Math.random().toString(36).substring(2)}`
      if (rememberMe) {
        localStorage.setItem(SESSION_STORAGE_KEY, token)
      } else {
        sessionStorage.setItem(SESSION_STORAGE_KEY, token)
      }
      setIsAuthenticated(true)
      setFailedAttempts(0)
      localStorage.removeItem(LOCKOUT_KEY)
      return { success: true }
    } else {
      const newAttempts = failedAttempts + 1
      setFailedAttempts(newAttempts)
      if (newAttempts >= 5) {
        const lockoutTime = Date.now() + 60 * 1000 // 60 seconds
        setLockoutUntil(lockoutTime)
        localStorage.setItem(LOCKOUT_KEY, String(lockoutTime))
        return {
          success: false,
          error: "5 consecutive failed attempts. Locked for 60 seconds for security."
        }
      }
      return {
        success: false,
        error: `Invalid username or password. (${5 - newAttempts} attempts remaining before lockout)`
      }
    }
  }, [credentials, failedAttempts, lockoutUntil])

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    localStorage.removeItem(SESSION_STORAGE_KEY)
    setIsAuthenticated(false)
  }, [])

  const updateCredentials = useCallback((newCreds) => {
    setCredentials(prev => {
      const next = { ...prev, ...newCreds }
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next))
      return next
    })
    return true
  }, [])

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        credentials,
        login,
        logout,
        updateCredentials,
        lockoutUntil,
        failedAttempts
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
