'use client'

import useSWR from 'swr'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Code, Brain, Cpu, Globe, Shield, Zap } from 'lucide-react'
import { TypeAnimation } from 'react-type-animation'
import { useTranslations, useLocale } from 'next-intl'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const floatingIcons = [
  { Icon: Code, color: '#6366f1', delay: 0, position: { top: '20%', left: '10%' } },
  { Icon: Brain, color: '#22d3ee', delay: 1, position: { top: '15%', right: '15%' } },
  { Icon: Cpu, color: '#a855f7', delay: 2, position: { bottom: '30%', left: '8%' } },
  { Icon: Globe, color: '#6366f1', delay: 0.5, position: { top: '40%', right: '8%' } },
  { Icon: Shield, color: '#22d3ee', delay: 1.5, position: { bottom: '20%', right: '20%' } },
  { Icon: Zap, color: '#f59e0b', delay: 2.5, position: { top: '60%', left: '15%' } },
]

export default function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const { data: config } = useSWR<Record<string, string>>('/api/config', fetcher)

  const stats = [
    { value: config?.statProjects || '200+', label: t('stat_projects') },
    { value: config?.statClients || '50+', label: t('stat_clients') },
    { value: config?.statYears || '5+', label: t('stat_years') },
    { value: config?.statSatisfaction || '99%', label: t('stat_satisfaction') },
  ]

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a14]">
      {/* Animated background highlights */}
      <div className="absolute inset-0 z-0">
        <div className="grid-pattern absolute inset-0 opacity-20 pointer-events-none" />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[120px]"
        />
      </div>

      {/* Floating tech icons */}
      {floatingIcons.map(({ Icon, color, delay, position }, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:flex items-center justify-center w-14 h-14 glass rounded-2xl border border-white/10 shadow-2xl z-10"
          style={position as React.CSSProperties}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 5 + delay,
            repeat: Infinity,
            ease: 'easeInOut',
            delay,
          }}
        >
          <Icon size={24} style={{ color }} />
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 glass rounded-full text-sm font-medium text-gray-300 mb-10 border border-primary-500/40 shadow-lg shadow-primary-500/5 hover:border-primary-400 transition-colors"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          {t('badge')}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] tracking-tight text-white"
        >
          {t('titleLine1')}
          <br />
          <span className="gradient-text italic px-1">
            <TypeAnimation
              sequence={[
                t('types.web'), 2000,
                t('types.mobile'), 2000,
                t('types.ai'), 2000,
                t('types.devops'), 2000,
                t('types.automation'), 2000,
              ]}
              wrapper="span"
              speed={45}
              repeat={Infinity}
            />
          </span>
          <br />
          <span className="text-4xl md:text-6xl text-gray-400/90 font-bold">{t('titleLine3')}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
        >
          {t('subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(99,102,241,0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-10 py-4.5 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full font-bold text-lg text-white shadow-xl transition-all"
          >
            {t('cta_primary')}
            <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
          </motion.a>
          <motion.a
            href="#portfolio"
            whileHover={{ scale: 1.05, bg: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-10 py-4.5 glass border border-white/20 rounded-full font-bold text-lg text-white hover:border-white/40 transition-all"
          >
            <Play size={20} className="text-primary-400 fill-primary-400/20" />
            {t('cta_secondary')}
          </motion.a>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="glass rounded-3xl p-6 border border-white/10 hover:border-primary-500/30 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-3xl lg:text-4xl font-black gradient-text mb-2 relative z-10">{stat.value}</div>
              <div className="text-xs lg:text-sm text-gray-500 font-bold uppercase tracking-wider relative z-10">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Improved Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">{t('scroll')}</span>
          <div className="w-[1.5px] h-10 bg-gradient-to-b from-primary-500/50 via-gray-700 to-transparent rounded-full shadow-lg" />
        </motion.div>
      </div>
    </section>
  )
}
