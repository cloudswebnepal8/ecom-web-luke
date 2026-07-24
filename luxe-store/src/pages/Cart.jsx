import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Cart() {
  const { items: rawItems, loading, error, updateQty, removeItem } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Defensive: drop any item whose product no longer exists (e.g. the
  // catalog was re-seeded after this item was added to a cart).
  const items = rawItems.filter((i) => i.product)

  const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.qty, 0)

  const goToCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout')
    } else {
      navigate('/login', { state: { from: { pathname: '/checkout' } } })
    }
  }

  if (loading) {
    return <p className="px-6 py-24 text-center text-slate-500">Loading cart…</p>
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="font-medium text-red-300">Couldn't reach the API.</p>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-white">Your cart is empty</h1>
        <p className="mt-3 text-slate-400">Add something worth owning.</p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-full bg-clay-600 px-8 py-3 font-medium text-white hover:bg-clay-500"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-serif text-3xl font-bold text-white">Your Cart</h1>

      <div className="mt-8 space-y-4">
        {items.map(({ product, qty }) => (
          <div
            key={product._id}
            className="flex items-center gap-4 rounded-2xl border border-white/5 bg-ink-800 p-4"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-20 w-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h3 className="font-serif font-semibold text-white">{product.name}</h3>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => updateQty(product._id, Math.max(1, qty - 1))}
                  className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-slate-300 hover:text-white"
                >
                  <Minus size={13} />
                </button>
                <span className="w-6 text-center text-sm text-slate-300">{qty}</span>
                <button
                  onClick={() => updateQty(product._id, qty + 1)}
                  className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-slate-300 hover:text-white"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>
            <span className="font-serif font-semibold text-clay-500">
              ₹{(product.price * qty).toLocaleString('en-IN')}
            </span>
            <button
              onClick={() => removeItem(product._id)}
              className="text-slate-500 hover:text-red-400"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
        <span className="text-lg text-slate-300">Subtotal</span>
        <span className="font-serif text-2xl font-bold text-white">
          ₹{subtotal.toLocaleString('en-IN')}
        </span>
      </div>

      <button
        onClick={goToCheckout}
        className="mt-6 w-full rounded-full bg-clay-600 py-3.5 font-medium text-white hover:bg-clay-500"
      >
        Checkout
      </button>
    </div>
  )
}
