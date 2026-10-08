/**
 * Centralized API client for communicating with the backend.
 * Ensures credentials (HttpOnly cookies) and Authorization headers are automatically attached.
 */

export const BACKEND_URL = (
  typeof window !== 'undefined' && 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1'
    ? '' // In production (e.g. Vercel), always use same-origin relative URL so API requests route to /api
    : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000')
).replace(/\/$/, '')

/**
 * Fetch wrapper with credentials and error handling
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${BACKEND_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  
  // Attach token from localStorage/sessionStorage as authorization header fallback
  const token = typeof localStorage !== 'undefined'
    ? (localStorage.getItem('zan_admin_token') || sessionStorage.getItem('zan_admin_token'))
    : null

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers
  })

  return response
}
