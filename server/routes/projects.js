import { Router } from 'express'
import { projects } from '../controllers/contentController.js'
import { requireAdmin } from '../middleware/auth.js'
import { sendValidationErrors } from '../middleware/validation.js'
import { idRules, projectRules } from './rules.js'

const router = Router()
router.get('/', projects.list)
router.post('/', requireAdmin, projectRules, sendValidationErrors, projects.create)
router.put('/:id', requireAdmin, idRules, projectRules, sendValidationErrors, projects.update)
router.delete('/:id', requireAdmin, idRules, sendValidationErrors, projects.remove)
export default router