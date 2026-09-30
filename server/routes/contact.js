import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { createMessage, deleteMessage, listMessages } from '../controllers/contactController.js'
import { requireAdmin } from '../middleware/auth.js'
import { sendValidationErrors } from '../middleware/validation.js'
import { contactRules, idRules } from './rules.js'

const router = Router()
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Too many messages from this connection. Try again later.' } })

router.post('/', contactLimiter, contactRules, sendValidationErrors, createMessage)
router.get('/', requireAdmin, listMessages)
router.delete('/:id', requireAdmin, idRules, sendValidationErrors, deleteMessage)
export default router