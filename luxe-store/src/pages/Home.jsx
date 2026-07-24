import React, { useEffect, useMemo, useState } from 'react'
import { categories } from '../data/products.js'
import { fetchProducts } from '../services/api.js'
import ProductCard from '../components/ProductCard.jsx'

const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Rating']

export default function Home({ search }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [sort, setSort] = useState('Featured')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    fetchProducts({ category: activeCategory, search })
      .then((data) => {
        if (!ignore) {
          setProducts(data)
          setError(null)
        }
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
  }, [activeCategory, search])

  const visibleProducts = useMemo(() => {
    let list = [...products]
    if (sort === 'Price: Low to High') list.sort((a, b) => a.price - b.price)
    if (sort === 'Price: High to Low') list.sort((a, b) => b.price - a.price)
    if (sort === 'Rating') list.sort((a, b) => b.rating - a.rating)
    return list
  }, [products, sort])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-14 pt-20 text-center">
        <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-40 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-clay-500">
          Curated Collection
        </p>
        <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-white sm:text-6xl">
          Objects Worth <br />
          <span className="text-clay-600">Owning.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-slate-400">
          Thoughtfully designed goods for everyday living. Quality over quantity, always.
        </p>
      </section>

      {/* Filters */}
      <section className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 pb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeCategory === cat
                ? 'bg-clay-600 text-white'
                : 'bg-ink-800 text-slate-300 hover:bg-ink-700'
            }`}
          >
            {cat}
          </button>
        ))}

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="ml-auto rounded-full border border-white/10 bg-ink-800 px-4 py-2 text-sm text-slate-200 outline-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt} value={opt}>
              Sort: {opt}
            </option>
          ))}
        </select>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        {loading && <p className="py-20 text-center text-slate-500">Loading products…</p>}

        {!loading && error && (
          <div className="mx-auto max-w-lg rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-red-300">
            <p className="font-medium">Couldn't reach the API.</p>
            <p className="mt-1 text-sm text-red-300/80">
              Make sure the backend server is running on the URL set in{' '}
              <code className="text-red-200">VITE_API_URL</code> and that MongoDB Atlas is
              connected.
            </p>
            <p className="mt-2 text-xs text-red-300/60">{error}</p>
          </div>
        )}

        {!loading && !error && visibleProducts.length === 0 && (
          <p className="py-20 text-center text-slate-500">
            No products match your search. Try a different filter.
          </p>
        )}

        {!loading && !error && visibleProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
