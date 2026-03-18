'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff, Search, BookOpen } from 'lucide-react'

const posts = [
  { id: '1', title: 'The Future of AI in Business Automation', slug: 'future-ai-business', excerpt: 'How artificial intelligence is reshaping how companies operate...', tags: ['AI', 'Automation'], published: true, publishedAt: '2024-03-01' },
  { id: '2', title: 'DevOps Best Practices for 2024', slug: 'devops-best-practices-2024', excerpt: 'Key strategies for building robust CI/CD pipelines...', tags: ['DevOps', 'Cloud'], published: true, publishedAt: '2024-02-15' },
  { id: '3', title: 'Building Scalable Next.js Apps', slug: 'scalable-nextjs-apps', excerpt: 'Architecture patterns for enterprise Next.js applications...', tags: ['Next.js', 'Architecture'], published: false, publishedAt: null },
  { id: '4', title: 'React Native vs Flutter in 2024', slug: 'react-native-vs-flutter', excerpt: 'A comprehensive comparison of cross-platform frameworks...', tags: ['Mobile', 'React Native'], published: true, publishedAt: '2024-01-20' },
]

export default function BlogPage() {
  const [items, setItems] = useState(posts)
  const [search, setSearch] = useState('')

  const filtered = items.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#050510] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <button className="p-2 glass rounded-lg text-gray-400 hover:text-white border border-white/10">
                <ArrowLeft size={18} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
              <p className="text-gray-400 text-sm">{items.filter(p => p.published).length} published, {items.filter(p => !p.published).length} drafts</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-500 rounded-xl text-sm font-medium text-white"
          >
            <Plus size={16} /> New Post
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Posts */}
        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-gray-500 uppercase px-5 py-3">Title</th>
                <th className="text-left text-xs text-gray-500 uppercase px-5 py-3 hidden md:table-cell">Tags</th>
                <th className="text-left text-xs text-gray-500 uppercase px-5 py-3">Status</th>
                <th className="text-left text-xs text-gray-500 uppercase px-5 py-3 hidden lg:table-cell">Date</th>
                <th className="text-right text-xs text-gray-500 uppercase px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post, i) => (
                <motion.tr
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                        <BookOpen size={14} className="text-primary-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{post.title}</div>
                        <div className="text-gray-500 text-xs">/{post.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="flex gap-1.5 flex-wrap">
                      {post.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 text-xs glass rounded-full text-gray-400 border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full border ${
                      post.published
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs hidden lg:table-cell">
                    {post.publishedAt || '—'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className={`p-1.5 rounded-lg transition-colors ${post.published ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-500 hover:bg-white/5'}`}>
                        {post.published ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors">
                        <Edit size={14} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
