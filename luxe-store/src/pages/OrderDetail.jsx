import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchOrderById } from '../services/api.js'

export default function OrderDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    fetchOrderById(token, id)
      .then((data) => {
        if (!ignore) setOrder(data)
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
  }, [token, id])

  if (loading) return <p className="px-6 py-24 text-center text-slate-500">Loading order…</p>

  if (error || !order) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-red-300">Couldn't find that order.</p>
        <Link to="/orders" className="mt-4 inline-block text-clay-500 hover:underline">
          View your orders
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="text-emerald-500" size={48} />
        <h1 className="mt-4 font-serif text-3xl font-bold text-white">Order placed!</h1>
        <p className="mt-2 text-slate-400">
          Order <span className="text-slate-300">#{order._id.slice(-8)}</span> — status:{' '}
          <span className="capitalize text-clay-500">{order.status}</span>
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-white/5 bg-ink-800 p-6">
        <h2 className="font-serif text-lg font-semibold text-white">Items</h2>
        <div className="mt-4 space-y-3">
          {order.items.map((item) => (
            <div key={item.product} className="flex items-center gap-3 text-sm">
              <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-slate-200">{item.name}</p>
                <p className="text-slate-500">Qty {item.qty}</p>
              </div>
              <span className="text-slate-300">
                ₹{(item.price * item.qty).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-slate-300">Subtotal</span>
          <span className="font-serif text-xl font-semibold text-white">
            ₹{order.subtotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/5 bg-ink-800 p-6">
        <h2 className="font-serif text-lg font-semibold text-white">Shipping to</h2>
        <p className="mt-2 text-sm text-slate-400">
          {order.shippingAddress.fullName}
          <br />
          {order.shippingAddress.line1}
          <br />
          {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          <br />
          {order.shippingAddress.country}
          <br />
          {order.shippingAddress.phone}
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          to="/"
          className="rounded-full bg-clay-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-clay-500"
        >
          Continue shopping
        </Link>
        <Link
          to="/orders"
          className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-medium text-slate-300 hover:text-white"
        >
          View all orders
        </Link>
      </div>
    </div>
  )
}
