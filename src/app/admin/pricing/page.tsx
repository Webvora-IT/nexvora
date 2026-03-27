'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, X, Save, DollarSign, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminShell from '../AdminShell'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const defaultPlan = {
  key: '',
  name: '',
  description: '',
  price: 0,
  period: '/ projet',
  features: [] as string[],
  popular: false,
  color: 'from-blue-500 to-indigo-600',
  glow: 'rgba(99,102,241,0.15)',
  published: true,
  order: 0,
}

export default function AdminPricingPage() {
  const { data: plans, mutate } = useSWR('/api/pricing', fetcher)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(defaultPlan)
  const [featureInput, setFeatureInput] = useState('')
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setEditing(null); setForm(defaultPlan); setShowForm(true) }
  const openEdit = (p: any) => { setEditing(p); setForm(p); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditing(null) }

  const save = async () => {
    if (!form.key || !form.name) {
      toast.error('La clé et le nom sont requis')
      return
    }
    setSaving(true)
    try {
      const url = editing ? `/api/pricing/${editing.id}` : '/api/pricing'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { 
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({
          ...form,
          price: Number(form.price)
        }) 
      })
      if (!res.ok) throw new Error()
      toast.success(editing ? 'Tarif mis à jour!' : 'Tarif créé!')
      mutate()
      closeForm()
    } catch {
      toast.error('Une erreur est survenue')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer ce tarif ?')) return
    try {
      const res = await fetch(`/api/pricing/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Tarif supprimé')
      mutate()
    } catch { toast.error('Erreur lors de la suppression') }
  }

  const toggle = async (p: any) => {
    try {
      const res = await fetch(`/api/pricing/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...p, published: !p.published }),
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Gestion des Tarifs</h1>
              <p className="text-gray-400 text-sm">{plans?.length || 0} plans configurés</p>
            </div>
            <motion.button 
              onClick={openCreate} 
              whileHover={{ scale: 1.02 }} 
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-500 rounded-xl text-sm font-medium text-white"
            >
              <Plus size={16} /> Ajouter un Tarif
            </motion.button>
          </div>

          {/* Table-like list for Pricing */}
          {!plans ? (
            <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-primary-400" /></div>
          ) : Array.isArray(plans) ? (
            <div className="space-y-4">
              {plans.map((p: any, i: number) => (
                <motion.div 
                  key={p.id} 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.05 }}
                  className={`glass rounded-2xl p-5 border transition-all flex items-center justify-between ${p.published ? 'border-white/10' : 'border-white/5 opacity-60'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white shadow-lg`}>
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white">{p.name}</h3>
                        {p.popular && <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-[10px] font-bold uppercase rounded-full border border-primary-500/30">Populaire</span>}
                        <span className="text-xs text-gray-500 font-mono">[{p.key}]</span>
                      </div>
                      <p className="text-gray-400 text-sm">${p.price.toLocaleString()} {p.period}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="hidden md:block">
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Features</p>
                      <p className="text-sm text-gray-300 font-medium">{p.features?.length || 0} incluses</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button onClick={() => toggle(p)} className={`p-2 rounded-xl transition-colors ${p.published ? 'text-green-400 bg-green-500/10 hover:bg-green-500/20' : 'text-gray-500 bg-white/5 hover:bg-white/10'}`}>
                        {p.published ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button onClick={() => openEdit(p)} className="p-2 text-primary-400 bg-primary-500/10 hover:bg-primary-500/20 rounded-xl transition-colors"><Edit size={18} /></button>
                      <button onClick={() => remove(p.id)} className="p-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-12 glass rounded-2xl border border-red-500/20 text-center">
              <p className="text-red-400">Erreur lors du chargement des tarifs ou format invalide.</p>
            </div>
          )}

          {/* Form Modal */}
          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                  className="glass rounded-3xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                    <h2 className="font-bold text-white text-xl">{editing ? 'Modifier le Tarif' : 'Nouveau Tarif'}</h2>
                    <button onClick={closeForm} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"><X size={20} /></button>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Nom du Plan *</label>
                        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                          placeholder="ex: Professionnel"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Clé unique (ID) *</label>
                        <input value={form.key} onChange={e => setForm({...form, key: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                          placeholder="ex: professional"
                          disabled={!!editing}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 disabled:opacity-50" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                        <textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 resize-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Prix ($)</label>
                        <input type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Période</label>
                        <input value={form.period} onChange={e => setForm({...form, period: e.target.value})}
                          placeholder="/ projet ou / mois"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500" />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Fonctionnalités</label>
                        <div className="flex gap-2 mb-3">
                          <input value={featureInput} onChange={e => setFeatureInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                            placeholder="Ajouter une fonctionnalité..."
                            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500" />
                          <button type="button" onClick={addFeature} className="px-4 py-3 bg-primary-600 hover:bg-primary-500 rounded-xl text-white transition-colors">+</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(form.features || []).map((f: string, i: number) => (
                            <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 text-primary-300 text-sm rounded-xl border border-primary-500/20 group">
                              {f}
                              <button type="button" onClick={() => removeFeature(i)} className="text-primary-400 hover:text-white transition-colors"><X size={14} /></button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => setForm({...form, popular: !form.popular})}
                            className={`relative w-11 h-6 rounded-full transition-colors ${form.popular ? 'bg-amber-500' : 'bg-white/10'}`}>
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.popular ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                          <span className="text-sm font-medium text-gray-300">Badge "Populaire"</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => setForm({...form, published: !form.published})}
                            className={`relative w-11 h-6 rounded-full transition-colors ${form.published ? 'bg-primary-500' : 'bg-white/10'}`}>
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                          <span className="text-sm font-medium text-gray-300">{form.published ? 'Plan Visibile' : 'Plan Masqué'}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Couleur (Classes Tailwind)</label>
                        <input value={form.color} onChange={e => setForm({...form, color: e.target.value})}
                          placeholder="from-blue-500 to-indigo-600"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 font-mono text-xs" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 p-8 border-t border-white/10 bg-white/5">
                    <motion.button onClick={save} disabled={saving} whileHover={{ scale: 1.02 }}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary-600 to-accent-500 rounded-2xl font-bold text-white disabled:opacity-70 shadow-lg shadow-primary-500/20">
                      {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                      {saving ? 'Sauvegarde...' : 'Enregistrer le Tarif'}
                    </motion.button>
                    <button onClick={closeForm} className="px-8 py-4 glass border border-white/10 rounded-2xl font-bold text-gray-400 hover:text-white transition-colors">Annuler</button>
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
