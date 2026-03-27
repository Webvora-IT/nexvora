'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Tag, ArrowRight, BookOpen, Search } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
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

export default function BlogClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const t = useTranslations('blog')
  const locale = useLocale()
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('')

  const allTags = Array.from(new Set((initialPosts || []).flatMap(p => p.tags || [])))

  const filtered = initialPosts.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.excerpt || '').toLowerCase().includes(search.toLowerCase())
    const matchTag = !activeTag || (p.tags || []).includes(activeTag)
    return matchSearch && matchTag
  })

  return (
    <main className="min-h-screen bg-white dark:bg-[#030617] transition-colors duration-500">
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full border border-gray-200 dark:border-white/10 text-sm text-primary-500 mb-6 font-bold uppercase tracking-widest">
              <BookOpen size={14} />
              <span>{t('badge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic text-gray-950 dark:text-white">
              <span>{t('title')} </span>
              <br className="md:hidden" />
              <span className="gradient-text not-italic">{t('titleGradient')}</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y : 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative max-w-xl mx-auto mt-8"
          >
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full pl-12 pr-6 py-4 glass border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all text-base shadow-sm font-medium"
            />
          </motion.div>
        </div>
      </section>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <section className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setActiveTag('')}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all duration-300 ${
                !activeTag
                  ? 'bg-gradient-to-r from-primary-600 to-accent-500 border-transparent text-white shadow-lg'
                  : 'glass border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-primary-500/30 shadow-sm'
              }`}
            >
              {t('all_tags')}
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all duration-300 ${
                  activeTag === tag
                    ? 'bg-gradient-to-r from-primary-600 to-accent-500 border-transparent text-white shadow-lg'
                    : 'glass border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-primary-500/30 shadow-sm'
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
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={60} className="text-gray-300 dark:text-gray-800 mx-auto mb-6" />
            <p className="text-gray-500 text-xl font-bold uppercase tracking-widest italic">{t('no_posts')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link href={`/${locale}/blog/${post.slug}`}>
                  <div className="glass rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden hover:border-primary-500/30 transition-all duration-500 group h-full flex flex-col shadow-sm hover:shadow-2xl hover:-translate-y-2 bg-white dark:bg-transparent">
                    {/* Image */}
                    <div className="h-52 bg-gradient-to-br from-primary-900/40 to-accent-900/40 overflow-hidden relative">
                      {post.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={40} className="text-primary-500/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      {/* Tags */}
                      {(post.tags || []).length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest glass rounded-full text-primary-600 dark:text-primary-400 border border-primary-500/20 shadow-sm">
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <h2 className="text-gray-950 dark:text-white font-black text-xl mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 uppercase tracking-tight italic">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-1 line-clamp-3 font-medium">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                          <Calendar size={12} className="text-primary-500" />
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                            : new Date(post.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <span className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-widest group-hover:gap-2.5 transition-all">
                          {t('read')} <ArrowRight size={14} />
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
