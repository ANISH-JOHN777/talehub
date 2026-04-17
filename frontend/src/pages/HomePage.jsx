import React, { useState, Suspense, lazy } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { BookOpen, Users, Trophy, Zap, BarChart3, MessageSquare, Award, ArrowRight, CheckCircle, Star, Book, Target, Mic, Medal, UserCircle } from 'lucide-react'

const getIconComponent = (iconName) => {
  const icons = {
    Book: <Book size={40} className="text-slate-gray" />,
    Target: <Target size={40} className="text-slate-gray" />,
    Mic: <Mic size={40} className="text-slate-gray" />,
    Medal: <Medal size={40} className="text-slate-gray" />,
  }
  return icons[iconName] || <BookOpen size={40} className="text-slate-gray" />
}

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
}

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager',
    text: 'TaleHub transformed how I learn. Instead of struggling with dense books, I now understand key concepts in just a few live sessions!',
    avatarIcon: <UserCircle size={48} className="text-slate-gray" />,
    rating: 5,
  },
  {
    name: 'James Miller',
    role: 'Entrepreneur',
    text: 'The interactive format with instructors is incredible. I got more value from 3 TaleHub sessions than from reading 5 books.',
    avatarIcon: <UserCircle size={48} className="text-slate-gray" />,
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Student',
    text: 'Finally, financial concepts make sense! The step-by-step explanations and Q&A sessions are game changers.',
    avatarIcon: <UserCircle size={48} className="text-slate-gray" />,
    rating: 5,
  },
]

const features = [
  {
    icon: <Users size={32} className="text-slate-gray" />,
    title: 'Expert Narrators',
    description: 'Learn from bestselling authors and industry experts who bring books to life in an engaging way.',
  },
  {
    icon: <Zap size={32} className="text-slate-gray" />,
    title: 'Live & Recorded',
    description: 'Join live sessions or catch replays anytime. Every completed session is saved so you never miss out.',
  },
  {
    icon: <Trophy size={32} className="text-slate-gray" />,
    title: 'Affordable Access',
    description: 'Get world-famous books at a fraction of the cost. Easy to join, easier to enjoy.',
  },
]

const howItWorks = [
  {
    number: '1',
    title: 'Choose Your Book',
    description: 'Browse world-famous books across business, psychology, history, and more.',
    icon: 'Book',
  },
  {
    number: '2',
    title: 'Select Your Plan',
    description: 'Pick Basic for live only, Pro for recordings, or Premium for 1-on-1 coaching.',
    icon: 'Target',
  },
  {
    number: '3',
    title: 'Join a Session',
    description: 'Just join, listen, and learn alongside peers globally in expert-led sessions.',
    icon: 'Mic',
  },
  {
    number: '4',
    title: 'Catch Up Anytime',
    description: 'Missed a session? All replays are saved and available whenever you need them.',
    icon: 'Medal',
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [email, setEmail] = useState('')

  const handleGetStarted = () => {
    if (user) {
      navigate('/programs')
    } else {
      navigate('/auth')
    }
  }

  const handleBrowse = () => {
    navigate('/programs')
  }

  return (
    <div className="min-h-screen bg-warm-cream">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-warm-cream/95 border-b border-slate-gray/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <BookOpen size={28} className="text-slate-gray" strokeWidth={1.5} />
              <span className="text-2xl font-bold text-soft-black">TaleHub</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/about" className="text-slate-gray hover:text-soft-black transition font-medium">
                About
              </Link>
              <a href="#features" className="text-slate-gray hover:text-soft-black transition font-medium">
                Features
              </a>
              <a href="#howitworks" className="text-slate-gray hover:text-soft-black transition font-medium">
                How It Works
              </a>
              <a href="#testimonials" className="text-slate-gray hover:text-soft-black transition font-medium">
                Testimonials
              </a>
              <button
                onClick={handleGetStarted}
                className="bg-slate-gray hover:bg-soft-black text-warm-cream px-6 py-2 rounded-lg transition font-medium"
              >
                {user ? 'Dashboard' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-6xl md:text-7xl font-bold text-soft-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Less Reading. More Knowing.
            <span className="block text-slate-gray">With Expert-Led Sessions</span>
          </motion.h1>

          <motion.p
            className="text-xl text-slate-gray mb-8 max-w-2xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join daily live sessions where expert narrators walk you through famous books in a fun, easy, and fully informative way. Just join, listen, and learn.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              onClick={handleGetStarted}
              className="bg-slate-gray hover:bg-soft-black text-warm-cream px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105"
            >
              Join Now & Learn
            </button>
            <button
              onClick={handleBrowse}
              className="bg-transparent border-2 border-slate-gray text-slate-gray hover:bg-slate-gray/10 px-8 py-3 rounded-lg font-semibold transition"
            >
              Explore Books
            </button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            className="grid grid-cols-3 gap-4 mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="border-l-2 border-slate-gray pl-4">
              <div className="text-3xl font-bold text-soft-black">50K+</div>
              <div className="text-slate-gray">Active Learners</div>
            </div>
            <div className="border-l-2 border-slate-gray pl-4">
              <div className="text-3xl font-bold text-soft-black">100+</div>
              <div className="text-slate-gray">Expert Programs</div>
            </div>
            <div className="border-l-2 border-slate-gray pl-4">
              <div className="text-3xl font-bold text-soft-black">4.9★</div>
              <div className="text-slate-gray">Avg. Rating</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-5xl font-bold text-soft-black mb-4">Why TaleHub Works</h2>
            <p className="text-xl text-slate-gray max-w-2xl mx-auto">For anyone who loves learning but hates reading—no prior knowledge, no complicated steps, just great books explained the way you deserve.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="bg-warm-cream p-8 rounded-xl border border-slate-gray/10 hover:shadow-lg transition"
                custom={i}
                variants={featureVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-soft-black mb-2">{feature.title}</h3>
                <p className="text-slate-gray">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="howitworks" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-5xl font-bold text-soft-black mb-4">How It Works</h2>
            <p className="text-xl text-slate-gray">Just join, listen, and learn in 4 simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                className="relative"
                custom={i}
                variants={featureVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="text-center">
                  <div className="mb-4 flex justify-center">{getIconComponent(step.icon)}</div>
                  <div className="text-4xl font-bold text-slate-gray mb-2">{step.number}</div>
                  <h3 className="text-xl font-bold text-soft-black mb-2">{step.title}</h3>
                  <p className="text-slate-gray">{step.description}</p>
                </div>
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-20 -right-4 text-slate-gray/30 text-3xl">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-5xl font-bold text-soft-black mb-4">Loved by Learners</h2>
            <p className="text-xl text-slate-gray">Join thousands who've transformed their learning</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                className="bg-warm-cream p-8 rounded-xl border border-slate-gray/10 hover:shadow-lg transition"
                custom={i}
                variants={featureVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} size={20} className="fill-slate-gray text-slate-gray" />
                  ))}
                </div>
                <p className="text-slate-gray mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="flex justify-center">{testimonial.avatarIcon}</div>
                  <div>
                    <p className="font-bold text-soft-black">{testimonial.name}</p>
                    <p className="text-sm text-slate-gray">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-gray text-warm-cream">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold mb-6">Your New Favorite Way to Experience Books</h2>
          <p className="text-xl mb-8 opacity-90">Join 50,000+ learners who've discovered that learning doesn't have to mean reading. Easy to join. Easier to enjoy.</p>
          <button
            onClick={handleGetStarted}
            className="bg-warm-cream text-slate-gray hover:bg-white px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2 mx-auto"
          >
            Get Started Free <ArrowRight size={20} />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-soft-black text-warm-cream py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">TaleHub</h3>
            <p className="text-warm-cream/70">Learn any book faster with expert-led live sessions & lifetime access.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-warm-cream/70">
              <li><Link to="/programs" className="hover:text-warm-cream">Programs</Link></li>
              <li><Link to="/pricing" className="hover:text-warm-cream">Pricing</Link></li>
              <li><Link to="/instructors" className="hover:text-warm-cream">Instructors</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-warm-cream/70">
              <li><Link to="/about" className="hover:text-warm-cream">About</Link></li>
              <li><a href="#" className="hover:text-warm-cream">Blog</a></li>
              <li><Link to="/contact" className="hover:text-warm-cream">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-warm-cream/70">
              <li><a href="#" className="hover:text-warm-cream">Privacy</a></li>
              <li><a href="#" className="hover:text-warm-cream">Terms</a></li>
              <li><a href="#" className="hover:text-warm-cream">Support</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-warm-cream/10 pt-8 text-center text-warm-cream/70">
          <p>&copy; 2026 TaleHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
