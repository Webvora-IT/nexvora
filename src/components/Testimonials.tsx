'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote } from 'lucide-react'

const STATIC_TESTIMONIALS = [
  {
    id: '1', name: 'James Wilson', company: 'TechStart Inc.', position: 'CTO',
    content: 'Nexvora transformed our entire infrastructure. The DevOps pipeline they built reduced our deployment time by 75%. Exceptional team, exceptional results.',
    rating: 5, avatar: '👨‍💼',
  },
  {
    id: '2', name: 'Sarah Kim', company: 'RetailPro', position: 'CEO',
    content: 'The AI recommendation system Nexvora built for us increased our sales by 40% in just 3 months. They truly understand how to leverage technology for business growth.',
    rating: 5, avatar: '👩‍💼',
  },
  {
    id: '3', name: 'David Okafor', company: 'HealthBridge', position: 'Product Manager',
    content: 'Outstanding work on our healthcare platform. They delivered on time, within budget, and the quality exceeded our expectations. Will definitely work with them again.',
    rating: 5, avatar: '👨‍⚕️',
  },
  {
    id: '4', name: 'Elena Martinez', company: 'LogiFlow', position: 'Operations Director',
    content: 'The automation solution Nexvora built saves us 200+ hours per month. The ROI was visible within the first month. Highly recommended!',
    rating: 5, avatar: '👩‍🔧',
  },
  {
    id: '5', name: 'Tom Harrison', company: 'FinEdge', position: 'CIO',
    content: "Professional, responsive, and technically brilliant. Nexvora's mobile app has 4.9 stars on both app stores. Our users love it.",
    rating: 5, avatar: '👨‍💻',
  },
  {
    id: '6', name: 'Aisha Nwosu', company: 'EduTech Global', position: 'Founder',
    content: 'Working with Nexvora was a game-changer. From ideation to launch in 3 months, our edtech platform now serves 50,000+ students worldwide.',
    rating: 5, avatar: '👩‍🏫',
  },
]

interface ApiTestimonial {
  id: string
  name: string
  company: string
  position: string
  content: string
  rating: number
  avatar?: string | null
}

import { useTranslations } from 'next-intl'

export default function Testimonials() {
  const t = useTranslations('testimonials')
  const [ref, inView] = useInView({ triggerOnce: true })
  const [testimonials, setTestimonials] = useState<ApiTestimonial[]>(STATIC_TESTIMONIALS)

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then((data: ApiTestimonial[]) => {
        if (Array.isArray(data) && data.length > 0) setTestimonials(data)
      })
      .catch(() => {})
  }, [])

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-white dark:bg-transparent transition-colors duration-500">
      <div className="absolute inset-0">
        <div className="grid-pattern opacity-15 absolute inset-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 glass rounded-full text-sm text-yellow-400 border border-yellow-500/30 mb-4">
            {t('badge')}
          </span>
           <h2 className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white mb-6">
            {t('title')}
            <br />
            <span className="gradient-text tracking-tighter uppercase">{t('titleGradient')}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
               className="glass rounded-3xl p-8 border border-gray-200 dark:border-white/10 hover:border-primary-500/30 transition-all relative overflow-hidden group shadow-sm bg-gray-50/50 dark:bg-white/5"
            >
              <Quote size={40} className="absolute top-4 right-4 text-primary-500/20 group-hover:text-primary-500/30 transition-colors" />

              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>

               <p className="text-gray-700 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-8 relative z-10 font-medium italic">
                &ldquo;{t.content}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                {t.avatar ? (
                  <span className="text-3xl">{t.avatar}</span>
                ) : (
                       <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        {t.name.charAt(0)}
                      </div>
                )}
                 <div>
                  <div className="font-black text-gray-950 dark:text-white text-lg leading-tight uppercase tracking-tight">{t.name}</div>
                  <div className="text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest mt-1">{t.position} @ {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
