'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, X, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'
import AdminShell from '../AdminShell'

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
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Service supprimé')
      mutate()
    } catch { toast.error('Erreur lors de la suppression') }
  }

  const toggle = async (s: any) => {
    try {
      const res = await fetch(`/api/admin/services/${s.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...s, published: !s.published }),
      })
      if (!res.ok) throw new Error()
      mutate()
    } catch { toast.error('Erreur lors de la mise à jour') }
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
    <AdminShell>
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-950 dark:text-white uppercase tracking-tighter italic">Services</h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">{services?.length || 0} services configurés</p>
          </div>
          <motion.button 
            onClick={openCreate} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary-500/20 transition-all"
          >
            <Plus size={18} /> Ajouter un Service
          </motion.button>
        </div>

        {/* Services grid */}
        {!services ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-primary-400" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {services.map((s: any, i: number) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`glass rounded-[2rem] p-6 border transition-all shadow-xl bg-white dark:bg-transparent ${s.published ? 'border-gray-200 dark:border-white/10' : 'border-gray-300 dark:border-white/5 opacity-60'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg shadow-primary-500/20">
                    {s.title[0]}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggle(s)} className={`p-2 rounded-xl transition-all shadow-sm ${s.published ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 hover:scale-110' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:scale-110'}`}>
                      {s.published ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button onClick={() => openEdit(s)} className="p-2 bg-primary-100 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:scale-110 rounded-xl transition-all shadow-sm"><Edit size={16} /></button>
                    <button onClick={() => remove(s.id)} className="p-2 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:scale-110 rounded-xl transition-all shadow-sm"><Trash2 size={16} /></button>
                  </div>
                </div>
                 <h3 className="font-black text-gray-950 dark:text-white mb-2 tracking-tight uppercase text-lg italic">{s.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed font-medium">{s.description}</p>
                 {s.features?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {s.features.slice(0, 3).map((f: string, j: number) => (
                      <span key={j} className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-full">{f}</span>
                    ))}
                    {s.features.length > 3 && <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary-500">+{s.features.length - 3}</span>}
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
                className="glass rounded-[2rem] border border-gray-200 dark:border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#030617]/95 shadow-2xl">
                <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-white/10">
                  <h2 className="font-black text-gray-950 dark:text-white uppercase tracking-tighter text-2xl italic">{editing ? 'Modifier le Service' : 'Nouveau Service'}</h2>
                  <button onClick={closeForm} className="p-3 bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-950 dark:hover:text-white rounded-2xl transition-all"><X size={20} /></button>
                </div>
                <div className="p-8 space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Titre *</label>
                      <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold tracking-tight" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Description *</label>
                      <textarea rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none leading-relaxed" />
                    </div>
                     <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Icône (lucide-react)</label>
                      <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})}
                        placeholder="Globe, Brain, Shield..."
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Prix</label>
                      <input value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                        placeholder="À partir de €2999"
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-primary-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold" />
                    </div>
                     <div className="col-span-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Fonctionnalités</label>
                      <div className="flex gap-3 mb-3">
                        <input value={featureInput} onChange={e => setFeatureInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                          placeholder="Ajouter une fonctionnalité..."
                          className="flex-1 px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                        <button type="button" onClick={addFeature} className="px-5 py-3 bg-primary-600 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20">+</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(form.features || []).map((f: string, i: number) => (
                          <span key={i} className="flex items-center gap-1.5 px-4 py-1.5 bg-primary-500/10 text-primary-600 dark:text-primary-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-500/20">
                            {f}
                            <button type="button" onClick={() => removeFeature(i)} className="text-primary-400 hover:text-primary-600 dark:hover:text-white transition-colors"><X size={12} /></button>
                          </span>
                        ))}
                      </div>
                    </div>
                     <div className="col-span-2">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                        <button type="button" onClick={() => setForm({...form, published: !form.published})}
                          className={`relative w-12 h-7 rounded-full transition-all ${form.published ? 'bg-green-500' : 'bg-gray-300 dark:bg-white/10'}`}>
                          <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${form.published ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">{form.published ? 'Publié' : 'Masqué'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                 <div className="flex gap-4 p-8 border-t border-gray-100 dark:border-white/10">
                  <motion.button onClick={save} disabled={saving} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary-500/20 disabled:opacity-70 transition-all">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </motion.button>
                  <button onClick={closeForm} className="flex-1 px-6 py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white transition-all">Annuler</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </AdminShell>
  )
}
