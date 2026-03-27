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
              <h1 className="text-3xl font-black text-gray-950 dark:text-white uppercase tracking-tighter italic">Blog Posts</h1>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                {(posts as BlogPost[]).filter(p => p.published).length} published,{' '}
                {(posts as BlogPost[]).filter(p => !p.published).length} drafts
              </p>
            </div>
             <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary-500/20"
            >
              <Plus size={18} /> New Post
            </motion.button>
          </div>

          {/* Search */}
           <div className="relative mb-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-12 pr-6 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 shadow-sm transition-all font-medium"
            />
          </div>

          {/* Posts */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
            </div>
          ) : (
             <div className="glass rounded-[2rem] border border-gray-200 dark:border-white/10 overflow-hidden shadow-xl bg-white dark:bg-transparent">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
                    <th className="text-left text-[10px] font-black text-gray-500 uppercase tracking-widest px-6 py-4">Title</th>
                    <th className="text-left text-[10px] font-black text-gray-500 uppercase tracking-widest px-6 py-4 hidden md:table-cell">Tags</th>
                    <th className="text-left text-[10px] font-black text-gray-500 uppercase tracking-widest px-6 py-4">Status</th>
                    <th className="text-left text-[10px] font-black text-gray-500 uppercase tracking-widest px-6 py-4 hidden lg:table-cell">Date</th>
                    <th className="text-right text-[10px] font-black text-gray-500 uppercase tracking-widest px-6 py-4">Actions</th>
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
                       <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <BookOpen size={18} className="text-white" />
                          </div>
                          <div>
                            <div className="text-gray-950 dark:text-white font-bold text-sm tracking-tight">{post.title}</div>
                            <div className="text-gray-500 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest">/{post.slug}</div>
                          </div>
                        </div>
                      </td>
                       <td className="px-6 py-5 hidden md:table-cell">
                        <div className="flex gap-2 flex-wrap">
                          {(post.tags || []).map(tag => (
                            <span key={tag} className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                       <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm ${
                          post.published
                            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest hidden lg:table-cell">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('fr-FR') : '—'}
                      </td>
                       <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => togglePublish(post)}
                            className={`p-2 rounded-xl transition-all shadow-sm ${post.published ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 hover:scale-110' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-950 dark:hover:text-white hover:scale-110'}`}
                          >
                            {post.published ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          <button
                            onClick={() => openEdit(post)}
                            className="p-2 bg-primary-100 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:scale-110 rounded-xl transition-all shadow-sm"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => remove(post.id)}
                            className="p-2 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:scale-110 rounded-xl transition-all shadow-sm"
                          >
                            <Trash2 size={16} />
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
              className="glass rounded-[2rem] border border-gray-200 dark:border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#030617]/95 shadow-2xl"
            >
              <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-white/10">
                <h2 className="font-black text-gray-950 dark:text-white uppercase tracking-tighter text-2xl italic">{editing ? 'Edit Post' : 'New Post'}</h2>
                <button onClick={closeForm} className="p-3 bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-950 dark:hover:text-white rounded-2xl transition-all">
                  <X size={20} />
                </button>
              </div>
               <div className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Title *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold tracking-tight"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Slug *</label>
                  <input
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-600 dark:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Excerpt</label>
                  <textarea
                    rows={2}
                    value={form.excerpt}
                    onChange={e => setForm({ ...form, excerpt: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Content</label>
                  <textarea
                    rows={8}
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
                  />
                </div>
                 <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Tags</label>
                  <div className="flex gap-3 mb-3">
                    <input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="AI, DevOps..."
                      className="flex-1 px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                    <button type="button" onClick={addTag} className="px-5 py-3 bg-primary-600 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20">+</button>
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
                 <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                    className={`relative w-12 h-7 rounded-full transition-all ${form.published ? 'bg-green-500 shadow-glow' : 'bg-gray-300 dark:bg-white/10'}`}
                  >
                    <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${form.published ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300">{form.published ? 'Published' : 'Draft'}</span>
                </div>
              </div>
              <div className="flex gap-4 p-8 border-t border-gray-100 dark:border-white/10">
                 <motion.button
                  onClick={save}
                  disabled={saving}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary-500/20 disabled:opacity-70 transition-all font-bold"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {saving ? 'Saving...' : 'Save Post'}
                </motion.button>
                <button 
                  onClick={closeForm} 
                  className="flex-1 px-6 py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white transition-all"
                >
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
