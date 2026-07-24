import 'dotenv/config'
import mongoose from 'mongoose'
import Product from '../models/Product.js'

const products = [
  {
    name: 'Merino Wool Throw',
    category: 'Home',
    badge: 'Bestseller',
    discount: 25,
    rating: 4.8,
    reviews: 214,
    price: 5999,
    originalPrice: 7999,
    image:
      'https://images.unsplash.com/photo-1600369672771-4f04911e0e70?q=80&w=800&auto=format&fit=crop',
    description:
      'A generously sized throw woven from responsibly sourced merino wool. Soft against the skin, warm without weight, and finished with a hand-knotted fringe.',
  },
  {
    name: 'Ceramic Pour-Over Set',
    category: 'Kitchen',
    badge: 'New',
    discount: 20,
    rating: 4.9,
    reviews: 312,
    price: 3999,
    originalPrice: 4999,
    image:
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800&auto=format&fit=crop',
    description:
      'A stoneware pour-over dripper, server, and matching cups thrown by hand and finished in a reactive glaze. No two sets are exactly alike.',
  },
  {
    name: 'Linen Tote Bag',
    category: 'Accessories',
    badge: null,
    discount: 21,
    rating: 4.7,
    reviews: 189,
    price: 2199,
    originalPrice: 2799,
    image:
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop',
    description:
      'Heavyweight washed linen, cut roomy enough for a market run or a week of groceries. Reinforced straps carry the load comfortably.',
  },
  {
    name: 'Soy Wax Candle',
    category: 'Home',
    badge: 'Popular',
    discount: 26,
    rating: 4.6,
    reviews: 427,
    price: 1699,
    originalPrice: 2299,
    image:
      'https://images.unsplash.com/photo-1602874801007-bd3782342e5f?q=80&w=800&auto=format&fit=crop',
    description:
      'Hand-poured soy wax scented with cedar, clove, and warm amber. A slow, clean burn of roughly 45 hours in a reusable glass vessel.',
  },
  {
    name: 'Wireless Keyboard',
    category: 'Electronics',
    badge: null,
    discount: 25,
    rating: 4.5,
    reviews: 156,
    price: 4499,
    originalPrice: 5999,
    image:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop',
    description:
      'A low-profile mechanical keyboard with a satisfying tactile switch, aircraft-grade aluminum frame, and a battery that lasts for weeks.',
  },
  {
    name: 'Cable Knit Beanie',
    category: 'Accessories',
    badge: 'Limited',
    discount: 21,
    rating: 4.8,
    reviews: 98,
    price: 1399,
    originalPrice: 1799,
    image:
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop',
    description:
      'A classic cable knit in heavyweight merino, finished with a folded cuff. Made in a small batch each winter season.',
  },
  {
    name: 'Rattan Table Lamp',
    category: 'Home',
    badge: 'New',
    discount: 23,
    rating: 4.7,
    reviews: 143,
    price: 3299,
    originalPrice: 4299,
    image:
      'https://images.unsplash.com/photo-1543198126-42aa3980b30b?q=80&w=800&auto=format&fit=crop',
    description:
      'Woven rattan shade over a solid oak base, casting warm dappled light. Dimmable, with a fabric-braided cord.',
  },
  {
    name: 'Leather Notebook',
    category: 'Stationary',
    badge: 'Bestseller',
    discount: 20,
    rating: 4.9,
    reviews: 268,
    price: 1899,
    originalPrice: 2399,
    image:
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=800&auto=format&fit=crop',
    description:
      'Full-grain leather cover wrapped around 240 pages of thick, fountain-pen-friendly paper. Ages beautifully with use.',
  },
]

async function seed() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('✖ MONGODB_URI is not set. Copy server/.env.example to server/.env first.')
    process.exit(1)
  }

  await mongoose.connect(uri)
  console.log('✔ Connected to MongoDB Atlas')

  await Product.deleteMany({})
  console.log('✔ Cleared existing products')

  await Product.insertMany(products)
  console.log(`✔ Inserted ${products.length} products`)

  await mongoose.disconnect()
  console.log('✔ Done. Connection closed.')
}

seed().catch((err) => {
  console.error('✖ Seeding failed:', err.message)
  process.exit(1)
})
