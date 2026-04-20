import React from 'react'

// Responsive Container - adds padding and max-width based on screen size
export function ResponsiveContainer({ children, className = '' }) {
  return (
    <div className={`px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}>
      {children}
    </div>
  )
}

// Touch-friendly Button - ensures minimum touch target size
export function TouchButton({ children, className = '', ...props }) {
  return (
    <button
      className={`min-h-[44px] min-w-[44px] py-3 px-4 sm:py-2 sm:px-3 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Responsive Grid - adapts columns based on screen size
export function ResponsiveGrid({ children, cols = { xs: 1, sm: 2, lg: 3 }, gap = 4, className = '' }) {
  const colClasses = `grid gap-${gap} grid-cols-${cols.xs} sm:grid-cols-${cols.sm} lg:grid-cols-${cols.lg}`
  return <div className={`${colClasses} ${className}`}>{children}</div>
}

// Responsive Image - optimizes image loading on mobile
export function ResponsiveImage({ src, alt, sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw', className = '', ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      className={`w-full h-auto object-cover ${className}`}
      loading="lazy"
      {...props}
    />
  )
}

// Mobile-only component
export function MobileOnly({ children, className = '' }) {
  return <div className={`lg:hidden ${className}`}>{children}</div>
}

// Desktop-only component
export function DesktopOnly({ children, className = '' }) {
  return <div className={`hidden lg:block ${className}`}>{children}</div>
}

// Responsive text sizes
export function ResponsiveText({ children, size = 'base', className = '' }) {
  const sizeClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
  }
  return <div className={`${sizeClasses[size]} ${className}`}>{children}</div>
}

// Sticky mobile header - stays fixed on mobile
export function StickyMobileHeader({ children, className = '' }) {
  return (
    <div className={`fixed top-16 left-0 right-0 bg-warm-cream shadow-sm z-30 lg:relative lg:top-auto lg:shadow-none ${className}`}>
      {children}
    </div>
  )
}

// Touch-friendly spacing (taps need 44x44px minimum)
export const touchSafeSpacing = {
  button: 'py-3 px-4 sm:py-2 sm:px-3',
  link: 'py-2 px-3 sm:py-1 sm:px-2',
  input: 'py-3 px-4 sm:py-2 sm:px-3',
}

export default {
  ResponsiveContainer,
  TouchButton,
  ResponsiveGrid,
  ResponsiveImage,
  MobileOnly,
  DesktopOnly,
  ResponsiveText,
  StickyMobileHeader,
  touchSafeSpacing,
}
