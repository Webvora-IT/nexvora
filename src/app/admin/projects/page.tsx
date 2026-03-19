'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Search, FolderOpen, Loader2, X, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminShell from '../AdminShell'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const categories = ['Web App', 'Mobile', 'AI/ML', 'DevOps', 'Automation', 'Cybersecurity']

interface Project {
  id: string; title: string; description: string; category: string;
  client?: string; url?: string; image?: string; tags: string[];
  featured: boolean; published: boolean; createdAt: string
}

const defaultProject = {
  title: '', description: '', category: 'Web App', client: '', url: '',
  image: '', tags: [] as string[], featured: false, published: true,
}

export default function ProjectsPage() {
  const { data: projects = [], mutate, isLoading } = useSWR<Project[]>('/api/admin/projects', fetcher)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState(defaultProject)
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setEditing(null); setForm(defaultProject); setShowForm(true) }
  const openEdit = (p: Project) => { setEditing(p); setForm({ ...p }); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditing(null) }

  const save = async () => {
    if (!form.title || !form.description) {
      toast.error('Title and description are required')
      return
    }
    setSaving(true)
    try {
      const url = editing ? `/api/admin/projects/${editing.id}` : '/api/admin/projects'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      toast.success(editing ? 'Project updated!' : 'Project created!')
      mutate()
      closeForm()
    } catch {
      toast.error('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    toast.success('Deleted')
    mutate()
  }

  const togglePublished = async (p: Project) => {
    await fetch(`/api/admin/projects/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...p, published: !p.published }),
    })
    mutate()
  }

  const addTag = () => {
    if (tagInput.trim()) {
      setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }))
      setTagInput('')
    }
  }

  const allCategories = ['All', ...categories]
  const filtered = (projects as Project[]).filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <AdminShell>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Projects</h1>
              <p className="text-gray-400 text-sm">{(projects as Project[]).length} total projects</p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-500 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              <Plus size={16} /> Add Project
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-primary-600 text-white'
                      : 'glass text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-xs text-gray-500 uppercase px-5 py-3">Project</th>
                    <th className="text-left text-xs text-gray-500 uppercase px-5 py-3 hidden md:table-cell">Category</th>
                    <th className="text-left text-xs text-gray-500 uppercase px-5 py-3 hidden lg:table-cell">Client</th>
                    <th className="text-left text-xs text-gray-500 uppercase px-5 py-3">Status</th>
                    <th className="text-left text-xs text-gray-500 uppercase px-5 py-3">Featured</th>
                    <th className="text-right text-xs text-gray-500 uppercase px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((project, i) => (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                            <FolderOpen size={16} className="text-primary-400" />
                          </div>
                          <span className="text-white font-medium text-sm">{project.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="px-2.5 py-1 text-xs glass rounded-full text-gray-400 border border-white/10">
                          {project.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-sm hidden lg:table-cell">
                        {project.client || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => togglePublished(project)}
                          className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                            project.published
                              ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'
                              : 'bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30'
                          }`}
                        >
                          {project.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 text-xs rounded-full border ${
                          project.featured
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}>
                          {project.featured ? '★ Featured' : 'Regular'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(project)}
                            className="p-1.5 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => remove(project.id)}
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
                      <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                        No projects found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
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
                <h2 className="font-bold text-white text-lg">{editing ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={closeForm} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Title *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description *</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Category *</label>
                    <select
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#0f0f1a] border border-white/10 rounded-xl text-gray-300 text-sm focus:outline-none focus:border-primary-500"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Client</label>
                    <input
                      value={form.client}
                      onChange={e => setForm({ ...form, client: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Project URL</label>
                  <input
                    value={form.url}
                    onChange={e => setForm({ ...form, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="React, Node.js..."
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
                <div className="flex gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${form.published ? 'bg-primary-500' : 'bg-white/10'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className="text-sm text-gray-300">Published</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${form.featured ? 'bg-yellow-500' : 'bg-white/10'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className="text-sm text-gray-300">Featured</span>
                  </label>
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
