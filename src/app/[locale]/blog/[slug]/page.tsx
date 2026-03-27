'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Tag, ArrowLeft, BookOpen } from 'lucide-react'
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

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const t = useTranslations('blog')
  const locale = useLocale()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/blog/${params.slug}`)
      .then(r => {
        if (!r.ok) { setNotFound(true); setLoading(false); return null }
        return r.json()
      })
      .then(data => { if (data) { setPost(data); setLoading(false) } })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [params.slug])

  return (
    <main className="min-h-screen bg-[#0a0a14]">
      <Navbar />

      <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link href={`/${locale}/blog`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} />
            {t('back')}
          </Link>
        </motion.div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-white/5 rounded-xl w-3/4" />
            <div className="h-4 bg-white/5 rounded-xl w-1/2" />
            <div className="h-64 bg-white/5 rounded-2xl mt-6" />
            <div className="space-y-3 mt-6">
              {[...Array(8)].map((_, i) => <div key={i} className="h-4 bg-white/5 rounded-xl" />)}
            </div>
          </div>
        ) : notFound || !post ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">{t('not_found_title')}</h2>
            <p className="text-gray-400 mb-6">{t('not_found_desc')}</p>
            <Link href={`/${locale}/blog`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full text-white text-sm font-semibold">
              <ArrowLeft size={16} />
              {t('view_all')}
            </Link>
          </div>
        ) : (
          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y : 0 }} transition={{ duration: 0.6 }}>
            {/* Tags */}
            {(post.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 text-xs glass rounded-full text-primary-400 border border-primary-500/20">
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Date */}
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-8">
              <Calendar size={14} />
              <span>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                  : new Date(post.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            {/* Hero image */}
            {post.image && (
              <div className="rounded-2xl overflow-hidden mb-10 h-64 md:h-96">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-300 leading-relaxed mb-8 p-6 glass rounded-2xl border border-white/10 border-l-4 border-l-primary-500">
                {post.excerpt}
              </p>
            )}

            {/* Content */}
            <div
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-primary-400 prose-a:no-underline hover:prose-a:text-primary-300
                prose-strong:text-white
                prose-code:text-accent-400 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
                prose-ul:text-gray-300 prose-ol:text-gray-300
                prose-li:mb-1
                prose-blockquote:border-l-primary-500 prose-blockquote:text-gray-400"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Footer CTA */}
            <div className="mt-16 pt-8 border-t border-white/10 text-center">
              <p className="text-gray-400 mb-4">{t('project_prompt')}</p>
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
              >
                {t('contact_us')}
              </a>
            </div>
          </motion.article>
        )}
      </div>

      <Footer />
    </main>
  )
}
