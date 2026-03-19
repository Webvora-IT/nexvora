'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ExternalLink, Github, Filter } from 'lucide-react'

const COLOR_PALETTE = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-red-500',
  'from-green-500 to-emerald-500',
  'from-yellow-500 to-orange-500',
  'from-indigo-500 to-purple-500',
]

const STATIC_PROJECTS = [
  {
    id: '1', title: 'HealthFlow Platform', category: 'Web App',
    description: 'Comprehensive healthcare management platform with real-time patient tracking.',
    tags: ['Next.js', 'PostgreSQL', 'Docker', 'AWS'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
    url: null, featured: false, published: true,
  },
  {
    id: '2', title: 'RetailAI Assistant', category: 'AI/ML',
    description: 'Intelligent retail analytics with demand forecasting and customer behavior analysis.',
    tags: ['Python', 'TensorFlow', 'FastAPI', 'React'],
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&q=80',
    url: null, featured: false, published: true,
  },
  {
    id: '3', title: 'LogiTrack Mobile', category: 'Mobile',
    description: 'Real-time logistics tracking app for fleet management and delivery optimization.',
    tags: ['React Native', 'Node.js', 'MongoDB', 'Maps API'],
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=80',
    url: null, featured: false, published: true,
  },
  {
    id: '4', title: 'CloudOps Pipeline', category: 'DevOps',
    description: 'Automated CI/CD pipeline reducing deployment time by 80% for enterprise client.',
    tags: ['Kubernetes', 'Jenkins', 'Terraform', 'AWS'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
    url: null, featured: false, published: true,
  },
  {
    id: '5', title: 'FinanceBot', category: 'AI/ML',
    description: 'NLP-powered financial assistant for automated report generation and analysis.',
    tags: ['GPT-4', 'Python', 'FastAPI', 'Vue.js'],
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
    url: null, featured: false, published: true,
  },
  {
    id: '6', title: 'AutoHR System', category: 'Automation',
    description: 'Complete HR workflow automation from onboarding to payroll processing.',
    tags: ['Next.js', 'Prisma', 'PostgreSQL', 'n8n'],
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&q=80',
    url: null, featured: false, published: true,
  },
]

interface ApiProject {
  id: string
  title: string
  category: string
  description: string
  tags: string[]
  image?: string | null
  url?: string | null
  featured: boolean
  published: boolean
}

export default function Portfolio() {
  const [projects, setProjects] = useState<ApiProject[]>(STATIC_PROJECTS)
  const [activeCategory, setActiveCategory] = useState('All')
  const [ref, inView] = useInView({ triggerOnce: true })

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then((data: ApiProject[]) => {
        if (Array.isArray(data) && data.length > 0) setProjects(data)
      })
      .catch(() => {})
  }, [])

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))]
  const filtered = activeCategory === 'All' ? projects : projects.filter(p => p.category === activeCategory)

  return (
    <section id="portfolio" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 glass rounded-full text-sm text-accent-400 border border-accent-500/30 mb-4">
            Our Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Projects That <span className="gradient-text">Speak for Themselves</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A selection of our most impactful work across industries and technologies.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white glow'
                  : 'glass text-gray-400 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {cat === 'All' && <Filter size={14} />}
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((project, i) => {
              const color = COLOR_PALETTE[i % COLOR_PALETTE.length]
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group relative glass rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${color} opacity-30`} />
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-t ${color} opacity-40`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${color} text-white`}>
                      {project.category}
                    </span>

                    {project.url && (
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={project.url} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    )}
                    {!project.url && (
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-8 h-8 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                          <ExternalLink size={14} />
                        </button>
                        <button className="w-8 h-8 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                          <Github size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{project.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((t, j) => (
                        <span key={j} className="px-2 py-1 text-xs glass rounded-full text-gray-400 border border-white/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
