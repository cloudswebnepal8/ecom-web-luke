import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return <p className="px-6 py-24 text-center text-slate-500">Loading…</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user?.isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="font-serif text-2xl font-bold text-white">Admins only</h1>
        <p className="mt-2 text-slate-400">
          Your account doesn't have access to this page.
        </p>
      </div>
    )
  }

  return children
}
