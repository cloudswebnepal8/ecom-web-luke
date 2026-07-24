import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Star, ArrowLeft } from 'lucide-react'
import { fetchProductById } from '../services/api.js'
import { useCart } from '../context/CartContext.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    fetchProductById(id)
      .then((data) => {
        if (!ignore) setProduct(data)
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [id])

  if (loading) {
    return <p className="px-6 py-24 text-center text-slate-500">Loading product…</p>
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-slate-400">We couldn't find that product.</p>
        <Link to="/" className="mt-4 inline-block text-clay-500 hover:underline">
          Back to shop
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-white/5">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {product.category}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="flex text-clay-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="text-slate-300">{product.rating}</span>
            <span className="text-slate-500">· {product.reviews} reviews</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-semibold text-clay-500">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-slate-500 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {product.discount > 0 && (
              <span className="rounded-full bg-red-600/20 px-2.5 py-1 text-xs font-semibold text-red-400">
                Save {product.discount}%
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-slate-400">{product.description}</p>

          <button
            onClick={() => addToCart(product)}
            className="mt-8 w-full rounded-full bg-clay-600 py-3.5 font-medium text-white transition hover:bg-clay-500 sm:w-auto sm:px-10"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
