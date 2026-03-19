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
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    toast.success('Deleted')
    mutate()
  }

  const togglePublish = async (t: Testimonial) => {
    await fetch(`/api/admin/testimonials/${t.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...t, published: !t.published }),
    })
    mutate()
  }

  return (
    <AdminShell>
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Testimonials</h1>
              <p className="text-gray-400 text-sm">
                {(items as Testimonial[]).filter(t => t.published).length} published
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-500 rounded-xl text-sm font-medium text-white"
            >
              <Plus size={16} /> Add Testimonial
            </motion.button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {(items as Testimonial[]).map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass rounded-xl p-5 border transition-all ${t.published ? 'border-white/10' : 'border-white/5 opacity-60'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-white">{t.name}</span>
                        <span className="text-gray-400 text-sm">{t.position} @ {t.company}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: t.rating }).map((_, j) => (
                            <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">{t.content}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => togglePublish(t)}
                        className={`p-1.5 rounded-lg transition-colors ${t.published ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-500 hover:bg-white/5'}`}
                      >
                        {t.published ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        onClick={() => openEdit(t)}
                        className="p-1.5 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => remove(t.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
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
              className="glass rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="font-bold text-white text-lg">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>
                <button onClick={closeForm} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Name *', key: 'name' },
                    { label: 'Company', key: 'company' },
                    { label: 'Position', key: 'position' },
                  ].map(({ label, key }) => (
                    <div key={key} className={key === 'name' ? 'col-span-2' : ''}>
                      <label className="block text-sm text-gray-400 mb-2">{label}</label>
                      <input
                        value={(form as any)[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Rating</label>
                    <select
                      value={form.rating}
                      onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-[#0f0f1a] border border-white/10 rounded-xl text-gray-300 text-sm focus:outline-none focus:border-primary-500"
                    >
                      {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Content *</label>
                  <textarea
                    rows={4}
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    placeholder="Testimonial content..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${form.published ? 'bg-primary-500' : 'bg-white/10'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm text-gray-300">{form.published ? 'Published' : 'Hidden'}</span>
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
