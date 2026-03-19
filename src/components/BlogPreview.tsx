'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Calendar, Tag, ArrowRight, BookOpen } from 'lucide-react'
import { useLocale } from 'next-intl'

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

export default function BlogPreview() {
  const locale = useLocale()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setPosts(data.slice(0, 3))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (!loading && posts.length === 0) return null

  return (
    <section ref={ref} className="py-24 relative overflow-hidden" id="blog">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute top-10 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full border border-white/10 text-sm text-primary-400 mb-4">
            <BookOpen size={14} />
            <span>Blog & Insights</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Nos derniers articles</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tendances technologiques, conseils experts et retours d&apos;expérience de l&apos;équipe Nexvora.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-2xl border border-white/10 h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  <Link href={`/${locale}/blog/${post.slug}`}>
                    <div className="glass rounded-2xl border border-white/10 overflow-hidden hover:border-primary-500/30 transition-all duration-300 group h-full flex flex-col">
                      {/* Image */}
                      <div className="h-40 bg-gradient-to-br from-primary-900/40 to-accent-900/40 relative overflow-hidden">
                        {post.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen size={32} className="text-primary-500/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        {(post.tags || []).length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {post.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="flex items-center gap-1 px-2 py-0.5 text-xs glass rounded-full text-primary-400 border border-primary-500/20">
                                <Tag size={9} />{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <h3 className="text-white font-semibold text-sm leading-snug mb-2 group-hover:text-primary-400 transition-colors line-clamp-2 flex-1">
                          {post.title}
                        </h3>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                            <Calendar size={11} />
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                              : new Date(post.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                          <span className="flex items-center gap-1 text-primary-400 text-xs font-medium group-hover:gap-2 transition-all">
                            Lire <ArrowRight size={11} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-center mt-10"
            >
              <Link href={`/${locale}/blog`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-3 glass border border-white/20 hover:border-primary-500/40 rounded-full text-sm font-medium text-gray-300 hover:text-white transition-all duration-200"
                >
                  Voir tous les articles
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
