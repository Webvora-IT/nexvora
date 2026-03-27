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
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Deleted')
      mutate()
    } catch {
      toast.error('Failed to delete project')
    }
  }

  const togglePublished = async (p: Project) => {
    try {
      const res = await fetch(`/api/admin/projects/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...p, published: !p.published }),
      })
      if (!res.ok) throw new Error()
      mutate()
    } catch {
      toast.error('Failed to update project')
    }
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
              <h1 className="text-3xl font-black text-gray-950 dark:text-white uppercase tracking-tighter italic">Projects</h1>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">{(projects as Project[]).length} total projects</p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary-500/20 hover:scale-105 transition-all"
            >
              <Plus size={18} /> Add Project
            </button>
          </div>

          {/* Search & Filter */}
           <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-12 pr-6 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 shadow-sm transition-all font-medium"
              />
            </div>
             <div className="flex gap-2 flex-wrap">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
                    activeCategory === cat
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20 scale-105'
                      : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:text-gray-950 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
           <div className="glass rounded-[2rem] border border-gray-200 dark:border-white/10 overflow-hidden shadow-xl bg-white dark:bg-transparent">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
                    <th className="text-left text-[10px] font-black text-gray-500 uppercase tracking-widest px-6 py-4">Project</th>
                    <th className="text-left text-[10px] font-black text-gray-500 uppercase tracking-widest px-6 py-4 hidden md:table-cell">Category</th>
                    <th className="text-left text-[10px] font-black text-gray-500 uppercase tracking-widest px-6 py-4 hidden lg:table-cell">Client</th>
                    <th className="text-left text-[10px] font-black text-gray-500 uppercase tracking-widest px-6 py-4">Status</th>
                    <th className="text-left text-[10px] font-black text-gray-500 uppercase tracking-widest px-6 py-4">Featured</th>
                    <th className="text-right text-[10px] font-black text-gray-500 uppercase tracking-widest px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((project, i) => (
                     <motion.tr
                      key={project.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <FolderOpen size={18} className="text-white" />
                          </div>
                          <span className="text-gray-950 dark:text-white font-bold text-sm tracking-tight">{project.title}</span>
                        </div>
                      </td>
                       <td className="px-6 py-5 hidden md:table-cell">
                        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-full">
                          {project.category}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest hidden lg:table-cell">
                        {project.client || '—'}
                      </td>
                       <td className="px-6 py-5">
                        <button
                          onClick={() => togglePublished(project)}
                          className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm transition-all ${
                            project.published
                              ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30 hover:scale-105'
                              : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-500/30 hover:scale-105'
                          }`}
                        >
                          {project.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                       <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm ${
                          project.featured
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30'
                            : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-500/10 dark:text-gray-500 dark:border-white/5'
                        }`}>
                          {project.featured ? '★ Featured' : 'Regular'}
                        </span>
                      </td>
                       <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(project)}
                            className="p-2 bg-primary-100 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:scale-110 rounded-xl transition-all shadow-sm"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => remove(project.id)}
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
              className="glass rounded-[2rem] border border-gray-200 dark:border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#030617]/95 shadow-2xl"
            >
              <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-white/10">
                <h2 className="font-black text-gray-950 dark:text-white uppercase tracking-tighter text-2xl italic">{editing ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={closeForm} className="p-3 bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-950 dark:hover:text-white rounded-2xl transition-all">
                  <X size={20} />
                </button>
              </div>
               <div className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Title *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold tracking-tight"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Description *</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none leading-relaxed"
                  />
                </div>
                 <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Category *</label>
                    <select
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-600 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Client</label>
                    <input
                      value={form.client}
                      onChange={e => setForm({ ...form, client: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                </div>
                 <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Project URL</label>
                  <input
                    value={form.url}
                    onChange={e => setForm({ ...form, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-primary-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-mono"
                  />
                </div>
                 <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Tags</label>
                  <div className="flex gap-3 mb-3">
                    <input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="React, Node.js..."
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
                 <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                      className={`relative w-12 h-7 rounded-full transition-all ${form.published ? 'bg-green-500' : 'bg-gray-300 dark:bg-white/10'}`}
                    >
                      <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${form.published ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">Published</span>
                  </label>
                  <label className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                      className={`relative w-12 h-7 rounded-full transition-all ${form.featured ? 'bg-yellow-500 shadow-glow' : 'bg-gray-300 dark:bg-white/10'}`}
                    >
                      <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${form.featured ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">Featured</span>
                  </label>
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
                  {saving ? 'Saving...' : 'Save Project'}
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
