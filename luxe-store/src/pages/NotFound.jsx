import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="font-serif text-5xl font-bold text-white">404</h1>
      <p className="mt-3 text-slate-400">This page doesn't exist.</p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-clay-600 px-8 py-3 font-medium text-white hover:bg-clay-500"
      >
        Back to shop
      </Link>
    </div>
  )
}
