import { validationResult } from 'express-validator'

export function sendValidationErrors(req, res, next) {
  const result = validationResult(req)
  if (!result.isEmpty()) return res.status(400).json({ message: 'Please correct the highlighted fields.', errors: result.array({ onlyFirstError: true }).map(({ path, msg }) => ({ field: path, message: msg })) })
  return next()
}

export function rejectMongoOperators(req, res, next) {
  const hasUnsafeKey = (value) => {
    if (!value || typeof value !== 'object') return false
    return Object.entries(value).some(([key, nested]) => key.startsWith('$') || key.includes('.') || ['__proto__', 'prototype', 'constructor'].includes(key) || hasUnsafeKey(nested))
  }
  if (hasUnsafeKey(req.body)) return res.status(400).json({ message: 'Invalid request data.' })
  return next()
}