import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'
import {
  fetchCart,
  addToCartRequest,
  updateCartItemRequest,
  removeCartItemRequest,
} from '../services/api.js'
import { useAuth } from './AuthContext.jsx'

const CartContext = createContext(null)

function getGuestId() {
  let id = localStorage.getItem('luxe_guest_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('luxe_guest_id', id)
  }
  return id
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [guestId] = useState(getGuestId)
  const cartId = user ? `user_${user.id}` : guestId

  const [items, setItems] = useState([]) // [{ product, qty }]
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const previousCartId = useRef(null)

  const loadCart = useCallback(async () => {
    try {
      setLoading(true)
      const cart = await fetchCart(cartId)
      setItems(cart.items || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [cartId])

  useEffect(() => {
    async function loadAndMaybeMerge() {
      // If someone just logged in (cartId switched from the guest id to a
      // user id), fold any items sitting in their guest cart into their
      // account cart so they don't lose what they added before logging in.
      const justLoggedIn =
        previousCartId.current && previousCartId.current === guestId && cartId !== guestId

      if (justLoggedIn) {
        try {
          const guestCart = await fetchCart(guestId)
          for (const { product, qty } of guestCart.items || []) {
            await addToCartRequest(cartId, product._id, qty)
          }
        } catch {
          // best-effort merge; ignore failures and just load the user cart below
        }
      }

      previousCartId.current = cartId
      await loadCart()
    }

    loadAndMaybeMerge()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartId])

  const addToCart = useCallback(
    async (product, qty = 1) => {
      try {
        const cart = await addToCartRequest(cartId, product._id || product.id, qty)
        setItems(cart.items || [])
      } catch (err) {
        setError(err.message)
      }
    },
    [cartId],
  )

  const updateQty = useCallback(
    async (productId, qty) => {
      try {
        const cart = await updateCartItemRequest(cartId, productId, qty)
        setItems(cart.items || [])
      } catch (err) {
        setError(err.message)
      }
    },
    [cartId],
  )

  const removeItem = useCallback(
    async (productId) => {
      try {
        const cart = await removeCartItemRequest(cartId, productId)
        setItems(cart.items || [])
      } catch (err) {
        setError(err.message)
      }
    },
    [cartId],
  )

  const clearLocalCart = useCallback(() => setItems([]), [])

  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQty,
        removeItem,
        count,
        loading,
        error,
        refresh: loadCart,
        clearLocalCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
