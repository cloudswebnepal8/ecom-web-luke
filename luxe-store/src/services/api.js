const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `Request failed (${res.status})`)
  }
  return res.json()
}

// ---- Products ----

export function fetchProducts({ category, search } = {}) {
  const params = new URLSearchParams()
  if (category && category !== 'All') params.set('category', category)
  if (search) params.set('search', search)
  const query = params.toString() ? `?${params.toString()}` : ''
  return fetch(`${API_BASE}/products${query}`).then(handle)
}

export function fetchProductById(id) {
  return fetch(`${API_BASE}/products/${id}`).then(handle)
}

// ---- Cart ----

export function fetchCart(sessionId) {
  return fetch(`${API_BASE}/cart/${sessionId}`).then(handle)
}

export function addToCartRequest(sessionId, productId, qty = 1) {
  return fetch(`${API_BASE}/cart/${sessionId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, qty }),
  }).then(handle)
}

export function updateCartItemRequest(sessionId, productId, qty) {
  return fetch(`${API_BASE}/cart/${sessionId}/items/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qty }),
  }).then(handle)
}

export function removeCartItemRequest(sessionId, productId) {
  return fetch(`${API_BASE}/cart/${sessionId}/items/${productId}`, {
    method: 'DELETE',
  }).then(handle)
}

// ---- Auth ----

export function registerRequest(name, email, password) {
  return fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  }).then(handle)
}

export function loginRequest(email, password) {
  return fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(handle)
}

export function fetchMe(token) {
  return fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handle)
}

// ---- Orders ----

export function placeOrderRequest(token, shippingAddress) {
  return fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ shippingAddress }),
  }).then(handle)
}

export function fetchMyOrders(token) {
  return fetch(`${API_BASE}/orders/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handle)
}

export function fetchOrderById(token, id) {
  return fetch(`${API_BASE}/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handle)
}

// ---- Admin ----

export function fetchAllOrdersAdmin(token) {
  return fetch(`${API_BASE}/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handle)
}

export function updateOrderStatusAdmin(token, id, status) {
  return fetch(`${API_BASE}/admin/orders/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  }).then(handle)
}
