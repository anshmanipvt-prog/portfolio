import jwt from 'jsonwebtoken'

export function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) return res.status(401).json({ message: 'Authentication required.' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })
    if (payload.role !== 'admin') return res.status(403).json({ message: 'Administrator access required.' })
    req.user = { id: payload.sub, role: payload.role }
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' })
  }
}