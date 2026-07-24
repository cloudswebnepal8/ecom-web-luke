import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, User, ShoppingBag, MoonStar, LogOut, Package, LayoutDashboard } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar({ search, onSearchChange }) {
  const { count } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-ink-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        <Link to="/" className="font-serif text-2xl font-semibold tracking-wide text-white">
          LUXE<span className="text-clay-600">.</span>
        </Link>

        <div className="relative mx-auto hidden w-full max-w-md flex-1 sm:block">
          <input
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            type="text"
            placeholder="Search products..."
            className="w-full rounded-full border border-white/10 bg-ink-900 py-2.5 pl-5 pr-11 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-clay-600/60"
          />
          <Search
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
        </div>

        <div className="ml-auto flex items-center gap-3 sm:ml-0">
          <button
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white"
          >
            <MoonStar size={16} />
          </button>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Account menu"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-300 hover:text-white"
              >
                <User size={17} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-11 w-48 overflow-hidden rounded-xl border border-white/10 bg-ink-800 shadow-xl">
                  <div className="border-b border-white/5 px-4 py-3">
                    <p className="truncate text-sm font-medium text-white">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  <Link
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-ink-700 hover:text-white"
                  >
                    <Package size={15} /> Your orders
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin/orders"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-ink-700 hover:text-white"
                    >
                      <LayoutDashboard size={15} /> Admin dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-ink-700 hover:text-white"
                  >
                    <LogOut size={15} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              aria-label="Log in"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-300 hover:text-white"
            >
              <User size={17} />
            </Link>
          )}

          <Link
            to="/cart"
            aria-label="Cart"
            className="relative grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-300 hover:text-white"
          >
            <ShoppingBag size={17} />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-clay-600 text-[11px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
