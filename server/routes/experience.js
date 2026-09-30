import { Router } from 'express'
import { experience } from '../controllers/contentController.js'
import { requireAdmin } from '../middleware/auth.js'
import { sendValidationErrors } from '../middleware/validation.js'
import { experienceRules, idRules } from './rules.js'

const router = Router()
router.get('/', experience.list)
router.post('/', requireAdmin, experienceRules, sendValidationErrors, experience.create)
router.put('/:id', requireAdmin, idRules, experienceRules, sendValidationErrors, experience.update)
router.delete('/:id', requireAdmin, idRules, sendValidationErrors, experience.remove)
export default router