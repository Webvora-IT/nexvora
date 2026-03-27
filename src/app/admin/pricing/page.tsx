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
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-black text-gray-950 dark:text-white uppercase tracking-tighter italic">Gestion des Tarifs</h1>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">{plans?.length || 0} plans configurés</p>
            </div>
            <div className="flex gap-3">
              <motion.button 
                onClick={async () => {
                  if(confirm('Réinitialiser tous les tarifs par défaut ?')) {
                    await fetch('/api/pricing/seed');
                    mutate();
                    toast.success('Tarifs réinitialisés');
                  }
                }}
                whileHover={{ scale: 1.05 }} 
                className="px-6 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white transition-all shadow-sm"
              >
                Réinitialiser
              </motion.button>
              <motion.button 
                onClick={openCreate} 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary-500/20 transition-all"
              >
                <Plus size={18} /> Ajouter un Tarif
              </motion.button>
            </div>
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
                  className={`glass rounded-[2rem] p-6 border transition-all flex items-center justify-between shadow-xl bg-white dark:bg-transparent ${p.published ? 'border-gray-200 dark:border-white/10' : 'border-gray-300 dark:border-white/5 opacity-60'}`}
                >
                   <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white shadow-lg shadow-primary-500/20`}>
                      <DollarSign size={24} strokeWidth={3} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-black text-gray-950 dark:text-white uppercase tracking-tight text-lg italic">{p.name}</h3>
                        {p.popular && <span className="px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-amber-200 dark:border-amber-500/30">Populaire</span>}
                        <span className="text-[10px] text-gray-400 font-mono font-bold tracking-widest uppercase">#{p.key}</span>
                      </div>
                      <p className="text-primary-600 dark:text-primary-400 text-sm font-black mt-1">${p.price.toLocaleString()} <span className="text-gray-500 dark:text-gray-500 lowercase font-medium text-xs">{p.period}</span></p>
                    </div>
                  </div>

                   <div className="flex items-center gap-8">
                    <div className="hidden md:block">
                      <p className="text-[10px] text-gray-500 dark:text-gray-500 font-black uppercase tracking-widest mb-1">Features</p>
                      <p className="text-xs text-gray-950 dark:text-white font-black uppercase tracking-widest">{p.features?.length || 0} incluses</p>
                    </div>
                    
                    <div className="flex gap-3">
                      <button onClick={() => toggle(p)} className={`p-2.5 rounded-xl transition-all shadow-sm ${p.published ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 hover:scale-110' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:scale-110'}`}>
                        {p.published ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button onClick={() => openEdit(p)} className="p-2.5 bg-primary-100 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:scale-110 rounded-xl transition-all shadow-sm"><Edit size={18} /></button>
                      <button onClick={() => remove(p.id)} className="p-2.5 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:scale-110 rounded-xl transition-all shadow-sm"><Trash2 size={18} /></button>
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
                  className="glass rounded-[2rem] border border-gray-200 dark:border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#030617]/95 shadow-2xl">
                  <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-white/10">
                    <h2 className="font-black text-gray-950 dark:text-white uppercase tracking-tighter text-2xl italic">{editing ? 'Modifier le Tarif' : 'Nouveau Tarif'}</h2>
                    <button onClick={closeForm} className="p-3 bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-950 dark:hover:text-white rounded-2xl transition-all"><X size={20} /></button>
                  </div>
                  <div className="p-8 space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Nom du Plan *</label>
                        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                          placeholder="ex: Professionnel"
                          className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold tracking-tight" />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Clé unique (ID) *</label>
                        <input value={form.key} onChange={e => setForm({...form, key: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                          placeholder="ex: professional"
                          disabled={!!editing}
                          className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 font-mono" />
                      </div>
                       <div className="md:col-span-2">
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Description</label>
                        <textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none leading-relaxed font-medium" />
                      </div>
                       <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Prix ($)</label>
                        <input type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})}
                          className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-primary-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-black text-xl" />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Période</label>
                        <input value={form.period} onChange={e => setForm({...form, period: e.target.value})}
                          placeholder="/ projet ou / mois"
                          className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold" />
                      </div>
                      
                       <div className="md:col-span-2">
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Fonctionnalités</label>
                        <div className="flex gap-3 mb-4">
                          <input value={featureInput} onChange={e => setFeatureInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                            placeholder="Ajouter une fonctionnalité..."
                            className="flex-1 px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                          <button type="button" onClick={addFeature} className="px-6 py-3 bg-primary-600 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20 font-bold">+</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(form.features || []).map((f: string, i: number) => (
                            <span key={i} className="flex items-center gap-2 px-4 py-1.5 bg-primary-500/10 text-primary-600 dark:text-primary-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-500/20 group transition-all">
                              {f}
                              <button type="button" onClick={() => removeFeature(i)} className="text-primary-400 hover:text-primary-600 dark:hover:text-white transition-colors"><X size={14} /></button>
                            </span>
                          ))}
                        </div>
                      </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                        <div className="flex items-center gap-4 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                          <button type="button" onClick={() => setForm({...form, popular: !form.popular})}
                            className={`relative w-12 h-7 rounded-full transition-all ${form.popular ? 'bg-amber-500' : 'bg-gray-300 dark:bg-white/10'}`}>
                            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${form.popular ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                          <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Badge "Populaire"</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-primary-500/5 rounded-2xl border border-primary-500/10">
                          <button type="button" onClick={() => setForm({...form, published: !form.published})}
                            className={`relative w-12 h-7 rounded-full transition-all ${form.published ? 'bg-green-500' : 'bg-gray-300 dark:bg-white/10'}`}>
                            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${form.published ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                          <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">{form.published ? 'Plan Visible' : 'Plan Masqué'}</span>
                        </div>
                      </div>

                       <div className="md:col-span-2">
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Couleur (Classes Tailwind Gradient)</label>
                        <input value={form.color} onChange={e => setForm({...form, color: e.target.value})}
                          placeholder="from-blue-500 to-indigo-600"
                          className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-mono text-xs" />
                      </div>
                    </div>
                  </div>
                   <div className="flex gap-4 p-8 border-t border-gray-100 dark:border-white/10">
                    <motion.button onClick={save} disabled={saving} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-[2rem] text-xs font-black uppercase tracking-widest text-white disabled:opacity-70 shadow-lg shadow-primary-500/20 transition-all">
                      {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      {saving ? 'Sauvegarde...' : 'Enregistrer le Tarif'}
                    </motion.button>
                    <button onClick={closeForm} className="px-10 py-5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white transition-all">Annuler</button>
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
