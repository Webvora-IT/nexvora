'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, X, Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'
import AdminShell from '../AdminShell'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const defaultMember = { name: '', role: '', bio: '', imageUrl: '', linkedin: '', github: '', order: 0, published: true }

export default function AdminTeamPage() {
  const { data: team, mutate } = useSWR('/api/admin/team', fetcher)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(defaultMember)
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setEditing(null); setForm(defaultMember); setShowForm(true) }
  const openEdit = (m: any) => { setEditing(m); setForm(m); setShowForm(true) }

  const save = async () => {
    setSaving(true)
    try {
      const url = editing ? `/api/admin/team/${editing.id}` : '/api/admin/team'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      toast.success(editing ? 'Membre mis à jour!' : 'Membre ajouté!')
      mutate(); setShowForm(false)
    } catch { toast.error('Erreur') } finally { setSaving(false) }
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer ce membre ?')) return
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Membre supprimé'); mutate()
    } catch { toast.error('Erreur lors de la suppression') }
  }

  return (
    <AdminShell>
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-950 dark:text-white uppercase tracking-tighter italic">Équipe</h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">{team?.length || 0} membres</p>
          </div>
          <button 
            onClick={openCreate} 
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary-500/20 hover:scale-105 transition-all"
          >
            <Plus size={18} /> Ajouter un Membre
          </button>
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(team || []).map((m: any, i: number) => (
            <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-[2rem] p-6 border border-gray-200 dark:border-white/10 text-center shadow-xl bg-white dark:bg-transparent">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center text-2xl font-black text-white mx-auto mb-4 shadow-lg shadow-primary-500/20">
                {m.imageUrl ? <img src={m.imageUrl} className="w-full h-full rounded-full object-cover border-2 border-white/50 dark:border-white/10" alt={m.name} /> : m.name[0]}
              </div>
              <h3 className="font-black text-gray-950 dark:text-white uppercase tracking-tight text-lg italic">{m.name}</h3>
              <p className="text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-widest mt-1">{m.role}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-3 line-clamp-2 leading-relaxed font-medium">{m.bio}</p>
              <div className="flex justify-center gap-3 mt-5">
                <button onClick={() => openEdit(m)} className="p-2 bg-primary-100 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:scale-110 rounded-xl transition-all shadow-sm"><Edit size={16} /></button>
                <button onClick={() => remove(m.id)} className="p-2 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:scale-110 rounded-xl transition-all shadow-sm"><Trash2 size={16} /></button>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="glass rounded-[2rem] border border-gray-200 dark:border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-[#030617]/95 shadow-2xl">
                <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-white/10">
                  <h2 className="font-black text-gray-950 dark:text-white uppercase tracking-tighter text-2xl italic">{editing ? 'Modifier' : 'Ajouter'} un Membre</h2>
                  <button onClick={() => setShowForm(false)} className="p-3 bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-950 dark:hover:text-white rounded-2xl transition-all"><X size={20} /></button>
                </div>
                 <div className="p-8 space-y-6">
                  <ImageUpload value={form.imageUrl} onChange={(url) => setForm({...form, imageUrl: url})} folder="team" label="Photo de profil" aspectRatio="square" />
                  {['name', 'role'].map(field => (
                    <div key={field}>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 capitalize">{field === 'name' ? 'Nom' : 'Rôle'} *</label>
                      <input value={(form as any)[field]} onChange={e => setForm({...form, [field]: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold tracking-tight" />
                    </div>
                  ))}
                   <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Bio</label>
                    <textarea rows={3} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none leading-relaxed font-medium" />
                  </div>
                   <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">LinkedIn</label>
                    <input value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-primary-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">GitHub</label>
                    <input value={form.github} onChange={e => setForm({...form, github: e.target.value})}
                      placeholder="https://github.com/..."
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-primary-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-mono" />
                  </div>
                </div>
                 <div className="flex gap-4 p-8 border-t border-gray-100 dark:border-white/10">
                  <button onClick={save} disabled={saving} className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary-500/20 disabled:opacity-70 transition-all">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Sauvegarder
                  </button>
                  <button onClick={() => setShowForm(false)} className="flex-1 px-6 py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white transition-all">Annuler</button>
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
