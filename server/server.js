import './config/env.js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { connectDatabase } from './config/db.js'
import { rejectMongoOperators } from './middleware/validation.js'
import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'
import experienceRoutes from './routes/experience.js'
import achievementRoutes from './routes/achievements.js'
import contactRoutes from './routes/contact.js'
import profileRoutes from './routes/profile.js'

export const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((origin) => origin.trim()).filter(Boolean)
app.use(helmet())
app.use(cors({ origin(origin, callback) { if (!origin || allowedOrigins.includes(origin)) return callback(null, true); return callback(new Error('Origin is not allowed by CORS.')) }, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'], maxAge: 600 }))
app.use(express.json({ limit: '20kb', type: 'application/json' }))
app.use(rejectMongoOperators)
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 180, standardHeaders: 'draft-7', legacyHeaders: false }))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/experience', experienceRoutes)
app.use('/api/achievements', achievementRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api', (req, res) => res.status(404).json({ message: 'API route not found.' }))

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error)
  if (error.name === 'ValidationError' || error.name === 'CastError') return res.status(400).json({ message: 'Submitted data is invalid.' })
  if (error.code === 11000) return res.status(409).json({ message: 'That record already exists.' })
  if (error.message === 'Origin is not allowed by CORS.') return res.status(403).json({ message: error.message })
  console.error(error)
  return res.status(500).json({ message: 'An unexpected server error occurred.' })
})

if (process.env.NODE_ENV !== 'test') {
  const port = Number(process.env.PORT) || 5000
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be configured with at least 32 characters.')
  connectDatabase().then(() => app.listen(port, () => console.info(`Portfolio API listening on port ${port}`))).catch((error) => {
    console.error(`API startup failed: ${error.message}`)
    process.exitCode = 1
  })
}