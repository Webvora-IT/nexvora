'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Tag, ArrowLeft } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string
  tags: string[]
  publishedAt?: string
  createdAt: string
}

export default function BlogPostClient({ initialPost }: { initialPost: BlogPost }) {
  const t = useTranslations('blog')
  const locale = useLocale()

  return (
    <main className="min-h-screen bg-white dark:bg-[#030617] transition-colors duration-500">
      <Navbar />

      <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
          <Link href={`/${locale}/blog`} className="inline-flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white text-sm font-black uppercase tracking-widest transition-all hover:-translate-x-1">
            <ArrowLeft size={16} />
            {t('back')}
          </Link>
        </motion.div>

        <motion.article 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y : 0 }} 
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Tags */}
          {(initialPost.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {initialPost.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest glass rounded-full text-primary-600 dark:text-primary-400 border border-primary-500/20 shadow-sm">
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-gray-950 dark:text-white mb-8 leading-tight tracking-tighter uppercase italic">
            {initialPost.title}
          </h1>

          {/* Date */}
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-500 text-sm mb-12 font-bold uppercase tracking-widest">
            <Calendar size={16} className="text-primary-500" />
            <span>
              {initialPost.publishedAt
                ? new Date(initialPost.publishedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                : new Date(initialPost.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Hero image */}
          {initialPost.image && (
            <div className="rounded-[2.5rem] overflow-hidden mb-16 h-64 md:h-[500px] shadow-2xl border border-gray-200 dark:border-white/10 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={initialPost.image} alt={initialPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
          )}

          {/* Excerpt */}
          {initialPost.excerpt && (
            <p className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 leading-relaxed mb-16 p-10 glass rounded-[2.5rem] border border-gray-200 dark:border-white/10 border-l-[10px] border-l-primary-500 shadow-sm font-medium italic">
              {initialPost.excerpt}
            </p>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none transition-colors duration-500
              dark:prose-invert
              prose-headings:text-gray-950 dark:prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:italic
              prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8
              prose-h3:text-3xl prose-h3:mt-12 prose-h3:mb-6
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-8 prose-p:text-xl prose-p:font-medium
              prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline prose-a:font-black
              prose-strong:text-gray-950 dark:prose-strong:text-white prose-strong:font-black
              prose-code:text-primary-600 dark:prose-code:text-accent-400 prose-code:bg-gray-100 dark:prose-code:bg-white/5 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-gray-950 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-[2rem] prose-pre:shadow-2xl prose-pre:p-8
              prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-ol:text-gray-700 dark:prose-ol:text-gray-300
              prose-li:mb-3 prose-li:text-lg
              prose-blockquote:border-l-primary-500 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-blockquote:italic prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-white/2 prose-blockquote:p-10 prose-blockquote:rounded-r-3xl prose-blockquote:text-2xl"
            dangerouslySetInnerHTML={{ __html: initialPost.content }}
          />

          {/* Footer CTA */}
          <div className="mt-24 pt-12 border-t border-gray-200 dark:border-white/10 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-8 font-medium text-xl italic tracking-tight">{t('project_prompt')}</p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full text-white font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl hover:shadow-primary-500/30 hover:-translate-y-1 active:scale-95"
            >
              {t('contact_us')}
            </a>
          </div>
        </motion.article>
      </div>

      <Footer />
    </main>
  )
}
