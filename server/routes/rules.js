import { body, param } from 'express-validator'

const optionalUrl = (field) => body(field).optional({ checkFalsy: true }).isURL({ require_protocol: true }).withMessage('Enter a valid URL.')
const stringArray = (field) => body(field).optional().isArray({ max: 30 }).withMessage('Use a list of up to 30 items.').bail().custom((items) => items.every((item) => typeof item === 'string' && item.length <= 180))
const itemId = param('id').isMongoId().withMessage('Invalid item ID.')

export const idRules = [itemId]
export const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Enter a valid email.'),
  body('password').isString().isLength({ min: 1, max: 200 }).withMessage('Enter a password.'),
]
export const projectRules = [
  body('title').isString().trim().isLength({ min: 2, max: 120 }),
  body('description').isString().trim().isLength({ min: 10, max: 1500 }),
  body('category').isString().trim().isLength({ min: 2, max: 60 }),
  stringArray('technologies'), stringArray('features'),
  body('featured').optional().isBoolean(),
  body('subtitle').optional().isString().isLength({ max: 180 }),
  optionalUrl('githubUrl'), optionalUrl('liveUrl'), optionalUrl('image'),
]
export const experienceRules = [
  body('company').isString().trim().isLength({ min: 2, max: 120 }),
  body('position').isString().trim().isLength({ min: 2, max: 120 }),
  body('duration').isString().trim().isLength({ min: 2, max: 80 }),
  body('location').optional().isString().isLength({ max: 120 }),
  body('description').isString().trim().isLength({ min: 5, max: 1500 }),
  stringArray('technologies'), optionalUrl('certificateUrl'),
]
export const achievementRules = [
  body('title').isString().trim().isLength({ min: 2, max: 140 }),
  body('category').isString().trim().isLength({ min: 2, max: 80 }),
  body('date').optional().isString().isLength({ max: 80 }),
  body('description').isString().trim().isLength({ min: 5, max: 1500 }),
  optionalUrl('url'),
]
export const contactRules = [
  body('name').isString().trim().isLength({ min: 2, max: 80 }),
  body('email').isEmail().normalizeEmail().isLength({ max: 254 }),
  body('subject').isString().trim().isLength({ min: 2, max: 120 }),
  body('message').isString().trim().isLength({ min: 10, max: 4000 }),
]

const profileLimits = { name: 100, degree: 140, university: 140, duration: 40, cgpa: 20, phone: 32, headline: 180, intro: 700 }
export const profileRules = [
  body('email').optional().isEmail().normalizeEmail(),
  ...Object.entries(profileLimits).map(([field, max]) => body(field).optional().isString().trim().isLength({ max })),
  ...['github', 'linkedin', 'leetcode', 'geeksforgeeks', 'resumeUrl'].map((field) => body(field).optional({ checkFalsy: true }).isURL({ require_protocol: true }).withMessage('Enter a valid URL.')),
]