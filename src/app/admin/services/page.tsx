'use client'

import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff, Loader2, X, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const defaultService = {
  title: '', description: '', icon: 'Globe', features: [] as string[],
  price: '', published: true, order: 0,
}

export default function AdminServicesPage() {
  const { data: services, mutate } = useSWR('/api/admin/services', fetcher)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(defaultService)
  const [featureInput, setFeatureInput] = useState('')
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setEditing(null); setForm(defaultService); setShowForm(true) }
  const openEdit = (s: any) => { setEditing(s); setForm(s); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditing(null) }

  const save = async () => {
    setSaving(true)
    try {
      const url = editing ? `/api/admin/services/${editing.id}` : '/api/admin/services'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      toast.success(editing ? 'Service mis à jour!' : 'Service créé!')
      mutate()
      closeForm()
    } catch {
      toast.error('Une erreur est survenue')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer ce service ?')) return
    await fetch(`/api/admin/services/${id}`, { method: 'DELETE' })
    toast.success('Service supprimé')
    mutate()
  }

  const toggle = async (s: any) => {
    await fetch(`/api/admin/services/${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...s, published: !s.published }),
    })
    mutate()
  }

  const addFeature = () => {
    if (featureInput.trim()) {
      setForm(f => ({ ...f, features: [...(f.features || []), featureInput.trim()] }))
      setFeatureInput('')
    }
  }

  const removeFeature = (i: number) => {
    setForm(f => ({ ...f, features: (f.features || []).filter((_: any, idx: number) => idx !== i) }))
  }

  return (
    <div className="min-h-screen bg-[#050510] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin"><button className="p-2 glass rounded-lg text-gray-400 hover:text-white border border-white/10"><ArrowLeft size={18} /></button></Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Services</h1>
              <p className="text-gray-400 text-sm">{services?.length || 0} services configurés</p>
            </div>
          </div>
          <motion.button onClick={openCreate} whileHover={{ scale: 1.02 }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-500 rounded-xl text-sm font-medium text-white">
            <Plus size={16} /> Ajouter un Service
          </motion.button>
        </div>

        {/* Services grid */}
        {!services ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-primary-400" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s: any, i: number) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`glass rounded-2xl p-5 border transition-all ${s.published ? 'border-white/10' : 'border-white/5 opacity-60'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                    {s.title[0]}
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => toggle(s)} className={`p-1.5 rounded-lg transition-colors ${s.published ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-500 hover:bg-white/5'}`}>
                      {s.published ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => openEdit(s)} className="p-1.5 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"><Edit size={14} /></button>
                    <button onClick={() => remove(s.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
                <h3 className="font-bold text-white mb-1">{s.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{s.description}</p>
                {s.features?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.features.slice(0, 3).map((f: string, j: number) => (
                      <span key={j} className="px-2 py-0.5 text-xs glass rounded-full text-gray-400 border border-white/10">{f}</span>
                    ))}
                    {s.features.length > 3 && <span className="px-2 py-0.5 text-xs text-gray-500">+{s.features.length - 3}</span>}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="glass rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="font-bold text-white text-lg">{editing ? 'Modifier le Service' : 'Nouveau Service'}</h2>
                  <button onClick={closeForm} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-400 mb-2">Titre *</label>
                      <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-400 mb-2">Description *</label>
                      <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Icône (lucide-react)</label>
                      <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})}
                        placeholder="Globe, Brain, Shield..."
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Prix</label>
                      <input value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                        placeholder="À partir de €2999"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-400 mb-2">Fonctionnalités</label>
                      <div className="flex gap-2 mb-2">
                        <input value={featureInput} onChange={e => setFeatureInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                          placeholder="Ajouter une fonctionnalité..."
                          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" />
                        <button type="button" onClick={addFeature} className="px-3 py-2 bg-primary-600 rounded-xl text-sm text-white">+</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(form.features || []).map((f: string, i: number) => (
                          <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-primary-500/20 text-primary-300 text-sm rounded-full border border-primary-500/30">
                            {f}
                            <button type="button" onClick={() => removeFeature(i)} className="text-primary-400 hover:text-white"><X size={12} /></button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setForm({...form, published: !form.published})}
                        className={`relative w-11 h-6 rounded-full transition-colors ${form.published ? 'bg-primary-500' : 'bg-white/10'}`}>
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <span className="text-sm text-gray-300">{form.published ? 'Publié' : 'Masqué'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 p-6 border-t border-white/10">
                  <motion.button onClick={save} disabled={saving} whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-500 rounded-xl text-sm font-semibold text-white disabled:opacity-70">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </motion.button>
                  <button onClick={closeForm} className="px-5 py-2.5 glass border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white">Annuler</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
