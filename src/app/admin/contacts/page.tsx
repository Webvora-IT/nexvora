'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { Search, Mail, Phone, Building, Trash2, CheckCircle, Loader2, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminShell from '../AdminShell'

const fetcher = (url: string) => fetch(url).then(r => r.json())

interface Contact {
  id: string; name: string; email: string; phone?: string; company?: string;
  service?: string; message: string; status: string; createdAt: string
}

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
  IN_PROGRESS: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30',
  RESOLVED: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30',
  ARCHIVED: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-500/30',
}

export default function ContactsPage() {
  const { data: contacts = [], mutate, isLoading } = useSWR<Contact[]>('/api/admin/contacts', fetcher)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [selected, setSelected] = useState<string | null>(null)

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      mutate()
      toast.success(`Marked as ${status.toLowerCase().replace('_', ' ')}`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  const deleteContact = async (id: string) => {
    if (!confirm('Delete this contact?')) return
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      if (selected === id) setSelected(null)
      mutate()
      toast.success('Deleted')
    } catch {
      toast.error('Failed to delete contact')
    }
  }

  const filtered = (contacts as Contact[]).filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'ALL' || c.status === filter
    return matchSearch && matchFilter
  })

  const newCount = (contacts as Contact[]).filter(c => c.status === 'NEW').length

  return (
    <AdminShell>
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
           <div className="mb-10">
            <div className="flex items-center gap-4 mb-1">
              <h1 className="text-3xl font-black text-gray-950 dark:text-white uppercase tracking-tighter italic">Contacts</h1>
              {newCount > 0 && (
                <span className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-500/20 animate-pulse">
                  {newCount} new
                </span>
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">{(contacts as Contact[]).length} total inquiries</p>
          </div>

          {/* Search & Filter */}
           <div className="flex gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search contacts..."
                className="w-full pl-12 pr-6 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 shadow-sm transition-all font-medium"
              />
            </div>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="px-6 py-4 bg-white dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 rounded-2xl text-sm text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 shadow-sm transition-all font-bold uppercase tracking-widest"
            >
              <option value="ALL">All Status</option>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((contact, i) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(contact.id === selected ? null : contact.id)}
                  className={`glass rounded-[2rem] p-6 border cursor-pointer transition-all bg-white dark:bg-transparent shadow-sm ${
                    selected === contact.id
                      ? 'border-primary-500 shadow-xl shadow-primary-500/10'
                      : 'border-gray-100 dark:border-white/10 hover:border-primary-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-primary-500/20">
                        {contact.name[0]}
                      </div>
                      <div>
                        <div className="font-black text-gray-950 dark:text-white uppercase tracking-tight">{contact.name}</div>
                        <div className="text-xs font-bold text-gray-500 dark:text-gray-500">{contact.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {contact.service && (
                        <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10">
                          {contact.service}
                        </span>
                      )}
                      <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm ${statusColors[contact.status] ?? ''}`}>
                        {contact.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {selected === contact.id && (
                     <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10 space-y-4"
                    >
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-medium bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">{contact.message}</p>
                      <div className="flex flex-wrap gap-5 text-[10px] font-black uppercase tracking-widest text-gray-500 mt-4">
                        {contact.phone && (
                          <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10"><Phone size={14} className="text-primary-500" /> {contact.phone}</span>
                        )}
                        {contact.company && (
                          <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10"><Building size={14} className="text-primary-500" /> {contact.company}</span>
                        )}
                        <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10">{new Date(contact.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                      </div>
                       <div className="flex gap-3 mt-6">
                        {contact.status !== 'RESOLVED' && (
                          <button
                            onClick={e => { e.stopPropagation(); updateStatus(contact.id, 'RESOLVED') }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500/20 transition-all border border-green-500/20"
                          >
                            <CheckCircle size={14} /> Mark Resolved
                          </button>
                        )}
                        {contact.status !== 'IN_PROGRESS' && contact.status !== 'RESOLVED' && (
                          <button
                            onClick={e => { e.stopPropagation(); updateStatus(contact.id, 'IN_PROGRESS') }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500/20 transition-all border border-yellow-500/20"
                          >
                            In Progress
                          </button>
                        )}
                        <a
                          href={`mailto:${contact.email}`}
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-2 px-4 py-2.5 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-500/20 transition-all border border-primary-500/20"
                        >
                          <Mail size={14} /> Reply
                        </a>
                        <button
                          onClick={e => { e.stopPropagation(); deleteContact(contact.id) }}
                          className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all ml-auto border border-red-500/20"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {filtered.length === 0 && !isLoading && (
                <div className="text-center py-16 text-gray-500">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No contacts found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
