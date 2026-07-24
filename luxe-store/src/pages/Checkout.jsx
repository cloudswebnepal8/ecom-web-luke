import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { placeOrderRequest } from '../services/api.js'

const emptyAddress = {
  fullName: '',
  line1: '',
  city: '',
  postalCode: '',
  country: '',
  phone: '',
}

export default function Checkout() {
  const { items: rawItems, loading, clearLocalCart } = useCart()
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const items = rawItems.filter((i) => i.product)

  const [address, setAddress] = useState({ ...emptyAddress, fullName: user?.name || '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.qty, 0)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const order = await placeOrderRequest(token, address)
      clearLocalCart()
      navigate(`/orders/${order._id}`, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="px-6 py-24 text-center text-slate-500">Loading your cart…</p>
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="font-serif text-2xl font-bold text-white">Your cart is empty</h1>
        <p className="mt-2 text-slate-400">Add something before checking out.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-serif text-3xl font-bold text-white">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <form onSubmit={onSubmit} className="space-y-4 lg:col-span-2">
          <h2 className="font-serif text-lg font-semibold text-white">Shipping address</h2>

          <div>
            <label className="mb-1.5 block text-sm text-slate-400">Full name</label>
            <input
              required
              value={address.fullName}
              onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-2.5 text-slate-200 outline-none focus:border-clay-600/60"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-400">Address</label>
            <input
              required
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-2.5 text-slate-200 outline-none focus:border-clay-600/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">City</label>
              <input
                required
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-2.5 text-slate-200 outline-none focus:border-clay-600/60"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">Postal code</label>
              <input
                required
                value={address.postalCode}
                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-2.5 text-slate-200 outline-none focus:border-clay-600/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">Country</label>
              <input
                required
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-2.5 text-slate-200 outline-none focus:border-clay-600/60"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">Phone</label>
              <input
                required
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-ink-800 px-4 py-2.5 text-slate-200 outline-none focus:border-clay-600/60"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-clay-600 py-3.5 font-medium text-white transition hover:bg-clay-500 disabled:opacity-60"
          >
            {submitting ? 'Placing order…' : `Place order — ₹${subtotal.toLocaleString('en-IN')}`}
          </button>
        </form>

        <div className="h-fit rounded-2xl border border-white/5 bg-ink-800 p-6">
          <h2 className="font-serif text-lg font-semibold text-white">Order summary</h2>
          <div className="mt-4 space-y-3">
            {items.map(({ product, qty }) => (
              <div key={product._id} className="flex items-center gap-3 text-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-slate-200">{product.name}</p>
                  <p className="text-slate-500">Qty {qty}</p>
                </div>
                <span className="text-slate-300">
                  ₹{(product.price * qty).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-slate-300">Subtotal</span>
            <span className="font-serif text-xl font-semibold text-white">
              ₹{subtotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
