import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, BookOpen, MessageSquare, User, Settings } from 'lucide-react'

export default function MobileBottomNav() {
  const location = useLocation()

  const navItems = [
    { icon: Home, label: 'Home', href: '/', id: 'home' },
    { icon: BookOpen, label: 'Browse', href: '/programs', id: 'browse' },
    { icon: MessageSquare, label: 'Messages', href: '/messages', id: 'messages' },
    { icon: User, label: 'Profile', href: '/dashboard', id: 'profile' },
    { icon: Settings, label: 'Settings', href: '/settings', id: 'settings' },
  ]

  const isActive = (href) => location.pathname === href

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 lg:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.id}
              to={item.href}
              className="flex-1 flex flex-col items-center py-3 px-2 text-xs font-medium"
            >
              <motion.div
                className={`p-2 rounded-lg transition ${active ? 'bg-slate-gray/20 text-slate-gray' : 'text-gray-400'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={24} />
              </motion.div>
              <span className={active ? 'text-slate-gray mt-1' : 'text-gray-400 mt-1'}>{item.label}</span>
              {active && (
                <motion.div
                  layoutId="activeIndicator"
                  className="h-1 w-full bg-slate-gray rounded-full mt-1"
                  transition={{ type: 'spring', damping: 20 }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
