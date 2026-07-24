import { Router } from 'express'
import Product from '../models/Product.js'

const router = Router()

// GET /api/products?category=Home&search=wool
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query
    const filter = {}

    if (category && category !== 'All') filter.category = category
    if (search) filter.name = { $regex: search, $options: 'i' }

    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(400).json({ message: 'Invalid product id', error: err.message })
  }
})

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ message: 'Failed to create product', error: err.message })
  }
})

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(400).json({ message: 'Failed to update product', error: err.message })
  }
})

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete product', error: err.message })
  }
})

export default router
