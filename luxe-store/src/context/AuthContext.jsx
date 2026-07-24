import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { loginRequest, registerRequest, fetchMe } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('luxe_token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    fetchMe(token)
      .then(({ user }) => setUser(user))
      .catch(() => {
        // token invalid/expired
        localStorage.removeItem('luxe_token')
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  const login = useCallback(async (email, password) => {
    const { token, user } = await loginRequest(email, password)
    localStorage.setItem('luxe_token', token)
    setToken(token)
    setUser(user)
  }, [])

  const register = useCallback(async (name, email, password) => {
    const { token, user } = await registerRequest(name, email, password)
    localStorage.setItem('luxe_token', token)
    setToken(token)
    setUser(user)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('luxe_token')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
