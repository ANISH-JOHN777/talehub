import { createContext, useContext, useState, useEffect } from 'react'

// Create Auth Context
const AuthContext = createContext()

// Mock user for demo
const MOCK_USER = {
  _id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  avatar: 'https://via.placeholder.com/100?text=DU',
  tier: 'pro',
  totalBooksRead: 8,
  bio: 'Welcome to TaleHub Learning Platform',
}

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setToken('demo-token')
    }

    setLoading(false)
  }, [])

  // Simple login toggle (client-side only)
  const login = () => {
    const userData = { ...MOCK_USER }
    setUser(userData)
    setToken('demo-token')
    localStorage.setItem('user', JSON.stringify(userData))
    return { success: true, data: userData }
  }

  // Simple logout toggle (client-side only)
  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return { success: true }
  }

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use Auth Context
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
