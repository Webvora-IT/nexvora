'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff, Search, BookOpen, Loader2, X, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminShell from '../AdminShell'

const fetcher = (url: string) => fetch(url).then(r => r.json())

interface BlogPost {
  id: string; title: string; slug: string; excerpt: string; content: string;
  image?: string; tags: string[]; published: boolean; publishedAt?: string; createdAt: string
}

const defaultForm = { title: '', slug: '', excerpt: '', content: '', image: '', tags: [] as string[], published: false }

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function BlogPage() {
  const { data: posts = [], mutate, isLoading } = useSWR<BlogPost[]>('/api/admin/blog', fetcher)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setEditing(null); setForm(defaultForm); setShowForm(true) }
  const openEdit = (p: BlogPost) => { setEditing(p); setForm({ ...p }); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditing(null) }

  const save = async () => {
    if (!form.title || !form.slug) {
      toast.error('Title and slug are required')
      return
    }
    setSaving(true)
    try {
      const url = editing ? `/api/admin/blog/${editing.id}` : '/api/admin/blog'
      const method = editing ? 'PUT' : 'POST'
      const payload = {
        ...form,
        publishedAt: form.published && !editing?.publishedAt ? new Date().toISOString() : (editing?.publishedAt ?? null),
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      toast.success(editing ? 'Post updated!' : 'Post created!')
      mutate()
      closeForm()
    } catch {
      toast.error('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this post?')) return
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Deleted')
      mutate()
    } catch {
      toast.error('Failed to delete post')
    }
  }

  const togglePublish = async (p: BlogPost) => {
    try {
      const res = await fetch(`/api/admin/blog/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...p,
          published: !p.published,
          publishedAt: !p.published ? new Date().toISOString() : p.publishedAt,
        }),
      })
      if (!res.ok) throw new Error()
      mutate()
    } catch {
      toast.error('Failed to update post')
    }
  }

  const addTag = () => {
    if (tagInput.trim()) {
      setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }))
      setTagInput('')
    }
  }

  const filtered = (posts as BlogPost[]).filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminShell>
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
              <p className="text-gray-400 text-sm">
                {(posts as BlogPost[]).filter(p => p.published).length} published,{' '}
                {(posts as BlogPost[]).filter(p => !p.published).length} drafts
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={openCreate}
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
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
            </div>
          ) : (
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
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
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
                          {(post.tags || []).map(tag => (
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
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('fr-FR') : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => togglePublish(post)}
                            className={`p-1.5 rounded-lg transition-colors ${post.published ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-500 hover:bg-white/5'}`}
                          >
                            {post.published ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button
                            onClick={() => openEdit(post)}
                            className="p-1.5 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => remove(post.id)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                        No posts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="font-bold text-white text-lg">{editing ? 'Edit Post' : 'New Post'}</h2>
                <button onClick={closeForm} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Title *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Slug *</label>
                  <input
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Excerpt</label>
                  <textarea
                    rows={2}
                    value={form.excerpt}
                    onChange={e => setForm({ ...form, excerpt: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Content</label>
                  <textarea
                    rows={6}
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="AI, DevOps..."
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500"
                    />
                    <button type="button" onClick={addTag} className="px-3 py-2 bg-primary-600 rounded-xl text-sm text-white">+</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((tag, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-primary-500/20 text-primary-300 text-sm rounded-full border border-primary-500/30">
                        {tag}
                        <button type="button" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter((_, j) => j !== i) }))} className="text-primary-400 hover:text-white">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${form.published ? 'bg-primary-500' : 'bg-white/10'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm text-gray-300">{form.published ? 'Published' : 'Draft'}</span>
                </div>
              </div>
              <div className="flex gap-3 p-6 border-t border-white/10">
                <motion.button
                  onClick={save}
                  disabled={saving}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-500 rounded-xl text-sm font-semibold text-white disabled:opacity-70"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? 'Saving...' : 'Save'}
                </motion.button>
                <button onClick={closeForm} className="px-5 py-2.5 glass border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminShell>
  )
}
