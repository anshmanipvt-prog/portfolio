import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function login(req, res) {
  const email = req.body.email.toLowerCase()
  const user = await User.findOne({ email }).select('+passwordHash')
  const passwordMatches = user ? await bcrypt.compare(req.body.password, user.passwordHash) : false
  if (!user || !passwordMatches) return res.status(401).json({ message: 'Email or password is incorrect.' })

  const token = jwt.sign({ role: user.role }, process.env.JWT_SECRET, { subject: user.id, algorithm: 'HS256', expiresIn: '8h' })
  return res.json({ token, expiresIn: 28800, user: { email: user.email, role: user.role } })
}