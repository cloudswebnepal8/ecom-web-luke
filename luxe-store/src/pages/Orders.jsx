import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchMyOrders } from '../services/api.js'

export default function Orders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    fetchMyOrders(token)
      .then((data) => {
        if (!ignore) setOrders(data)
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
  }, [token])

  if (loading) return <p className="px-6 py-24 text-center text-slate-500">Loading orders…</p>

  if (error) {
    return <p className="px-6 py-24 text-center text-red-300">{error}</p>
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="font-serif text-2xl font-bold text-white">No orders yet</h1>
        <p className="mt-2 text-slate-400">Your past orders will show up here.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full bg-clay-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-clay-500"
        >
          Start shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-serif text-3xl font-bold text-white">Your orders</h1>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="block rounded-2xl border border-white/5 bg-ink-800 p-5 transition hover:border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-serif font-semibold text-white">
                  Order #{order._id.slice(-8)}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item
                  {order.items.length > 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="font-serif font-semibold text-clay-500">
                  ₹{order.subtotal.toLocaleString('en-IN')}
                </p>
                <p className="mt-1 text-xs capitalize text-slate-500">{order.status}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
