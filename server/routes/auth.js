import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { login } from '../controllers/authController.js'
import { sendValidationErrors } from '../middleware/validation.js'
import { loginRules } from './rules.js'

const router = Router()
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Too many sign-in attempts. Try again later.' } })

router.post('/login', loginLimiter, loginRules, sendValidationErrors, login)

export default router