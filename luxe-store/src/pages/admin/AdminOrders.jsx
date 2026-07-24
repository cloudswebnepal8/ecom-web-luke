import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { fetchAllOrdersAdmin, updateOrderStatusAdmin } from '../../services/api.js'

const statusOptions = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

const statusStyles = {
  pending: 'bg-slate-500/20 text-slate-300',
  paid: 'bg-emerald-500/20 text-emerald-300',
  shipped: 'bg-indigo-500/20 text-indigo-300',
  delivered: 'bg-clay-600/20 text-clay-400',
  cancelled: 'bg-red-500/20 text-red-300',
}

export default function AdminOrders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const loadOrders = () => {
    setLoading(true)
    fetchAllOrdersAdmin(token)
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(loadOrders, [token])

  const onStatusChange = async (orderId, status) => {
    setUpdatingId(orderId)
    try {
      const updated = await updateOrderStatusAdmin(token, orderId, status)
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)))
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const revenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.subtotal, 0)

  if (loading) return <p className="px-6 py-24 text-center text-slate-500">Loading orders…</p>

  if (error) return <p className="px-6 py-24 text-center text-red-300">{error}</p>

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Order dashboard</h1>
          <p className="mt-1 text-slate-400">All orders placed on the store, newest first.</p>
        </div>
        <div className="flex gap-6 rounded-2xl border border-white/5 bg-ink-800 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Orders</p>
            <p className="mt-1 font-serif text-xl font-semibold text-white">{orders.length}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Revenue</p>
            <p className="mt-1 font-serif text-xl font-semibold text-clay-500">
              ₹{revenue.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="py-20 text-center text-slate-500">No orders yet.</p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-800 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr
                    onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                    className="cursor-pointer border-t border-white/5 bg-ink-900 transition hover:bg-ink-800"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-slate-400">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-200">{order.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{order.user?.email}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{order.items.length}</td>
                    <td className="px-5 py-4 font-medium text-clay-500">
                      ₹{order.subtotal.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => onStatusChange(order._id, e.target.value)}
                        className={`rounded-full border-0 px-3 py-1.5 text-xs font-medium capitalize outline-none disabled:opacity-50 ${statusStyles[order.status]}`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s} className="bg-ink-800 text-slate-200">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>

                  {expandedId === order._id && (
                    <tr className="border-t border-white/5 bg-ink-950">
                      <td colSpan={6} className="px-5 py-5">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Items
                            </p>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={item.product} className="flex items-center gap-3 text-sm">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-10 w-10 rounded-lg object-cover"
                                  />
                                  <span className="flex-1 text-slate-300">{item.name}</span>
                                  <span className="text-slate-500">×{item.qty}</span>
                                  <span className="text-slate-300">
                                    ₹{(item.price * item.qty).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Shipping to
                            </p>
                            <p className="text-sm leading-relaxed text-slate-400">
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
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
