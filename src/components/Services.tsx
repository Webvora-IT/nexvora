'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Globe, Smartphone, GitBranch, Brain,
  Zap, Shield, ArrowRight, Check
} from 'lucide-react'

const services = [
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Custom web applications built with Next.js, React, and modern technologies. Scalable, fast, and beautiful.',
    features: ['React / Next.js', 'Progressive Web Apps', 'E-commerce Solutions', 'API Development'],
    color: 'from-blue-500 to-indigo-600',
    bgGlow: 'rgba(99, 102, 241, 0.15)',
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Cross-platform mobile applications for iOS and Android using React Native and Flutter.',
    features: ['React Native', 'Flutter', 'iOS & Android', 'App Store Deployment'],
    color: 'from-cyan-500 to-blue-600',
    bgGlow: 'rgba(34, 211, 238, 0.15)',
  },
  {
    icon: GitBranch,
    title: 'DevOps & Cloud',
    description: 'Streamline your development pipeline with CI/CD, containerization, and cloud infrastructure.',
    features: ['Docker & Kubernetes', 'CI/CD Pipelines', 'AWS / GCP / Azure', 'Infrastructure as Code'],
    color: 'from-orange-500 to-red-600',
    bgGlow: 'rgba(249, 115, 22, 0.15)',
  },
  {
    icon: Brain,
    title: 'AI & Machine Learning',
    description: 'Intelligent solutions powered by machine learning, NLP, computer vision, and generative AI.',
    features: ['Custom ML Models', 'NLP & Chatbots', 'Computer Vision', 'Data Analytics'],
    color: 'from-purple-500 to-pink-600',
    bgGlow: 'rgba(168, 85, 247, 0.15)',
  },
  {
    icon: Zap,
    title: 'Automation',
    description: 'Automate repetitive tasks and workflows to save time and reduce operational costs.',
    features: ['Workflow Automation', 'RPA Solutions', 'API Integration', 'Process Optimization'],
    color: 'from-yellow-500 to-orange-600',
    bgGlow: 'rgba(234, 179, 8, 0.15)',
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    description: 'Protect your digital assets with comprehensive security assessments and solutions.',
    features: ['Security Audits', 'Penetration Testing', 'Data Protection', 'Compliance'],
    color: 'from-green-500 to-emerald-600',
    bgGlow: 'rgba(34, 197, 94, 0.15)',
  },
]

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const Icon = service.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden cursor-pointer"
      style={{
        background: `radial-gradient(circle at top left, ${service.bgGlow}, transparent 60%)`,
      }}
    >
      <div className="relative z-10">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} className="text-white" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          {service.description}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {service.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
              <Check size={14} className="text-green-400 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Learn More */}
        <a
          href="#contact"
          className="flex items-center gap-2 text-sm font-medium text-primary-400 hover:text-primary-300 group/link"
        >
          Learn More
          <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
        </a>
      </div>
    </motion.div>
  )
}

export default function Services() {
  const [titleRef, titleInView] = useInView({ triggerOnce: true })

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <motion.span className="inline-block px-4 py-2 glass rounded-full text-sm text-primary-400 border border-primary-500/30 mb-4">
            Our Services
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to
            <br />
            <span className="gradient-text">Build &amp; Scale</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We provide end-to-end technology solutions that help businesses
            innovate, grow, and stay ahead of the competition.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
