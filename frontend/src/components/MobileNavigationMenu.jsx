import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, BookOpen, Users, Settings, LogOut, User, ShoppingCart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { showToast } from '../utils/toast'

export default function MobileNavigationMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { label: 'Home', icon: Home, href: '/', id: 'home' },
    { label: 'Programs', icon: BookOpen, href: '/programs', id: 'programs' },
    { label: 'Books', icon: BookOpen, href: '/books', id: 'books' },
    { label: 'Sessions', icon: Users, href: '/sessions', id: 'sessions' },
  ]

  const userMenuItems = [
    { label: 'Dashboard', icon: User, href: '/dashboard', id: 'dashboard' },
    { label: 'Wishlist', icon: ShoppingCart, href: '/wishlist', id: 'wishlist' },
    { label: 'Settings', icon: Settings, href: '/settings', id: 'settings' },
  ]

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    showToast.success('Logged out successfully')
    navigate('/')
  }

  const handleNavigation = (href) => {
    navigate(href)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Hamburger Button - Fixed Position */}
      <div className="fixed top-24 right-4 z-40 lg:hidden">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-slate-gray text-warm-cream"
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed right-0 top-0 h-screen w-80 bg-warm-cream shadow-xl z-40 lg:hidden overflow-y-auto"
            >
              <div className="pt-32 px-6 pb-6">
                {/* User Info */}
                {user && (
                  <div className="mb-8 pb-6 border-b border-gray-200">
                    <p className="font-semibold text-soft-black">{user.name}</p>
                    <p className="text-sm text-slate-gray">{user.email}</p>
                  </div>
                )}

                {/* Main Menu */}
                <div className="space-y-2 mb-8">
                  <p className="text-xs font-bold text-slate-gray uppercase mb-4">Menu</p>
                  {menuItems.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigation(item.href)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        location.pathname === item.href
                          ? 'bg-slate-gray/20 text-soft-black font-semibold'
                          : 'text-slate-gray hover:bg-gray-100'
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* User Menu */}
                {user && (
                  <div className="space-y-2 mb-8 pb-8 border-b border-gray-200">
                    <p className="text-xs font-bold text-slate-gray uppercase mb-4">Account</p>
                    {userMenuItems.map((item) => (
                      <motion.button
                        key={item.id}
                        onClick={() => handleNavigation(item.href)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-gray hover:bg-gray-100 transition"
                        whileHover={{ x: 4 }}
                      >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Auth Buttons */}
                {user ? (
                  <motion.button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-lg font-semibold"
                    whileHover={{ scale: 1.02 }}
                  >
                    <LogOut size={20} />
                    Logout
                  </motion.button>
                ) : (
                  <div className="space-y-3">
                    <motion.button
                      onClick={() => handleNavigation('/auth')}
                      className="w-full bg-slate-gray text-warm-cream py-3 rounded-lg font-semibold"
                      whileHover={{ scale: 1.02 }}
                    >
                      Login
                    </motion.button>
                    <motion.button
                      onClick={() => handleNavigation('/auth?mode=signup')}
                      className="w-full border-2 border-slate-gray text-slate-gray py-3 rounded-lg font-semibold"
                      whileHover={{ scale: 1.02 }}
                    >
                      Sign Up
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
