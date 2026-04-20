import React from 'react'
import { motion } from 'framer-motion'

export default function HeroBanner({
  title,
  subtitle,
  backgroundImage,
  gradient = 'from-slate-gray to-soft-black',
  primaryAction,
  secondaryAction,
  height = 'h-96',
}) {
  return (
    <section className={`relative ${height} flex items-center justify-center overflow-hidden`}>
      {/* Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Animated Background Elements */}
      <motion.div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* CTA Buttons */}
        {(primaryAction || secondaryAction) && (
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {primaryAction && (
              <motion.button
                onClick={primaryAction.onClick}
                className="bg-white text-slate-gray hover:bg-warm-cream px-8 py-4 rounded-xl font-bold transition transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {primaryAction.label}
              </motion.button>
            )}

            {secondaryAction && (
              <motion.button
                onClick={secondaryAction.onClick}
                className="bg-white/20 text-white hover:bg-white/30 px-8 py-4 rounded-xl font-bold border-2 border-white/30 transition transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {secondaryAction.label}
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
