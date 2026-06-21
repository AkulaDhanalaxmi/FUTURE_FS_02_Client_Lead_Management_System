import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(() => localStorage.getItem('crm_token'))

  const setAuthToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem('crm_token', newToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } else {
      localStorage.removeItem('crm_token')
      delete api.defaults.headers.common['Authorization']
    }
    setToken(newToken)
  }, [])

  // Verify token on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('crm_token')
      if (!storedToken) {
        setLoading(false)
        return
      }
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      try {
        const { data } = await api.get('/auth/me')
        setUser(data.user)
        setToken(storedToken)
      } catch {
        setAuthToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    verifyAuth()
  }, [setAuthToken])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setAuthToken(data.token)
    setUser(data.user)
    return data
  }

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    setAuthToken(data.token)
    setUser(data.user)
    return data
  }

  const logout = async () => {
    try { await api.post('/auth/logout') } catch {}
    setAuthToken(null)
    setUser(null)
  }

  const updateUser = (updatedUser) => setUser(updatedUser)

  return (
    <AuthContext.Provider value={{ user, loading, token, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
