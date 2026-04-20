import React from 'react'
import { motion } from 'framer-motion'

// Image optimization utility for mobile
export const createResponsiveImageSrcSet = (baseUrl, filename) => {
  return {
    src: `${baseUrl}/${filename}@2x.webp`,
    srcSet: `${baseUrl}/${filename}@1x.webp 320w, ${baseUrl}/${filename}@2x.webp 640w, ${baseUrl}/${filename}@3x.webp 1024w`,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  }
}

// Mobile-optimized image loading with blur effect
export function LazyImage({ src, alt, placeholder = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E', ...props }) {
  const [isLoaded, setIsLoaded] = React.useState(false)

  return (
    <div className="relative overflow-hidden">
      {/* Placeholder blur */}
      <motion.img
        src={placeholder}
        alt={alt}
        className="absolute inset-0 w-full h-full blur-lg"
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      />
      {/* Actual image */}
      <motion.img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        {...props}
      />
    </div>
  )
}

// Device detection hook
export function useDeviceSize() {
  const [size, setSize] = React.useState({
    isMobile: typeof window !== 'undefined' && window.innerWidth < 768,
    isTablet: typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: typeof window !== 'undefined' && window.innerWidth >= 1024,
  })

  React.useEffect(() => {
    const handleResize = () => {
      setSize({
        isMobile: window.innerWidth < 768,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
        isDesktop: window.innerWidth >= 1024,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

// Touch-friendly menu component
export function TouchMenu({ items, onSelect }) {
  return (
    <div className="flex lg:flex gap-2 sm:gap-4 overflow-x-auto pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
      {items.map((item) => (
        <motion.button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-2 rounded-lg font-semibold whitespace-nowrap transition min-h-[44px] flex items-center"
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.05 }}
        >
          {item.label}
        </motion.button>
      ))}
    </div>
  )
}

// Swipe-enabled carousel for mobile
export function MobileCarousel({ children, onSwipe }) {
  const [touchStart, setTouchStart] = React.useState(0)
  const [touchEnd, setTouchEnd] = React.useState(0)

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientX)
    handleSwipe()
  }

  const handleSwipe = () => {
    if (touchStart - touchEnd > 50) {
      onSwipe?.('next')
    }
    if (touchEnd - touchStart > 50) {
      onSwipe?.('prev')
    }
  }

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {children}
    </div>
  )
}

// Bottom sheet modal for mobile
export function BottomSheetModal({ isOpen, onClose, title, children }) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: isOpen ? 0 : '100%' }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed bottom-0 left-0 right-0 bg-warm-cream rounded-t-3xl z-40 max-h-[80vh] overflow-y-auto lg:hidden"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 mb-4">
          <div className="w-12 h-1 bg-slate-gray/30 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="px-4 pb-8">
          {title && <h2 className="text-2xl font-bold text-soft-black mb-4">{title}</h2>}
          {children}
        </div>
      </motion.div>
    </>
  )
}

// Vertical stack layout for mobile
export function MobileStack({ children, gap = 4, className = '' }) {
  return <div className={`flex flex-col gap-${gap} lg:flex-row ${className}`}>{children}</div>
}

export default {
  createResponsiveImageSrcSet,
  LazyImage,
  useDeviceSize,
  TouchMenu,
  MobileCarousel,
  BottomSheetModal,
  MobileStack,
}
