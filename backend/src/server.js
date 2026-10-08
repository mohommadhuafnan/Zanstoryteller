import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import uploadRouter from './routes/upload.js'
import bookingsRouter from './routes/bookings.js'
import cmsRouter from './routes/cms.js'
import healthRouter from './routes/health.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// JSON body parser with generous limit for CMS state payloads
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Routes
app.use('/api/health', healthRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/bookings', bookingsRouter)
app.use('/api/cms', cmsRouter)

// Root info route
app.get('/', (req, res) => {
  res.json({
    project: 'Zan Storyteller API Backend',
    status: 'online',
    endpoints: {
      health: '/api/health',
      upload: '/api/upload',
      bookings: '/api/bookings',
      cms: '/api/cms'
    }
  })
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Zan Storyteller backend running on http://localhost:${PORT}`)
})
