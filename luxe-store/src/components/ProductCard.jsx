import React from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'

const badgeStyles = {
  Bestseller: 'bg-clay-600',
  New: 'bg-emerald-600',
  Popular: 'bg-violet-600',
  Limited: 'bg-rose-600',
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/5 bg-ink-800 transition hover:border-white/10">
      <Link to={`/product/${product._id}`} className="relative block aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white ${
              badgeStyles[product.badge] || 'bg-slate-600'
            }`}
          >
            {product.badge}
          </span>
        )}
        {product.discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-semibold text-white">
            -{product.discount}%
          </span>
        )}
      </Link>

      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          {product.category}
        </p>
        <Link to={`/product/${product._id}`}>
          <h3 className="mt-1 font-serif text-lg font-semibold text-white hover:text-clay-500">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1.5 text-sm">
          <div className="flex text-clay-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                strokeWidth={1.5}
              />
            ))}
          </div>
          <span className="text-slate-300">{product.rating}</span>
          <span className="text-slate-500">· {product.reviews} reviews</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="font-serif text-xl font-semibold text-clay-500">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-slate-500 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="rounded-full bg-clay-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-clay-500"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
