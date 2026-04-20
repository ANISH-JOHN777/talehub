import React from 'react'
import { motion } from 'framer-motion'

export default function FeatureShowcase({
  title,
  description,
  features,
  layout = 'grid', // 'grid', 'rows', 'carousel'
  columns = 3,
}) {
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
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-soft-black mb-4">{title}</h2>
          <p className="text-xl text-slate-gray max-w-2xl mx-auto">{description}</p>
        </motion.div>

        {/* Features Grid */}
        {layout === 'grid' && (
          <motion.div
            className={`grid grid-cols-1 md:grid-cols-${columns} gap-8`}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                >
                  {/* Image/Icon Area */}
                  <div
                    className={`h-48 flex items-center justify-center bg-gradient-to-br ${feature.gradient || 'from-slate-gray/20 to-slate-gray/10'} relative overflow-hidden`}
                  >
                    {feature.image ? (
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="relative z-10 text-center">
                        {Icon && <Icon size={64} className="text-slate-gray mb-2 mx-auto" />}
                        <p className="text-slate-gray/60 text-sm font-semibold">{feature.category}</p>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-soft-black mb-3 group-hover:text-slate-gray transition">
                      {feature.title}
                    </h3>
                    <p className="text-slate-gray mb-4">{feature.description}</p>

                    {feature.benefits && (
                      <ul className="space-y-2 mb-4">
                        {feature.benefits.map((benefit, bIndex) => (
                          <li key={bIndex} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-gray flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    )}

                    {feature.cta && (
                      <button className="text-slate-gray hover:text-soft-black font-semibold text-sm flex items-center gap-1 transition">
                        {feature.cta} →
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Features Rows */}
        {layout === 'rows' && (
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              const isEven = index % 2 === 0

              return (
                <motion.div
                  key={index}
                  className="grid md:grid-cols-2 gap-8 items-center"
                  variants={itemVariants}
                >
                  {isEven ? (
                    <>
                      {/* Content on Left */}
                      <div>
                        <h3 className="text-3xl font-bold text-soft-black mb-4">{feature.title}</h3>
                        <p className="text-lg text-slate-gray mb-6">{feature.description}</p>

                        {feature.benefits && (
                          <ul className="space-y-3 mb-8">
                            {feature.benefits.map((benefit, bIndex) => (
                              <li key={bIndex} className="flex items-center gap-3 text-gray-600">
                                {Icon ? <Icon size={24} className="text-slate-gray flex-shrink-0" /> : <span>✓</span>}
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        )}

                        {feature.cta && (
                          <button className="bg-slate-gray text-warm-cream hover:bg-soft-black px-6 py-3 rounded-lg font-semibold transition">
                            {feature.cta}
                          </button>
                        )}
                      </div>

                      {/* Image on Right */}
                      <motion.div
                        className="rounded-2xl overflow-hidden shadow-lg"
                        whileHover={{ scale: 1.05 }}
                      >
                        {feature.image ? (
                          <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`h-96 flex items-center justify-center bg-gradient-to-br ${feature.gradient || 'from-slate-gray/20 to-slate-gray/10'}`}>
                            {Icon && <Icon size={120} className="text-slate-gray opacity-30" />}
                          </div>
                        )}
                      </motion.div>
                    </>
                  ) : (
                    <>
                      {/* Image on Left */}
                      <motion.div
                        className="rounded-2xl overflow-hidden shadow-lg order-2 md:order-1"
                        whileHover={{ scale: 1.05 }}
                      >
                        {feature.image ? (
                          <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`h-96 flex items-center justify-center bg-gradient-to-br ${feature.gradient || 'from-slate-gray/20 to-slate-gray/10'}`}>
                            {Icon && <Icon size={120} className="text-slate-gray opacity-30" />}
                          </div>
                        )}
                      </motion.div>

                      {/* Content on Right */}
                      <div className="order-1 md:order-2">
                        <h3 className="text-3xl font-bold text-soft-black mb-4">{feature.title}</h3>
                        <p className="text-lg text-slate-gray mb-6">{feature.description}</p>

                        {feature.benefits && (
                          <ul className="space-y-3 mb-8">
                            {feature.benefits.map((benefit, bIndex) => (
                              <li key={bIndex} className="flex items-center gap-3 text-gray-600">
                                {Icon ? <Icon size={24} className="text-slate-gray flex-shrink-0" /> : <span>✓</span>}
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        )}

                        {feature.cta && (
                          <button className="bg-slate-gray text-warm-cream hover:bg-soft-black px-6 py-3 rounded-lg font-semibold transition">
                            {feature.cta}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}
