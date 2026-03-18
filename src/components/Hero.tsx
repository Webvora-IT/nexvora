'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Code, Brain, Cpu, Globe, Shield, Zap } from 'lucide-react'
import { TypeAnimation } from 'react-type-animation'

const stats = [
  { value: '200+', label: 'Projects Delivered' },
  { value: '50+', label: 'Happy Clients' },
  { value: '5+', label: 'Years Experience' },
  { value: '99%', label: 'Client Satisfaction' },
]

const floatingIcons = [
  { Icon: Code, color: '#6366f1', delay: 0, position: { top: '20%', left: '10%' } },
  { Icon: Brain, color: '#22d3ee', delay: 1, position: { top: '15%', right: '15%' } },
  { Icon: Cpu, color: '#a855f7', delay: 2, position: { bottom: '30%', left: '8%' } },
  { Icon: Globe, color: '#6366f1', delay: 0.5, position: { top: '40%', right: '8%' } },
  { Icon: Shield, color: '#22d3ee', delay: 1.5, position: { bottom: '20%', right: '20%' } },
  { Icon: Zap, color: '#f59e0b', delay: 2.5, position: { top: '60%', left: '15%' } },
]

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="grid-pattern absolute inset-0 opacity-30" />

        {/* Gradient orbs */}
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 15, 0],
            y: [0, -15, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl"
        />
      </div>

      {/* Floating tech icons */}
      {floatingIcons.map(({ Icon, color, delay, position }, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:flex items-center justify-center w-12 h-12 glass rounded-xl"
          style={position as React.CSSProperties}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4 + delay,
            repeat: Infinity,
            ease: 'easeInOut',
            delay,
          }}
        >
          <Icon size={22} style={{ color }} />
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-gray-300 mb-8 border border-primary-500/30"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Available for new projects
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          We Build
          <br />
          <span className="gradient-text">
            <TypeAnimation
              sequence={[
                'Web Apps',
                2000,
                'Mobile Apps',
                2000,
                'AI Solutions',
                2000,
                'DevOps Pipelines',
                2000,
                'Automation',
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </span>
          <br />
          <span className="text-4xl md:text-5xl lg:text-6xl text-gray-300">That Drive Growth</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          Nexvora is your technology partner for building scalable digital solutions.
          From web &amp; mobile apps to AI, DevOps, and automation — we turn your vision into reality.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full font-semibold text-lg glow hover:opacity-90 transition-opacity"
          >
            Start Your Project
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
          <motion.a
            href="#portfolio"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-8 py-4 glass rounded-full font-semibold text-lg hover:bg-white/10 transition-colors border border-white/20"
          >
            <Play size={18} className="text-primary-400" />
            View Our Work
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass rounded-2xl p-4 border border-white/10"
            >
              <div className="text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-gray-500 to-transparent" />
        </motion.div>
      </div>
    </section>
  )
}
