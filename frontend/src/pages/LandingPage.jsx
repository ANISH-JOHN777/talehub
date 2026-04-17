import { useEffect, useState } from 'react'
import { BookOpen, Play, Sparkles } from 'lucide-react'

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const books = [
    {
      id: 1,
      title: 'Atomic Habits',
      author: 'James Clear',
      cover: '📗',
      category: 'Self-Growth',
      rating: 4.8,
    },
    {
      id: 2,
      title: 'The Lean Startup',
      author: 'Eric Ries',
      cover: '📕',
      category: 'Business',
      rating: 4.7,
    },
    {
      id: 3,
      title: 'Deep Work',
      author: 'Cal Newport',
      cover: '📘',
      category: 'Productivity',
      rating: 4.9,
    },
    {
      id: 4,
      title: 'Thinking Fast & Slow',
      author: 'Daniel Kahneman',
      cover: '📙',
      category: 'Psychology',
      rating: 4.8,
    },
  ]

  const pricingTiers = [
    {
      name: 'Basic',
      price: '$9',
      billing: '/month',
      description: 'Perfect for getting started',
      features: [
        'Unlimited book access',
        '5 live sessions per month',
        'Community chat access',
        'PDF summaries',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$29',
      billing: '/month',
      description: 'Best for active learners',
      features: [
        'Everything in Basic',
        '20 live sessions per month',
        'Priority Q&A access',
        'Expert mentorship',
        '1-on-1 coaching (monthly)',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Premium',
      price: '$99',
      billing: '/month',
      description: 'For serious learners',
      features: [
        'Everything in Pro',
        'Unlimited live sessions',
        'Exclusive workshops',
        'Advanced analytics',
        'Custom learning path',
        'Priority support',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ]

  const steps = [
    {
      number: '01',
      title: 'Choose Your Book',
      description: 'Browse our curated collection of bestsellers and hidden gems across all genres.',
      icon: 'Book',
    },
    {
      number: '02',
      title: 'Join Live Session',
      description: 'Connect with experts and fellow learners for interactive discussions.',
      icon: 'Play',
    },
    {
      number: '03',
      title: 'Apply in Real Life',
      description: 'Take action with practical lessons and join our community of doers.',
      icon: 'Sparkles',
    },
  ]

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
            <BookOpen size={28} /> LearnTales
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition">
              How it works
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">
              Pricing
            </a>
            <a href="#books" className="text-gray-600 hover:text-gray-900 transition">
              Books
            </a>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-600 text-sm font-medium">
              🎉 Join 50,000+ active learners
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">Don't just read books.</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Experience them.
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Learn from world-class experts through live interactive sessions. Transform your reading into actionable knowledge.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105">
              Start Learning for Free
            </button>
            <button className="border-2 border-gray-300 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:border-gray-400 transition">
              Watch Demo
            </button>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
            <div>
              <div className="text-3xl font-bold text-indigo-600">500+</div>
              <div className="text-sm text-gray-600">Books Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">2M+</div>
              <div className="text-sm text-gray-600">Minutes Learned</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">4.9★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Three simple steps to transformation
            </h2>
            <p className="text-xl text-gray-600">
              From reading to learning to doing — everything in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-24 left-[60%] w-[calc(100%-60px)] h-1 bg-gradient-to-r from-indigo-200 to-transparent"></div>
                )}

                <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-indigo-300 transition relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-5xl">{step.icon}</div>
                    <div className="text-6xl font-bold text-gray-200">{step.number}</div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section id="books" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured this month
            </h2>
            <p className="text-xl text-gray-600">
              Curated bestsellers handpicked by our expert facilitators
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="group cursor-pointer"
              >
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 mb-4 flex items-center justify-center h-64 relative overflow-hidden transition">
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-blue-100 opacity-0 group-hover:opacity-100 transition"></div>
                  
                  <div className="text-8xl group-hover:scale-110 transition transform relative z-10">
                    {book.cover}
                  </div>
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-indigo-600 transition">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{book.author}</p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="font-semibold text-gray-900">{book.rating}</span>
                  </div>
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                    {book.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="text-indigo-600 font-semibold hover:text-indigo-700 transition inline-flex items-center gap-2">
              Explore all books →
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect plan for your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`rounded-2xl transition transform ${
                  tier.highlighted
                    ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white scale-105 shadow-2xl'
                    : 'bg-white border border-gray-200 text-gray-900 hover:border-gray-300'
                }`}
              >
                <div className="p-8">
                  {tier.highlighted && (
                    <div className="inline-block bg-yellow-300 text-gray-900 px-3 py-1 rounded-full text-xs font-bold mb-4">
                      Most Popular
                    </div>
                  )}

                  <h3 className={`text-2xl font-bold mb-2`}>{tier.name}</h3>
                  <p className={`text-sm mb-6 ${tier.highlighted ? 'text-indigo-100' : 'text-gray-600'}`}>
                    {tier.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-5xl font-bold">{tier.price}</span>
                    <span className={`ml-2 ${tier.highlighted ? 'text-indigo-100' : 'text-gray-600'}`}>
                      {tier.billing}
                    </span>
                  </div>

                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition mb-8 ${
                      tier.highlighted
                        ? 'bg-white text-indigo-600 hover:bg-gray-50'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {tier.cta}
                  </button>

                  <div className={`space-y-4 border-t ${tier.highlighted ? 'border-indigo-400' : 'border-gray-200'} pt-8`}>
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <span className="text-xl">✓</span>
                        <span className={`text-sm ${tier.highlighted ? 'text-indigo-100' : 'text-gray-600'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className={`text-gray-600 mb-4`}>
              🎁 First 7 days free. No credit card required.
            </p>
            <p className={`text-sm text-gray-500`}>
              All plans include 24/7 community support. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 relative overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to transform your reading?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of learners who are already experiencing the power of LearnTales.
          </p>
          <button className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition transform hover:scale-105">
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="text-white font-bold text-lg mb-4 flex items-center gap-2"><BookOpen size={24} /> LearnTales</div>
              <p className="text-sm">Transform your learning through live book experiences.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Books</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 LearnTales. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
