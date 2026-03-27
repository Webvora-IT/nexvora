'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Tag, ArrowRight, BookOpen, Search } from 'lucide-react'
import { useLocale } from 'next-intl'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  image?: string
  tags: string[]
  publishedAt?: string
  createdAt: string
}

export default function BlogPage() {
  const locale = useLocale()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('')

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const allTags = Array.from(new Set((Array.isArray(posts) ? posts : []).flatMap(p => p.tags || [])))

  const filtered = posts.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.excerpt || '').toLowerCase().includes(search.toLowerCase())
    const matchTag = !activeTag || (p.tags || []).includes(activeTag)
    return matchSearch && matchTag
  })

  return (
    <main className="min-h-screen bg-[#0a0a14]">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full border border-white/10 text-sm text-primary-400 mb-6">
              <BookOpen size={14} />
              <span>Blog & Insights</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Nos articles</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Expertise, tendances et insights sur le monde du digital, de l&apos;IA et de la technologie.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative max-w-xl mx-auto mt-8"
          >
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un article..."
              className="w-full pl-11 pr-4 py-3 glass border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 text-sm"
            />
          </motion.div>
        </div>
      </section>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <section className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveTag('')}
              className={`px-4 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                !activeTag
                  ? 'bg-primary-600 border-primary-500 text-white'
                  : 'glass border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              Tous
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
                className={`px-4 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                  activeTag === tag
                    ? 'bg-primary-600 border-primary-500 text-white'
                    : 'glass border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-2xl border border-white/10 h-72 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={40} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun article trouvé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link href={`/${locale}/blog/${post.slug}`}>
                  <div className="glass rounded-2xl border border-white/10 overflow-hidden hover:border-primary-500/30 transition-all duration-300 group h-full flex flex-col">
                    {/* Image */}
                    <div className="h-44 bg-gradient-to-br from-primary-900/40 to-accent-900/40 overflow-hidden relative">
                      {post.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={40} className="text-primary-500/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      {/* Tags */}
                      {(post.tags || []).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {post.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="flex items-center gap-1 px-2 py-0.5 text-xs glass rounded-full text-primary-400 border border-primary-500/20">
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <h2 className="text-white font-semibold text-base mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-400 text-sm leading-relaxed flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                          <Calendar size={12} />
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                            : new Date(post.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <span className="flex items-center gap-1 text-primary-400 text-xs font-medium group-hover:gap-2 transition-all">
                          Lire <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
