import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageScrollReset() {
  const location = useLocation()

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0)
  }, [location.pathname])

  return null
}
