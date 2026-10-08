/**
 * Centralized API client for communicating with the backend.
 * Ensures credentials (HttpOnly cookies) and Authorization headers are automatically attached.
 */

export const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : '')
).replace(/\/$/, '')

/**
 * Fetch wrapper with credentials and error handling
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${BACKEND_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  
  // Attach token from sessionStorage as authorization header fallback
  const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('zan_admin_token') : null

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Automatically send and receive HttpOnly cookies
    headers
  })

  return response
}
