'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Check, Zap, ArrowRight, Star, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface PricingPlan {
  id: string
  key: string
  name: string
  description: string
  price: number
  period: string
  features: string[]
  popular: boolean
  color: string
  glow: string
  published: boolean
}

export default function Pricing() {
  const t = useTranslations('pricing')
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/pricing')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const publishedOnly = data.filter((p: any) => p.published)
          setPlans(publishedOnly)
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to fetch pricing plans:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    )
  }

  if (plans.length === 0) return null

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-[#f8fafc] dark:bg-transparent transition-colors duration-500">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-block px-4 py-2 glass rounded-full text-sm text-accent-400 border border-accent-500/30 mb-4"
          >
            {t('badge')}
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white mb-6">
            {t('title')}
            <br />
            <span className="gradient-text">{t('titleGradient')}</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Plans */}
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(plans.length, 3)} gap-6 items-start max-w-6xl mx-auto`}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -10 }}
              className={`relative glass rounded-3xl p-8 border transition-all duration-300 overflow-hidden ${
                plan.popular
                  ? 'border-primary-500/60 scale-105 shadow-2xl z-10'
                  : 'border-gray-200 dark:border-white/10 hover:border-primary-500/30'
              }`}
              style={plan.popular ? {
                boxShadow: `0 0 40px ${plan.glow}, 0 0 80px rgba(99,102,241,0.08)`
              } : {}}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(circle at top left, ${plan.glow}, transparent 60%)` }}
              />

              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-5 py-1.5 bg-gradient-to-r from-primary-600 to-accent-500 text-white text-xs font-bold rounded-full shadow-lg">
                  <Zap size={11} fill="white" /> {t('popular_badge')}
                </div>
              )}

              <div className="relative z-10">
                <div className="mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3`}>
                    <Star size={20} className="text-white" fill="white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-950 dark:text-white uppercase tracking-tight">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 font-medium">{plan.description}</p>
                </div>

                <div className="mb-7">
                  {plan.price === 0 ? (
                    <div>
                      <span className="text-4xl font-black text-gray-950 dark:text-white italic">{t('sur_devis')}</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-gray-950 dark:text-white">${plan.price.toLocaleString('en-US')}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm font-medium">{plan.period}</span>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: i * 0.1 + idx * 0.05 + 0.3 }}
                       className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-400 font-medium"
                    >
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-green-400" />
                      </div>
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                   className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-lg transition-all ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.color} text-white shadow-xl`
                      : 'glass border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white hover:border-primary-500/30'
                  }`}
                >
                  {t(`plans.${plan.key}.cta`) || 'Commencer'}
                  <ArrowRight size={16} />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-500 text-sm mt-10"
        >
          {t('note')}{' '}
          <a href="#contact" className="text-primary-400 hover:text-primary-300 underline underline-offset-2">
            {t('note_link')}
          </a>
        </motion.p>
      </div>
    </section>
  )
}
