import React from 'react'
import { AdminAuthProvider, useAdminAuth } from '../../context/AdminAuthContext'
import AdminLoginPage from './AdminLoginPage'
import AdminDashboard from './AdminDashboard'

function AdminPortalInner({ onNavigateHome }) {
  const { isAuthenticated } = useAdminAuth()

  if (!isAuthenticated) {
    return <AdminLoginPage onNavigateHome={onNavigateHome} />
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
