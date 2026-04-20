import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { BookOpen, Check, Sparkles, Book, MessageCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import useFormValidation from '../hooks/useFormValidation'
import { validators } from '../utils/formValidation'
import { showToast } from '../utils/toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, register } = useAuth()

  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Validation schema
  const loginSchema = {
    email: validators.email,
    password: (value) => {
      if (!value) return 'Password is required'
      return null
    },
  }

  const registerSchema = {
    name: (value) => validators.required(value, 'Full name'),
    email: validators.email,
    password: validators.password,
    passwordConfirm: (value) => {
      if (!value) return 'Please confirm your password'
      return null
    },
  }

  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    getFieldError,
    isFieldTouched,
  } = useFormValidation(
    { name: '', email: '', password: '', passwordConfirm: '' },
    isLogin ? loginSchema : registerSchema
  )

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate all fields
    if (!validateAll()) {
      showToast.error('Please fix the errors in the form')
      return
    }

    setLoading(true)

    try {
      let result

      if (isLogin) {
        result = await login(formData.email, formData.password)
      } else {
        // Check if passwords match
        if (formData.password !== formData.passwordConfirm) {
          showToast.error('Passwords do not match')
          setLoading(false)
          return
        }

        result = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.passwordConfirm
        )
      }

      if (result.success) {
        showToast.success(`${isLogin ? 'Login' : 'Registration'} successful! Redirecting...`)
        setTimeout(() => {
          navigate('/dashboard')
        }, 500)
      } else {
        showToast.error(result.error || 'An error occurred')
      }
    } catch (err) {
      showToast.error(err.message || 'Failed to connect to server')
      console.error('Auth error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleMode = () => {
    setIsLogin(!isLogin)
    reset()
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
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="John Doe"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      isFieldTouched('name') && getFieldError('name')
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-gray/30 focus:ring-slate-gray'
                    }`}
                  />
                </div>
                {isFieldTouched('name') && getFieldError('name') && (
                  <motion.p
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <AlertCircle size={14} /> {getFieldError('name')}
                  </motion.p>
                )}
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
                onBlur={handleBlur}
                placeholder="your@email.com"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  isFieldTouched('email') && getFieldError('email')
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-gray/30 focus:ring-slate-gray'
                }`}
              />
              {isFieldTouched('email') && getFieldError('email') && (
                <motion.p
                  className="text-red-500 text-sm mt-1 flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <AlertCircle size={14} /> {getFieldError('email')}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="At least 6 characters"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition pr-10 ${
                    isFieldTouched('password') && getFieldError('password')
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-gray/30 focus:ring-slate-gray'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-gray/60 hover:text-slate-gray"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {isFieldTouched('password') && getFieldError('password') && (
                <motion.p
                  className="text-red-500 text-sm mt-1 flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <AlertCircle size={14} /> {getFieldError('password')}
                </motion.p>
              )}
            </div>

            {/* Confirm Password Field (Register Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-gray mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Repeat your password"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition pr-10 ${
                      isFieldTouched('passwordConfirm') && getFieldError('passwordConfirm')
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-gray/30 focus:ring-slate-gray'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-gray/60 hover:text-slate-gray"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {isFieldTouched('passwordConfirm') && getFieldError('passwordConfirm') && (
                  <motion.p
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <AlertCircle size={14} /> {getFieldError('passwordConfirm')}
                  </motion.p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-gray text-warm-cream font-semibold py-2 rounded-lg hover:bg-soft-black transition disabled:bg-slate-gray/50 mt-6"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Loading...' : isLogin ? 'Login' : 'Create Account'}
            </motion.button>
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
              <motion.button
                type="button"
                onClick={handleToggleMode}
                className="ml-2 text-slate-gray font-semibold hover:text-soft-black transition"
                whileHover={{ scale: 1.05 }}
              >
                {isLogin ? 'Register' : 'Login'}
              </motion.button>
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
