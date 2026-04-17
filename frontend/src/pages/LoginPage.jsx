import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { BookOpen, Check, Sparkles, Book, MessageCircle } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, register } = useAuth()

  const [isLogin, setIsLogin] = useState(true) // Toggle between login and register
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    setError('') // Clear error when user types
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      let result
      
      if (isLogin) {
        // Call login from AuthContext
        result = await login(formData.email, formData.password)
      } else {
        // Call register from AuthContext
        result = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.passwordConfirm
        )
      }

      if (result.success) {
        setSuccess(`${isLogin ? 'Login' : 'Registration'} successful! Redirecting...`)

        // Redirect after 500ms (context is already updated)
        setTimeout(() => {
          navigate('/dashboard')
        }, 500)
      } else {
        setError(result.error || 'An error occurred')
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to server')
      console.error('Auth error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-gray to-soft-black/80 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <motion.div
          className="bg-warm-cream rounded-2xl shadow-2xl p-8"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <BookOpen size={40} className="text-slate-gray" strokeWidth={1.5} />
              <h1 className="text-3xl font-bold text-slate-gray">TaleHub</h1>
            </div>
            <p className="text-slate-gray/70 text-sm mt-2">
              {isLogin ? 'Welcome Back' : 'Join Our Community'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Register Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-gray mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required={!isLogin}
                  className="w-full px-4 py-2 border border-slate-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-gray"
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2 border border-slate-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-gray"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
                className="w-full px-4 py-2 border border-slate-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-gray"
              />
            </div>

            {/* Confirm Password Field (Register Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-gray mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  required={!isLogin}
                  className="w-full px-4 py-2 border border-slate-gray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-gray"
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 text-sm flex items-center gap-2">
                  <Check size={18} strokeWidth={2} />
                  {success}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-gray text-warm-cream font-semibold py-2 rounded-lg hover:bg-soft-black transition disabled:bg-slate-gray/50"
            >
              {loading
                ? 'Loading...'
                : isLogin
                  ? 'Login'
                  : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-gray/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-warm-cream text-slate-gray/70">or</span>
            </div>
          </div>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <p className="text-slate-gray/70 text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                  setSuccess('')
                  setFormData({
                    name: '',
                    email: '',
                    password: '',
                    passwordConfirm: '',
                  })
                }}
                className="ml-2 text-slate-gray font-semibold hover:text-soft-black transition"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>

          {/* Features */}
          {!isLogin && (
            <div className="mt-8 pt-6 border-t border-slate-gray/20">
              <p className="text-slate-gray font-semibold mb-3">
                When you join, you get:
              </p>
              <ul className="space-y-2 text-sm text-slate-gray/70">
                <li className="flex items-center gap-2">
                  <Sparkles size={16} className="text-slate-gray" />
                  Access to our book collection
                </li>
                <li className="flex items-center gap-2">
                  <Book size={16} className="text-slate-gray" />
                  Personalized reading list
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle size={16} className="text-slate-gray" />
                  Community discussions
                </li>
              </ul>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-6 text-white text-sm">
          <p>By continuing, you agree to our Terms of Service & Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}
