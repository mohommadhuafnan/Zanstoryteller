import React, { useEffect } from 'react'
import { AdminAuthProvider, useAdminAuth } from '../../context/AdminAuthContext'
import AdminLoginPage from './AdminLoginPage'
import AdminDashboard from './AdminDashboard'

function AdminPortalInner({ onNavigateHome }) {
  const { isAuthenticated, isCheckingSession } = useAdminAuth()

  // Keep browser URL synchronized (/admin/login <-> /admin/dashboard)
  useEffect(() => {
    if (isCheckingSession) return

    if (!isAuthenticated) {
      if (window.location.pathname === '/admin/dashboard' || window.location.pathname === '/admin') {
        window.history.replaceState({}, '', '/admin/login')
      }
    } else {
      if (window.location.pathname === '/admin/login' || window.location.pathname === '/admin') {
        window.history.replaceState({}, '', '/admin/dashboard')
      }
    }
  }, [isAuthenticated, isCheckingSession])

  // Prevent flicker while validating existing session cookie on startup/refresh
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
