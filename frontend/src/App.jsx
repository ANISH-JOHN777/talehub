import { Routes, Route, Link } from 'react-router-dom'
import { BookOpen, LogOut } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import ProgramsPage from './pages/ProgramsPage'
import ProgramDetailPage from './pages/ProgramDetailPage'
import EnrollmentCustomizationPage from './pages/EnrollmentCustomizationPage'
import PaymentPage from './pages/PaymentPage'
import DashboardNew from './pages/DashboardNew'
import AboutPage from './pages/AboutPage'
import PricingPage from './pages/PricingPage'
import SessionPage from './pages/SessionPage'
import ContactPage from './pages/ContactPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminAnalyticsEnhanced from './pages/AdminAnalyticsEnhanced'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import PageScrollReset from './components/PageScrollReset'
import MobileNavigationMenu from './components/MobileNavigationMenu'
import MobileBottomNav from './components/MobileBottomNav'
import { useAuth } from './context/AuthContext'
import './App.css'

function App() {
  const { user, logout, login } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const handleLogin = () => {
    login()
  }

  return (
    <div className="min-h-screen bg-warm-cream">
      <Toaster position="top-right" />
      
      {/* Navigation Bar */}
      <nav className="fixed w-full top-0 z-50 bg-warm-cream/95 border-b border-slate-gray/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <BookOpen size={28} className="text-slate-gray" strokeWidth={1.5} />
              <span className="text-2xl font-bold text-soft-black">TaleHub</span>
            </Link>

            <ul className="hidden md:flex items-center gap-8">
              <li>
                <Link to="/" className="text-soft-black hover:text-slate-gray font-medium transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-soft-black hover:text-slate-gray font-medium transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-soft-black hover:text-slate-gray font-medium transition">
                  Programs
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-soft-black hover:text-slate-gray font-medium transition">
                  Pricing
                </Link>
              </li>
              {user && (
                <>
                  <li>
                    <Link to="/dashboard" className="text-soft-black hover:text-slate-gray font-medium transition">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-soft-black hover:text-slate-gray font-medium transition flex items-center gap-2"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </li>
                </>
              )}
              {!user && (
                <li>
                  <button
                    onClick={handleLogin}
                    className="bg-slate-gray hover:bg-soft-black text-warm-cream px-6 py-2 rounded-lg transition font-medium"
                  >
                    Sign In
                  </button>
                </li>
              )}
            </ul>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-4">
              {user && (
                <button onClick={handleLogout} className="text-slate-gray hover:text-soft-black">
                  <LogOut size={20} />
                </button>
              )}
              {!user && (
                <button 
                  onClick={handleLogin}
                  className="bg-slate-gray text-warm-cream px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Routes */}
      <main className="pb-20 lg:pb-0">
        <PageScrollReset />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/programs/:id" element={<ProgramDetailPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/session/:sessionId" element={<SessionPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Enrollment Flow Routes */}
          <Route path="/enroll/:id" element={<ProtectedRoute><EnrollmentCustomizationPage /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardNew /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
          <Route path="/admin/advanced-analytics" element={<ProtectedRoute><AdminAnalyticsEnhanced /></ProtectedRoute>} />
        </Routes>
      </main>

      {/* Mobile Navigation Components */}
      <MobileNavigationMenu />
      <MobileBottomNav />

      {/* Scroll to Top Button - Appears on all pages */}
      <ScrollToTop />
    </div>
  )
}

export default App
