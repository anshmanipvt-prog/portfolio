import { Router } from 'express'
import { achievements } from '../controllers/contentController.js'
import { requireAdmin } from '../middleware/auth.js'
import { sendValidationErrors } from '../middleware/validation.js'
import { achievementRules, idRules } from './rules.js'

const router = Router()
router.get('/', achievements.list)
router.post('/', requireAdmin, achievementRules, sendValidationErrors, achievements.create)
router.put('/:id', requireAdmin, idRules, achievementRules, sendValidationErrors, achievements.update)
router.delete('/:id', requireAdmin, idRules, sendValidationErrors, achievements.remove)
export default router