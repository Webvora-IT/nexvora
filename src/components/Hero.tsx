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

function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
      className="relative mt-20 max-w-5xl mx-auto px-4 lg:px-0"
    >
      <div className="relative glass rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
        {/* Mock UI Content */}
        <div className="absolute inset-0 p-6 md:p-10 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                <Brain size={20} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white uppercase tracking-tighter">Nexvora Engine</div>
                <div className="text-[10px] text-gray-500 font-mono">v4.2.0-stable</div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            <div className="md:col-span-2 glass rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <Cpu size={120} />
              </div>
              <div className="text-xs font-black text-primary-400 uppercase tracking-widest mb-4">Real-time Analytics</div>
              <div className="h-32 flex items-end gap-2">
                {[40, 70, 45, 90, 65, 80, 50, 85, 95, 75, 60, 88].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: 1.2 + i * 0.05 }}
                    className="flex-1 bg-gradient-to-t from-primary-600/40 to-accent-500/60 rounded-t-sm"
                  />
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-6 border border-white/5 text-left">
              <div className="text-xs font-black text-accent-400 uppercase tracking-widest mb-4">Neural Nodes</div>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                      <div className="text-xs text-gray-400">Node Cluster {i+1}</div>
                    </div>
                    <div className="text-[10px] font-mono text-primary-400">99.9%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Glow behind mockup */}
        <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-primary-600/20 blur-[120px] rounded-full pointer-events-none" />
      </div>
    </motion.div>
  )
}

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
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a12] pt-32 pb-20">
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
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 px-5 py-2 glass rounded-full text-xs font-black uppercase tracking-widest text-gray-300 mb-12 border border-primary-500/40 shadow-lg shadow-primary-500/5 hover:border-primary-400 transition-colors"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          {t('badge')}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black mb-10 leading-[0.95] tracking-tighter text-white"
        >
          {t('titleLine1')}
          <br />
          <span className="gradient-text italic decoration-primary-500/30 underline-offset-8">
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
          <span className="text-3xl md:text-5xl text-gray-500/80 font-bold tracking-normal">{t('titleLine3')}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed font-medium"
        >
          {t('subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-32"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(99,102,241,0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="group w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full font-black text-xl text-white shadow-2xl transition-all"
          >
            {t('cta_primary')}
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </motion.a>
          <motion.a
            href="#portfolio"
            whileHover={{ scale: 1.05, bg: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 glass border border-white/20 rounded-full font-black text-xl text-white hover:border-white/40 transition-all"
          >
            <Play size={22} className="text-primary-400 fill-primary-400/20" />
            {t('cta_secondary')}
          </motion.a>
        </motion.div>

        {/* Hero Preview Mockup */}
        <HeroMockup />

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 max-w-6xl mx-auto mt-40"
        >
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -12, scale: 1.02 }}
              className="glass rounded-[2rem] p-10 border border-white/10 hover:border-primary-500/30 transition-all duration-500 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-5xl lg:text-6xl font-black gradient-text mb-4 relative z-10 tracking-tighter">{stat.value}</div>
              <div className="text-xs lg:text-sm text-gray-500 font-black uppercase tracking-[0.3em] relative z-10">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
