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
  NEW: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  IN_PROGRESS: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  RESOLVED: 'bg-green-500/20 text-green-400 border-green-500/30',
  ARCHIVED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export default function ContactsPage() {
  const { data: contacts = [], mutate, isLoading } = useSWR<Contact[]>('/api/admin/contacts', fetcher)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [selected, setSelected] = useState<string | null>(null)

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/contacts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    mutate()
    toast.success(`Marked as ${status.toLowerCase().replace('_', ' ')}`)
  }

  const deleteContact = async (id: string) => {
    if (!confirm('Delete this contact?')) return
    await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' })
    if (selected === id) setSelected(null)
    mutate()
    toast.success('Deleted')
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
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">Contacts</h1>
              {newCount > 0 && (
                <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full border border-blue-500/30">
                  {newCount} new
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm">{(contacts as Contact[]).length} total inquiries</p>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-3 mb-5">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search contacts..."
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              />
            </div>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="px-4 py-2.5 bg-[#0f0f1a] border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-primary-500"
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
                  className={`glass rounded-xl p-4 border cursor-pointer transition-all ${
                    selected === contact.id
                      ? 'border-primary-500/50 bg-primary-500/5'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center font-bold text-white">
                        {contact.name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-white">{contact.name}</div>
                        <div className="text-xs text-gray-400">{contact.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {contact.service && (
                        <span className="hidden sm:block text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">
                          {contact.service}
                        </span>
                      )}
                      <span className={`px-2.5 py-1 text-xs rounded-full border ${statusColors[contact.status] ?? ''}`}>
                        {contact.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {selected === contact.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-white/10 space-y-2"
                    >
                      <p className="text-gray-300 text-sm">{contact.message}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-3">
                        {contact.phone && (
                          <span className="flex items-center gap-1"><Phone size={12} /> {contact.phone}</span>
                        )}
                        {contact.company && (
                          <span className="flex items-center gap-1"><Building size={12} /> {contact.company}</span>
                        )}
                        <span>{new Date(contact.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        {contact.status !== 'RESOLVED' && (
                          <button
                            onClick={e => { e.stopPropagation(); updateStatus(contact.id, 'RESOLVED') }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30 transition-colors"
                          >
                            <CheckCircle size={12} /> Mark Resolved
                          </button>
                        )}
                        {contact.status !== 'IN_PROGRESS' && contact.status !== 'RESOLVED' && (
                          <button
                            onClick={e => { e.stopPropagation(); updateStatus(contact.id, 'IN_PROGRESS') }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs hover:bg-yellow-500/30 transition-colors"
                          >
                            In Progress
                          </button>
                        )}
                        <a
                          href={`mailto:${contact.email}`}
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 px-3 py-1.5 bg-primary-500/20 text-primary-400 rounded-lg text-xs hover:bg-primary-500/30 transition-colors"
                        >
                          <Mail size={12} /> Reply
                        </a>
                        <button
                          onClick={e => { e.stopPropagation(); deleteContact(contact.id) }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition-colors ml-auto"
                        >
                          <Trash2 size={12} /> Delete
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
