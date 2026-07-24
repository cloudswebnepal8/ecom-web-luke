import { Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

function toPublicUser(user) {
  return { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
}

// POST /api/auth/register  { name, email, password }
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are all required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' })
    }

    const user = await User.create({ name, email, password })
    const token = signToken(user)

    res.status(201).json({ token, user: toPublicUser(user) })
  } catch (err) {
    res.status(400).json({ message: 'Registration failed', error: err.message })
  }
})

// POST /api/auth/login  { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const match = await user.comparePassword(password)
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = signToken(user)
    res.json({ token, user: toPublicUser(user) })
  } catch (err) {
    res.status(400).json({ message: 'Login failed', error: err.message })
  }
})

// GET /api/auth/me  (requires Authorization: Bearer <token>)
router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: toPublicUser(req.user) })
})

export default router
