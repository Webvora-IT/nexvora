'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Star, Eye, EyeOff, Loader2, X, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminShell from '../AdminShell'

const fetcher = (url: string) => fetch(url).then(r => r.json())

interface Testimonial {
  id: string; name: string; company: string; position: string;
  content: string; rating: number; avatar?: string; published: boolean
}

const defaultForm = { name: '', company: '', position: '', content: '', rating: 5, avatar: '', published: true }

export default function TestimonialsPage() {
  const { data: items = [], mutate, isLoading } = useSWR<Testimonial[]>('/api/admin/testimonials', fetcher)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setEditing(null); setForm(defaultForm); setShowForm(true) }
  const openEdit = (t: Testimonial) => { setEditing(t); setForm({ ...t }); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditing(null) }

  const save = async () => {
    if (!form.name || !form.content) {
      toast.error('Name and content are required')
      return
    }
    setSaving(true)
    try {
      const url = editing ? `/api/admin/testimonials/${editing.id}` : '/api/admin/testimonials'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast.success(editing ? 'Testimonial updated!' : 'Testimonial added!')
      mutate()
      closeForm()
    } catch {
      toast.error('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Deleted')
      mutate()
    } catch {
      toast.error('Failed to delete testimonial')
    }
  }

  const togglePublish = async (t: Testimonial) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...t, published: !t.published }),
      })
      if (!res.ok) throw new Error()
      mutate()
    } catch {
      toast.error('Failed to update testimonial')
    }
  }

  return (
    <AdminShell>
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-black text-gray-950 dark:text-white uppercase tracking-tighter italic">Testimonials</h1>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                {(items as Testimonial[]).filter(t => t.published).length} published
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCreate}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary-500/20 transition-all font-bold"
            >
              <Plus size={18} /> Add Testimonial
            </motion.button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
            </div>
          ) : (
             <div className="space-y-4">
              {(items as Testimonial[]).map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass rounded-[2rem] p-6 border transition-all shadow-xl bg-white dark:bg-transparent ${t.published ? 'border-gray-200 dark:border-white/10' : 'border-gray-300 dark:border-white/5 opacity-60'}`}
                >
114:                   <div className="flex items-start justify-between gap-6">
                     <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="font-black text-gray-950 dark:text-white uppercase tracking-tight italic">{t.name}</span>
                        <span className="text-gray-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest">{t.position} @ {t.company}</span>
                        <div className="flex gap-1">
                          {Array.from({ length: t.rating }).map((_, j) => (
                            <Star key={j} size={14} className="text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-medium italic">{t.content}</p>
                    </div>
                     <div className="flex items-center gap-3 flex-shrink-0">
                      <button
                        onClick={() => togglePublish(t)}
                        className={`p-2.5 rounded-xl transition-all shadow-sm ${t.published ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 hover:scale-110' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:scale-110'}`}
                      >
                        {t.published ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button
                        onClick={() => openEdit(t)}
                        className="p-2.5 bg-primary-100 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:scale-110 rounded-xl transition-all shadow-sm"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => remove(t.id)}
                        className="p-2.5 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:scale-110 rounded-xl transition-all shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {(items as Testimonial[]).length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <Star size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No testimonials yet.</p>
                </div>
              )}
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
              className="glass rounded-[2rem] border border-gray-200 dark:border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-[#030617]/95 shadow-2xl"
            >
              <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-white/10">
                <h2 className="font-black text-gray-950 dark:text-white uppercase tracking-tighter text-2xl italic">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>
                <button onClick={closeForm} className="p-3 bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-950 dark:hover:text-white rounded-2xl transition-all">
                  <X size={20} />
                </button>
              </div>
               <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Name *', key: 'name' },
                    { label: 'Company', key: 'company' },
                    { label: 'Position', key: 'position' },
                  ].map(({ label, key }) => (
                    <div key={key} className={key === 'name' ? 'col-span-2' : ''}>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">{label}</label>
                      <input
                        value={(form as any)[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold tracking-tight"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Rating</label>
                    <select
                      value={form.rating}
                      onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-600 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold"
                    >
                      {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                  </div>
                </div>
                 <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Content *</label>
                  <textarea
                    rows={4}
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    placeholder="Testimonial content..."
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none font-medium leading-relaxed italic"
                  />
                </div>
                 <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                    className={`relative w-12 h-7 rounded-full transition-all ${form.published ? 'bg-green-500' : 'bg-gray-300 dark:bg-white/10'}`}
                  >
                    <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${form.published ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">{form.published ? 'Published' : 'Hidden'}</span>
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
                  {saving ? 'Saving...' : 'Save Feedback'}
                </motion.button>
                <button 
                  onClick={closeForm} 
                  className="flex-1 px-6 py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white transition-all font-bold"
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
