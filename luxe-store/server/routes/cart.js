import { Router } from 'express'
import Cart from '../models/Cart.js'

const router = Router()

async function getOrCreateCart(sessionId) {
  let cart = await Cart.findOne({ sessionId }).populate('items.product')
  if (!cart) {
    cart = await Cart.create({ sessionId, items: [] })
    cart = await cart.populate('items.product')
  }

  // If a product was deleted (e.g. re-seeding the catalog), populate()
  // returns null for that item. Drop those so the cart never returns a
  // broken reference to the frontend.
  const hasOrphans = cart.items.some((i) => !i.product)
  if (hasOrphans) {
    cart.items = cart.items.filter((i) => i.product)
    await cart.save()
  }

  return cart
}

// GET /api/cart/:sessionId
router.get('/:sessionId', async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.params.sessionId)
    res.json(cart)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart', error: err.message })
  }
})

// POST /api/cart/:sessionId/items  { productId, qty }
router.post('/:sessionId/items', async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body
    if (!productId) return res.status(400).json({ message: 'productId is required' })

    let cart = await Cart.findOne({ sessionId: req.params.sessionId })
    if (!cart) cart = await Cart.create({ sessionId: req.params.sessionId, items: [] })

    const existing = cart.items.find((i) => i.product.toString() === productId)
    if (existing) {
      existing.qty += qty
    } else {
      cart.items.push({ product: productId, qty })
    }

    await cart.save()
    await cart.populate('items.product')
    res.status(201).json(cart)
  } catch (err) {
    res.status(400).json({ message: 'Failed to add item', error: err.message })
  }
})

// PUT /api/cart/:sessionId/items/:productId  { qty }
router.put('/:sessionId/items/:productId', async (req, res) => {
  try {
    const { qty } = req.body
    const cart = await Cart.findOne({ sessionId: req.params.sessionId })
    if (!cart) return res.status(404).json({ message: 'Cart not found' })

    const item = cart.items.find((i) => i.product.toString() === req.params.productId)
    if (!item) return res.status(404).json({ message: 'Item not in cart' })

    item.qty = qty
    await cart.save()
    await cart.populate('items.product')
    res.json(cart)
  } catch (err) {
    res.status(400).json({ message: 'Failed to update item', error: err.message })
  }
})

// DELETE /api/cart/:sessionId/items/:productId
router.delete('/:sessionId/items/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId })
    if (!cart) return res.status(404).json({ message: 'Cart not found' })

    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId)
    await cart.save()
    await cart.populate('items.product')
    res.json(cart)
  } catch (err) {
    res.status(400).json({ message: 'Failed to remove item', error: err.message })
  }
})

export default router
