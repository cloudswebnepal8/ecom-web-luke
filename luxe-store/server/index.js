import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import productRoutes from './routes/products.js'
import cartRoutes from './routes/cart.js'
import authRoutes from './routes/auth.js'
import orderRoutes from './routes/orders.js'
import adminRoutes from './routes/admin.js'

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  }),
)
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)

// Fallback for unknown API routes
app.use('/api', (req, res) => res.status(404).json({ message: 'Route not found' }))

const PORT = process.env.PORT || 5000

if (!process.env.JWT_SECRET) {
  console.error(
    '\n✖ JWT_SECRET is not set in server/.env. Add a long random string, e.g. JWT_SECRET=someLongRandomValue\n',
  )
  process.exit(1)
}

connectDB().then(() => {
  app.listen(PORT, () => console.log(`✔ API running on http://localhost:${PORT}`))
})
