import React, { useEffect } from 'react'
import { AdminAuthProvider, useAdminAuth } from '../../context/AdminAuthContext'
import AdminLoginPage from './AdminLoginPage'
import AdminDashboard from './AdminDashboard'

function AdminPortalInner({ onNavigateHome }) {
  const { isAuthenticated, isCheckingSession } = useAdminAuth()

  // Verify secret URL access
  const isDirectSecretUrl =
    typeof window !== 'undefined' &&
    (window.location.pathname === '/admin224' ||
      window.location.pathname === '/admin220' ||
      window.location.pathname.startsWith('/admin224') ||
      window.location.pathname.startsWith('/admin220'))

  if (isDirectSecretUrl && typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('zan_secret_admin_unlocked', 'true')
  }

  const isUnlocked =
    typeof sessionStorage !== 'undefined' &&
    (sessionStorage.getItem('zan_secret_admin_unlocked') === 'true' ||
      localStorage.getItem('zan_admin_token'))

  useEffect(() => {
    if (isCheckingSession) return

    // If unauthenticated and didn't use the secret admin URL (/admin224 or /admin220)
    if (!isAuthenticated && !isUnlocked && !isDirectSecretUrl) {
      onNavigateHome()
      return
    }

    if (isAuthenticated) {
      if (
        window.location.pathname === '/admin/login' ||
        window.location.pathname === '/admin224' ||
        window.location.pathname === '/admin220' ||
        window.location.pathname === '/admin'
      ) {
        window.history.replaceState({}, '', '/admin/dashboard')
      }
    }
  }, [isAuthenticated, isCheckingSession, isUnlocked, isDirectSecretUrl, onNavigateHome])

  if (isCheckingSession) {
    return (
      <div className="min-h-screen w-full bg-[#0d1b2a] flex items-center justify-center text-white font-mono text-xs tracking-widest uppercase">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 border-2 border-[#D8BB7B] border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-300">Authenticating Sovereign Session...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    if (!isUnlocked && !isDirectSecretUrl) {
      return null
    }

    return (
      <AdminLoginPage
        onNavigateHome={onNavigateHome}
        onLoginSuccess={() => {
          window.history.replaceState({}, '', '/admin/dashboard')
        }}
      />
    )
  }

  return <AdminDashboard onNavigateHome={onNavigateHome} />
}

export default function AdminPortal({ onNavigateHome }) {
  return (
    <AdminAuthProvider>
      <AdminPortalInner onNavigateHome={onNavigateHome} />
    </AdminAuthProvider>
  )
}
