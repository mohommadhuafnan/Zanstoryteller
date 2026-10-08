import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import uploadRouter from './routes/upload.js'
import bookingsRouter from './routes/bookings.js'
import cmsRouter from './routes/cms.js'
import healthRouter from './routes/health.js'
import adminAuthRouter from './routes/adminAuth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Dynamic Origin Validation for CORS (enabling credentials / HttpOnly cookies)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'https://zanstoryteller.vercel.app'
]

if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(',').forEach((url) => {
    const trimmed = url.trim()
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed)
    }
  })
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true)
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        /^https?:\/\/localhost(:\d+)?$/.test(origin)
      ) {
        return callback(null, true)
      }
      return callback(new Error('CORS request blocked by security policy.'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
  })
)

// Cookie Parser Middleware with secret support
app.use(cookieParser(process.env.COOKIE_SECRET || 'zan_cookie_secret_2026'))

// JSON body parser with generous limit for CMS state payloads
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Routes
app.use('/api/health', healthRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/bookings', bookingsRouter)
app.use('/api/cms', cmsRouter)
app.use('/api/admin/auth', adminAuthRouter)

// Root info route
app.get('/', (req, res) => {
  res.json({
    project: 'Zan Storyteller API Backend',
    status: 'online',
    endpoints: {
      health: '/api/health',
      upload: '/api/upload',
      bookings: '/api/bookings',
      cms: '/api/cms',
      adminAuth: '/api/admin/auth'
    }
  })
})

// Global Error Handler (Production-safe, never leak internal stack traces)
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.message || err)
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Zan Storyteller backend running on http://localhost:${PORT}`)
})
