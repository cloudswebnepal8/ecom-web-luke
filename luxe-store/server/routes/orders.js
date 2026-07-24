import { Router } from 'express'
import Cart from '../models/Cart.js'
import Order from '../models/Order.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// POST /api/orders  { shippingAddress }  — requires auth
// Reads the logged-in user's cart (identified as `user_<userId>`),
// snapshots it into an order, then empties the cart.
router.post('/', requireAuth, async (req, res) => {
  try {
    const { shippingAddress } = req.body
    const required = ['fullName', 'line1', 'city', 'postalCode', 'country', 'phone']
    const missing = required.filter((field) => !shippingAddress?.[field])
    if (missing.length) {
      return res.status(400).json({ message: `Missing shipping fields: ${missing.join(', ')}` })
    }

    const cartId = `user_${req.user._id}`
    const cart = await Cart.findOne({ sessionId: cartId }).populate('items.product')

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' })
    }

    const items = cart.items.map((i) => ({
      product: i.product._id,
      name: i.product.name,
      image: i.product.image,
      price: i.product.price,
      qty: i.qty,
    }))
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      subtotal,
      status: 'paid', // no real payment gateway wired up — treat as paid on placement
    })

    cart.items = []
    await cart.save()

    res.status(201).json(order)
  } catch (err) {
    res.status(400).json({ message: 'Checkout failed', error: err.message })
  }
})

// GET /api/orders/mine — requires auth
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message })
  }
})

// GET /api/orders/:id — requires auth, only the owner can view it
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order || order.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.json(order)
  } catch (err) {
    res.status(400).json({ message: 'Invalid order id', error: err.message })
  }
})

export default router
