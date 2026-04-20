import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X, Zap, Users, BookOpen, Award, Download, MessageSquare } from 'lucide-react'

const featuresList = [
  { name: 'Access to Live Sessions', basic: true, pro: true, premium: true },
  { name: 'Session Recordings', basic: false, pro: true, premium: true },
  { name: 'Course Materials', basic: false, pro: true, premium: true },
  { name: 'Community Support', basic: true, pro: true, premium: true },
  { name: '1-on-1 Coaching', basic: false, pro: false, premium: true },
  { name: 'Priority Support', basic: false, pro: true, premium: true },
  { name: 'Certificates', basic: false, pro: true, premium: true },
  { name: 'Exclusive Content', basic: false, pro: false, premium: true },
]

export default function EnhancedPricingPage() {
  const navigate = useNavigate()

  const pricingTiers = [
    {
      name: 'Basic',
      price: 199,
      period: 'per month',
      description: 'Perfect for getting started',
      color: 'from-blue-500 to-blue-600',
      icon: BookOpen,
      cta: 'Start Learning',
      popular: false,
    },
    {
      name: 'Pro',
      price: 399,
      period: 'per month',
      description: 'Most popular choice',
      color: 'from-purple-500 to-purple-600',
      icon: Zap,
      cta: 'Go Pro',
      popular: true,
    },
    {
      name: 'Premium',
      price: 699,
      period: 'per month',
      description: 'Complete learning experience',
      color: 'from-amber-500 to-amber-600',
      icon: Award,
      cta: 'Get Premium',
      popular: false,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-cream via-white to-warm-cream pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-soft-black mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-gray max-w-2xl mx-auto">
            Choose the perfect plan for your learning journey. All plans include access to expert-led sessions.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {pricingTiers.map((tier, index) => {
            const Icon = tier.icon
            return (
              <motion.div
                key={index}
                className={`relative rounded-3xl overflow-hidden transition-all duration-300 ${
                  tier.popular ? 'ring-2 ring-slate-gray' : ''
                }`}
                variants={itemVariants}
                whileHover={{ y: tier.popular ? -16 : -8, scale: 1.02 }}
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-10 rounded-3xl`}
                />

                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-slate-gray to-soft-black text-warm-cream px-6 py-2 rounded-bl-2xl font-semibold text-sm">
                    Most Popular ⭐
                  </div>
                )}

                {/* Card Content */}
                <div className="relative bg-white p-8 rounded-3xl border border-gray-100 h-full flex flex-col">
                  {/* Header */}
                  <div className="mb-8">
                    <div className={`inline-block p-4 rounded-2xl bg-gradient-to-br ${tier.color} mb-4`}>
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-soft-black mb-2">{tier.name}</h3>
                    <p className="text-slate-gray">{tier.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-soft-black">${tier.price}</span>
                      <span className="text-slate-gray">/{tier.period}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    className={`w-full py-4 rounded-xl font-semibold mb-8 transition-all ${
                      tier.popular
                        ? `bg-gradient-to-r ${tier.color} text-white hover:shadow-lg`
                        : 'bg-gray-100 text-soft-black hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/enrollment-customization')}
                  >
                    {tier.cta}
                  </motion.button>

                  {/* Features List */}
                  <div className="space-y-4 flex-1">
                    {featuresList.map((feature, fIndex) => {
                      const available =
                        (tier.name === 'Basic' && feature.basic) ||
                        (tier.name === 'Pro' && feature.pro) ||
                        (tier.name === 'Premium' && feature.premium)

                      return (
                        <motion.div
                          key={fIndex}
                          className="flex items-center gap-3"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: fIndex * 0.05 }}
                        >
                          {available ? (
                            <Check size={20} className="text-green-500 flex-shrink-0" />
                          ) : (
                            <X size={20} className="text-gray-300 flex-shrink-0" />
                          )}
                          <span className={available ? 'text-gray-700' : 'text-gray-400'}>
                            {feature.name}
                          </span>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-soft-black mb-8">Detailed Comparison</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-soft-black">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-soft-black">Basic</th>
                    <th className="text-center py-4 px-4 font-semibold text-soft-black">Pro</th>
                    <th className="text-center py-4 px-4 font-semibold text-soft-black">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Monthly Price', basic: '$199', pro: '$399', premium: '$699' },
                    { feature: 'Live Sessions Access', basic: '✓', pro: '✓', premium: '✓' },
                    { feature: 'Recorded Sessions', basic: '—', pro: '✓', premium: '✓' },
                    { feature: 'Downloadable Materials', basic: '—', pro: '✓', premium: '✓' },
                    { feature: 'Community Support', basic: '✓', pro: '✓', premium: '✓' },
                    { feature: 'Priority Support', basic: '—', pro: '✓', premium: '✓' },
                    { feature: '1-on-1 Coaching', basic: '—', pro: '—', premium: '✓ (2 sessions/month)' },
                    { feature: 'Certificates', basic: '—', pro: '✓', premium: '✓' },
                    { feature: 'Exclusive Content', basic: '—', pro: '—', premium: '✓' },
                  ].map((row, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                    >
                      <td className="py-4 px-4 font-semibold text-soft-black">{row.feature}</td>
                      <td className="text-center py-4 px-4 text-slate-gray">{row.basic}</td>
                      <td className="text-center py-4 px-4 text-slate-gray">{row.pro}</td>
                      <td className="text-center py-4 px-4 text-slate-gray">{row.premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-soft-black mb-8 text-center">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              { q: 'Can I switch plans anytime?', a: 'Yes! You can upgrade or downgrade your plan at any time.' },
              { q: 'Is there a free trial?', a: 'Try our Basic plan risk-free for 7 days. No credit card required!' },
              { q: 'What if I cancel?', a: 'Cancel anytime with no penalties. Your access continues until the end of your billing period.' },
              { q: 'Do you offer discounts?', a: 'Yes! Annual plans come with 20% off, and we offer educational discounts.' },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="font-bold text-soft-black mb-2 flex items-center gap-2">
                  <MessageSquare size={20} className="text-slate-gray" />
                  {faq.q}
                </h3>
                <p className="text-slate-gray">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16 bg-gradient-to-r from-slate-gray to-soft-black rounded-3xl p-12 text-warm-cream"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-lg opacity-90 mb-8">Join thousands of learners transforming their education with TaleHub.</p>
          <button
            onClick={() => navigate('/programs')}
            className="bg-warm-cream text-slate-gray hover:bg-white px-8 py-4 rounded-xl font-semibold transition transform hover:scale-105"
          >
            Browse Programs Now
          </button>
        </motion.div>
      </div>
    </div>
  )
}
