'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Globe, Smartphone, GitBranch, Brain,
  Zap, Shield, ArrowRight, Check, Code, Database,
  Server, Cpu, Lock, BarChart, Cloud, Layers,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  Globe, Smartphone, GitBranch, Brain, Zap, Shield,
  Code, Database, Server, Cpu, Lock, BarChart, Cloud, Layers,
}

const COLOR_PALETTE = [
  { color: 'from-blue-500 to-indigo-600', bgGlow: 'rgba(99, 102, 241, 0.15)' },
  { color: 'from-cyan-500 to-blue-600', bgGlow: 'rgba(34, 211, 238, 0.15)' },
  { color: 'from-orange-500 to-red-600', bgGlow: 'rgba(249, 115, 22, 0.15)' },
  { color: 'from-purple-500 to-pink-600', bgGlow: 'rgba(168, 85, 247, 0.15)' },
  { color: 'from-yellow-500 to-orange-600', bgGlow: 'rgba(234, 179, 8, 0.15)' },
  { color: 'from-green-500 to-emerald-600', bgGlow: 'rgba(34, 197, 94, 0.15)' },
]

const STATIC_SERVICES = [
  {
    id: '1', icon: 'Globe', title: 'Web Development',
    description: 'Custom web applications built with Next.js, React, and modern technologies. Scalable, fast, and beautiful.',
    features: ['React / Next.js', 'Progressive Web Apps', 'E-commerce Solutions', 'API Development'],
    price: null, order: 0, published: true,
    gridClass: 'md:col-span-2 md:row-span-1',
  },
  {
    id: '4', icon: 'Brain', title: 'AI & Machine Learning',
    description: 'Intelligent solutions powered by machine learning, NLP, computer vision, and generative AI.',
    features: ['Custom ML Models', 'NLP & Chatbots', 'Computer Vision', 'Data Analytics'],
    price: null, order: 3, published: true,
    gridClass: 'md:col-span-1 md:row-span-2',
  },
  {
    id: '2', icon: 'Smartphone', title: 'Mobile Apps',
    description: 'Cross-platform mobile applications for iOS and Android using React Native and Flutter.',
    features: ['React Native', 'Flutter', 'iOS & Android', 'App Store Deployment'],
    price: null, order: 1, published: true,
    gridClass: 'md:col-span-1 md:row-span-1',
  },
  {
    id: '3', icon: 'GitBranch', title: 'DevOps & Cloud',
    description: 'Streamline your development pipeline with CI/CD, containerization, and cloud infrastructure.',
    features: ['Docker & Kubernetes', 'CI/CD Pipelines', 'AWS / GCP / Azure', 'Infrastructure as Code'],
    price: null, order: 2, published: true,
    gridClass: 'md:col-span-1 md:row-span-1',
  },
  {
    id: '5', icon: 'Zap', title: 'Automation',
    description: 'Automate repetitive tasks and workflows to save time and reduce operational costs.',
    features: ['Workflow Automation', 'RPA Solutions', 'API Integration', 'Process Optimization'],
    price: null, order: 4, published: true,
    gridClass: 'md:col-span-2 md:row-span-1',
  },
  {
    id: '6', icon: 'Shield', title: 'Cybersecurity',
    description: 'Protect your digital assets with comprehensive security assessments and solutions.',
    features: ['Security Audits', 'Penetration Testing', 'Data Protection', 'Compliance'],
    price: null, order: 5, published: true,
    gridClass: 'md:col-span-1 md:row-span-1',
  },
]

interface ApiService {
  id: string
  icon: string
  title: string
  description: string
  features: string[]
  price?: string | null
  order: number
  published: boolean
  gridClass?: string
}

function ServiceCard({ service, index }: { service: ApiService; index: number }) {
  const t = useTranslations('services')
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const palette = COLOR_PALETTE[index % COLOR_PALETTE.length]
  const Icon = ICON_MAP[service.icon] || Globe

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className={`group relative glass rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden cursor-pointer flex flex-col justify-between ${service.gridClass || ''}`}
      style={{ background: `radial-gradient(circle at top left, ${palette.bgGlow}, transparent 70%)` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${palette.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-black/20`}>
          <Icon size={28} className="text-white" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-300 transition-colors">{service.title}</h3>
        <p className="text-gray-400 text-base leading-relaxed mb-6 group-hover:text-gray-300 transition-colors">{service.description}</p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {service.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500/50" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
        {service.price ? (
          <span className="text-primary-400 font-bold">{service.price}</span>
        ) : (
          <span className="text-gray-600 text-xs uppercase tracking-widest font-black">{t('badge')}</span>
        )}
        <a href="#contact" className="flex items-center gap-2 text-sm font-bold text-white hover:text-primary-400 transition-colors group/link">
          {t('learnMore')}
          <ArrowRight size={18} className="group-hover/link:translate-x-2 transition-transform duration-300" />
        </a>
      </div>
    </motion.div>
  )
}

import { useTranslations } from 'next-intl'

export default function Services() {
  const t = useTranslations('services')
  const [titleRef, titleInView] = useInView({ triggerOnce: true })
  const [services, setServices] = useState<ApiService[]>(STATIC_SERVICES)

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then((data: ApiService[]) => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge API data with grid classes if possible, or just use defaults
          const merged = data.map((s, i) => ({
            ...s,
            gridClass: STATIC_SERVICES[i]?.gridClass || ''
          }))
          setServices(merged)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="services" className="py-32 relative overflow-hidden bg-[#0a0a12]">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-xs font-black uppercase tracking-widest text-primary-400 border border-primary-500/30 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            {t('badge')}
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            {t('title')}
            <br />
            <span className="gradient-text italic px-2">{t('titleGradient')}</span>
          </h2>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[400px] gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
