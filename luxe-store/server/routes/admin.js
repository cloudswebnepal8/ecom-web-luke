import { Router } from 'express'
import Order from '../models/Order.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

// All routes below require a logged-in admin
router.use(requireAuth, requireAdmin)

// GET /api/admin/orders — every order, newest first, with customer info
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message })
  }
})

// GET /api/admin/orders/:id — one order, any customer
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(400).json({ message: 'Invalid order id', error: err.message })
  }
})

// PATCH /api/admin/orders/:id/status  { status }
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const allowed = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${allowed.join(', ')}` })
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    ).populate('user', 'name email')

    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(400).json({ message: 'Failed to update status', error: err.message })
  }
})

export default router
