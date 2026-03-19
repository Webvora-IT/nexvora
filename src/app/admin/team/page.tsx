'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, X, Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'
import AdminShell from '../AdminShell'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const defaultMember = { name: '', role: '', bio: '', avatar: '', skills: [] as string[], order: 0, published: true }

export default function AdminTeamPage() {
  const { data: team, mutate } = useSWR('/api/admin/team', fetcher)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(defaultMember)
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setEditing(null); setForm(defaultMember); setShowForm(true) }
  const openEdit = (m: any) => { setEditing(m); setForm(m); setShowForm(true) }

  const save = async () => {
    setSaving(true)
    try {
      const url = editing ? `/api/admin/team/${editing.id}` : '/api/admin/team'
      const method = editing ? 'PUT' : 'POST'
      await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      toast.success(editing ? 'Membre mis à jour!' : 'Membre ajouté!')
      mutate(); setShowForm(false)
    } catch { toast.error('Erreur') } finally { setSaving(false) }
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer ce membre ?')) return
    await fetch(`/api/admin/team/${id}`, { method: 'DELETE' })
    toast.success('Membre supprimé'); mutate()
  }

  return (
    <AdminShell>
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Équipe</h1>
            <p className="text-gray-400 text-sm">{team?.length || 0} membres</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-500 rounded-xl text-sm font-medium text-white">
            <Plus size={16} /> Ajouter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(team || []).map((m: any, i: number) => (
            <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 border border-white/10 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3">
                {m.avatar ? <img src={m.avatar} className="w-full h-full rounded-full object-cover" alt={m.name} /> : m.name[0]}
              </div>
              <h3 className="font-bold text-white">{m.name}</h3>
              <p className="text-primary-400 text-sm">{m.role}</p>
              <p className="text-gray-400 text-xs mt-2 line-clamp-2">{m.bio}</p>
              <div className="flex justify-center gap-2 mt-4">
                <button onClick={() => openEdit(m)} className="p-1.5 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg"><Edit size={14} /></button>
                <button onClick={() => remove(m.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="glass rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="font-bold text-white">{editing ? 'Modifier' : 'Ajouter'} un Membre</h2>
                  <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-white"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4">
                  <ImageUpload value={form.avatar} onChange={(url) => setForm({...form, avatar: url})} folder="team" label="Photo de profil" aspectRatio="square" />
                  {['name', 'role'].map(field => (
                    <div key={field}>
                      <label className="block text-sm text-gray-400 mb-2 capitalize">{field === 'name' ? 'Nom' : 'Rôle'}</label>
                      <input value={(form as any)[field]} onChange={e => setForm({...form, [field]: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Bio</label>
                    <textarea rows={3} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Compétences</label>
                    <div className="flex gap-2 mb-2">
                      <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if(skillInput.trim()) { setForm(f => ({...f, skills: [...f.skills, skillInput.trim()]})); setSkillInput('') } }}}
                        placeholder="React, Node.js..."
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" />
                      <button type="button" onClick={() => { if(skillInput.trim()) { setForm(f => ({...f, skills: [...f.skills, skillInput.trim()]})); setSkillInput('') }}} className="px-3 bg-primary-600 rounded-xl text-white text-sm">+</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.skills.map((s, i) => (
                        <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-primary-500/20 text-primary-300 text-xs rounded-full border border-primary-500/30">
                          {s} <button type="button" onClick={() => setForm(f => ({...f, skills: f.skills.filter((_,j) => j !== i)}))}><X size={10} /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 p-6 border-t border-white/10">
                  <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-500 rounded-xl text-sm font-semibold text-white disabled:opacity-70">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Sauvegarder
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-5 py-2.5 glass border border-white/10 rounded-xl text-sm text-gray-400">Annuler</button>
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
