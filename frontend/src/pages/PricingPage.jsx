import React from 'react'
import { motion } from 'framer-motion'
import { Check, X, ArrowRight, Zap, Book } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PricingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const getIconComponent = (iconName) => {
    const icons = {
      Book: <Book size={40} className="text-slate-gray" />,
      Zap: <Zap size={40} className="text-slate-gray" />,
    }
    return icons[iconName] || <Zap size={40} className="text-slate-gray" />
  }

  const tiers = [
    {
      name: 'Basic',
      price: 199,
      period: 'per program',
      description: 'Perfect for getting started',
      icon: 'Book',
      highlighted: false,
      includes: [
        'Live sessions',
        'Q&A with instructors',
        'Community access',
        'Session slides',
        '5-day access after completion',
      ],
      notIncludes: [
        'Lifetime recordings',
        'Downloadable resources',
        'Certificate',
        '1-on-1 coaching',
        'Priority support',
      ],
      cta: 'Browse Programs',
    },
    {
      name: 'Pro',
      price: 399,
      period: 'per program',
      description: 'Most popular choice',
      icon: 'Zap',
      highlighted: true,
      includes: [
        'Live sessions',
        'Q&A with instructors',
        'Community access',
        'Lifetime recordings',
        'Downloadable resources',
        'Workbooks & templates',
        'Certificate of completion',
        'Email support',
      ],
      notIncludes: [
        '1-on-1 coaching',
        'Priority support',
        'Advanced content',
      ],
      cta: 'Choose Pro',
    },
    {
      name: 'Premium',
      price: 699,
      period: 'per program',
      description: 'Get everything + coaching',
      icon: '👑',
      highlighted: false,
      includes: [
        'Everything in Pro',
        '2 personal coaching calls',
        'Custom learning plan',
        'Advanced content',
        '1-on-1 doubt sessions',
        'Priority email support',
        'Exclusive community',
        'Career guidance',
      ],
      notIncludes: [],
      cta: 'Upgrade to Premium',
    },
  ]

  const faq = [
    {
      q: 'Can I switch tiers mid-program?',
      a: 'Yes! You can upgrade anytime. We\'ll credit your current payment toward the upgrade.',
    },
    {
      q: 'Is there a refund policy?',
      a: '100% money-back guarantee for 30 days. No questions asked.',
    },
    {
      q: 'Do I get lifetime access?',
      a: 'Pro & Premium tiers include lifetime access to recordings. Basic tier has 5-day access.',
    },
    {
      q: 'Can I enroll in multiple programs?',
      a: 'Absolutely! You can enroll in as many programs as you want with different tiers.',
    },
    {
      q: 'Does the certificate have value?',
      a: 'Yes! Our certificates are recognized and can be added to LinkedIn & resumes.',
    },
    {
      q: 'What if I\'m not satisfied?',
      a: 'Your satisfaction is guaranteed. Get a full refund within 30 days if unhappy.',
    },
  ]

  const handleChooseTier = (tier) => {
    if (user) {
      navigate('/programs')
    } else {
      navigate('/auth')
    }
  }

  return (
    <div className="min-h-screen bg-warm-cream pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-6xl font-bold text-soft-black mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-gray max-w-2xl mx-auto">
            Choose the plan that fits your learning style. All tiers include access to our expert instructors.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              className={`relative rounded-2xl overflow-hidden transition transform hover:scale-105 ${
                tier.highlighted
                  ? 'md:scale-105 border-2 border-slate-gray shadow-2xl'
                  : 'border-2 border-slate-gray/20 shadow-lg'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {tier.highlighted && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-slate-gray to-slate-gray/80 text-warm-cream py-2 text-center font-bold text-sm">
                  MOST POPULAR
                </div>
              )}

              <div className={`p-8 ${tier.highlighted ? 'bg-gradient-to-br from-slate-gray to-slate-gray/90 text-warm-cream' : 'bg-white'}`}>
                {/* Icon and Name */}
                <div className="mb-4 flex justify-center">{getIconComponent(tier.icon)}</div>
                <h3 className={`text-3xl font-bold mb-2 ${tier.highlighted ? 'text-warm-cream' : 'text-soft-black'}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm mb-6 ${tier.highlighted ? 'text-warm-cream/80' : 'text-slate-gray'}`}>
                  {tier.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-5xl font-bold ${tier.highlighted ? 'text-warm-cream' : 'text-slate-gray'}`}>
                      ₹{tier.price}
                    </span>
                    <span className={tier.highlighted ? 'text-warm-cream/70' : 'text-slate-gray'}>/{tier.period}</span>
                  </div>
                  <p className={`text-sm ${tier.highlighted ? 'text-warm-cream/60' : 'text-slate-gray'}`}>
                    Billed per program • Cancel anytime
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleChooseTier(tier.name)}
                  className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 mb-8 ${
                    tier.highlighted
                      ? 'bg-warm-cream text-slate-gray hover:bg-white'
                      : 'bg-slate-gray text-warm-cream hover:bg-soft-black'
                  }`}
                >
                  {tier.cta} <ArrowRight size={18} />
                </button>

                {/* Features */}
                <div className={`border-t ${tier.highlighted ? 'border-warm-cream/20' : 'border-slate-gray/20'} pt-6`}>
                  <ul className="space-y-3 mb-6">
                    {tier.includes.map((feature, j) => (
                      <li
                        key={j}
                        className={`flex gap-3 items-start text-sm ${
                          tier.highlighted ? 'text-warm-cream' : 'text-slate-gray'
                        }`}
                      >
                        <Check size={20} className="flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {tier.notIncludes.length > 0 && (
                    <ul className="space-y-2">
                      {tier.notIncludes.map((feature, j) => (
                        <li
                          key={j}
                          className={`flex gap-3 items-start text-sm opacity-50 ${
                            tier.highlighted ? 'text-warm-cream' : 'text-slate-gray'
                          }`}
                        >
                          <X size={20} className="flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-4xl font-bold text-soft-black mb-8 text-center">Feature Comparison</h2>
          <div className="bg-white rounded-xl border border-slate-gray/10 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-gray/10">
                <tr>
                  <th className="text-left p-6 font-bold text-soft-black">Feature</th>
                  <th className="text-center p-6 font-bold text-soft-black">Basic</th>
                  <th className="text-center p-6 font-bold text-soft-black">Pro</th>
                  <th className="text-center p-6 font-bold text-soft-black">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Live Sessions', basic: true, pro: true, premium: true },
                  { feature: 'Q&A Access', basic: true, pro: true, premium: true },
                  { feature: 'Community Forum', basic: true, pro: true, premium: true },
                  { feature: 'Lifetime Recordings', basic: false, pro: true, premium: true },
                  { feature: 'Downloadable Resources', basic: false, pro: true, premium: true },
                  { feature: 'Certificate', basic: false, pro: true, premium: true },
                  { feature: '1-on-1 Coaching Calls', basic: false, pro: false, premium: true },
                  { feature: 'Custom Learning Plan', basic: false, pro: false, premium: true },
                  { feature: 'Priority Support', basic: false, pro: false, premium: true },
                  { feature: 'Career Guidance', basic: false, pro: false, premium: true },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-gray/5'}>
                    <td className="p-6 font-semibold text-soft-black">{row.feature}</td>
                    <td className="text-center p-6">
                      {row.basic ? <Check className="inline text-green-500" /> : <X className="inline text-red-400" />}
                    </td>
                    <td className="text-center p-6">
                      {row.pro ? <Check className="inline text-green-500" /> : <X className="inline text-red-400" />}
                    </td>
                    <td className="text-center p-6">
                      {row.premium ? <Check className="inline text-green-500" /> : <X className="inline text-red-400" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-soft-black mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {faq.map((item, i) => (
              <motion.div
                key={i}
                className="bg-white p-6 rounded-xl border border-slate-gray/10 hover:shadow-lg transition"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
              >
                <h3 className="font-bold text-soft-black mb-2 flex items-start gap-2">
                  <Zap size={20} className="text-slate-gray flex-shrink-0 mt-1" /> {item.q}
                </h3>
                <p className="text-slate-gray">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 bg-slate-gray text-warm-cream rounded-2xl p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90">Choose your tier and explore 100+ expert-led programs</p>
          <button
            onClick={() => navigate('/programs')}
            className="bg-warm-cream text-slate-gray hovер:bg-white px-8 py-4 rounded-lg font-bold text-lg transition inline-flex items-center gap-2"
          >
            Browse Programs <ArrowRight size={24} />
          </button>
        </motion.div>
      </div>
    </div>
  )
}
