'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Check, Zap, ArrowRight, Star } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: 2999,
    period: 'project',
    description: 'Idéal pour les startups et MVP',
    features: [
      "Jusqu'à 5 pages",
      'Design responsive',
      'SEO de base',
      'Formulaire de contact',
      '1 mois de support',
      'Code source inclus',
    ],
    cta: 'Commencer',
    popular: false,
    color: 'from-blue-500 to-indigo-600',
    glow: 'rgba(99,102,241,0.15)',
  },
  {
    name: 'Professional',
    price: 7999,
    period: 'project',
    description: 'Pour les entreprises en pleine croissance',
    features: [
      'Pages illimitées',
      'Animations sur mesure',
      'Panel admin complet',
      'Intégrations API',
      'Base de données',
      'Système auth',
      '3 mois de support',
      'Optimisation performances',
    ],
    cta: 'Choisir Pro',
    popular: true,
    color: 'from-primary-500 to-accent-500',
    glow: 'rgba(99,102,241,0.25)',
  },
  {
    name: 'Enterprise',
    price: 0,
    period: 'custom',
    description: 'Solutions à grande échelle sur mesure',
    features: [
      'Tout du plan Pro',
      'Intégration IA/ML',
      'Setup DevOps complet',
      'Microservices',
      'Load balancing',
      'Équipe dédiée',
      '12 mois de support',
      'Garantie SLA',
    ],
    cta: 'Nous Contacter',
    popular: false,
    color: 'from-purple-500 to-pink-600',
    glow: 'rgba(168,85,247,0.15)',
  },
]

export default function Pricing() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
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
            Nos Tarifs
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Investissement
            <br />
            <span className="gradient-text">Transparent & Clair</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Pas de frais cachés. Payez uniquement ce dont vous avez besoin.
            Évoluez à votre rythme.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -10 }}
              className={`relative glass rounded-2xl p-8 border transition-all duration-300 overflow-hidden ${
                plan.popular
                  ? 'border-primary-500/60 scale-105'
                  : 'border-white/10 hover:border-white/25'
              }`}
              style={plan.popular ? {
                boxShadow: `0 0 40px ${plan.glow}, 0 0 80px rgba(99,102,241,0.08)`
              } : {}}
            >
              {/* Background glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(circle at top left, ${plan.glow}, transparent 60%)` }}
              />

              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-5 py-1.5 bg-gradient-to-r from-primary-600 to-accent-500 text-white text-xs font-bold rounded-full shadow-lg">
                  <Zap size={11} fill="white" /> MOST POPULAR
                </div>
              )}

              <div className="relative z-10">
                {/* Icon + Name */}
                <div className="mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3`}>
                    <Star size={20} className="text-white" fill="white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-7">
                  {plan.price === 0 ? (
                    <div>
                      <span className="text-4xl font-bold text-white">Sur devis</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-5xl font-bold text-white">${plan.price.toLocaleString('en-US')}</span>
                      <span className="text-gray-400 ml-2 text-sm">/{plan.period}</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: i * 0.1 + j * 0.05 + 0.3 }}
                      className="flex items-center gap-2.5 text-sm text-gray-300"
                    >
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-green-400" />
                      </div>
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.color} text-white`
                      : 'glass border border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight size={16} />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-500 text-sm mt-10"
        >
          Tous les prix sont HT. Consultation gratuite incluse.{' '}
          <a href="#contact" className="text-primary-400 hover:text-primary-300 underline underline-offset-2">
            Contactez-nous pour un devis personnalisé.
          </a>
        </motion.p>
      </div>
    </section>
  )
}
