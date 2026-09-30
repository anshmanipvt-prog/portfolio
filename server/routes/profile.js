import { Router } from 'express'
import { getProfile, updateProfile } from '../controllers/profileController.js'
import { requireAdmin } from '../middleware/auth.js'
import { sendValidationErrors } from '../middleware/validation.js'
import { profileRules } from './rules.js'

const router = Router()
router.get('/', getProfile)
router.put('/', requireAdmin, profileRules, sendValidationErrors, updateProfile)
export default router