'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Search,
  Mail,
  Phone,
  Building,
  Trash2,
  CheckCircle,
} from 'lucide-react'

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  IN_PROGRESS: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  RESOLVED: 'bg-green-500/20 text-green-400 border-green-500/30',
  ARCHIVED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const sampleContacts = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 555 0101',
    company: 'TechCorp',
    service: 'Web Development',
    message: 'We need a new web platform for our e-commerce business.',
    status: 'NEW',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Alice Johnson',
    email: 'alice@corp.com',
    phone: '+1 555 0102',
    company: 'AI Ventures',
    service: 'AI/ML',
    message: 'Looking for AI recommendation system for our platform.',
    status: 'IN_PROGRESS',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@startup.io',
    phone: '+1 555 0103',
    company: 'StartupX',
    service: 'DevOps',
    message: 'Need to set up CI/CD pipeline and Kubernetes cluster.',
    status: 'NEW',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma@firm.co',
    phone: '+44 20 7946',
    company: 'Global Firm',
    service: 'Mobile App',
    message: 'We want a cross-platform mobile app for our logistics business.',
    status: 'RESOLVED',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Carlos Ruiz',
    email: 'carlos@biz.com',
    phone: '+34 91 000 0000',
    company: 'BizSolutions',
    service: 'Automation',
    message: 'Looking for HR workflow automation solution.',
    status: 'IN_PROGRESS',
    createdAt: new Date().toISOString(),
  },
]

export default function ContactsPage() {
  const [contacts, setContacts] = useState(sampleContacts)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = contacts.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'ALL' || c.status === filter
    return matchSearch && matchFilter
  })

  const handleDelete = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id))
    if (selected === id) setSelected(null)
  }

  const handleResolve = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'RESOLVED' } : c))
    )
  }

  return (
    <div className="min-h-screen bg-[#050510] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <button className="p-2 glass rounded-lg text-gray-400 hover:text-white border border-white/10 transition-all">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Contacts</h1>
            <p className="text-gray-400 text-sm">{contacts.length} total inquiries</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Search & Filter */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contacts..."
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2.5 bg-[#0f0f1a] border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-primary-500"
            >
              <option value="ALL">All Status</option>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* Contact Cards */}
          <div className="space-y-3">
            {filtered.map((contact, i) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() =>
                  setSelected(contact.id === selected ? null : contact.id)
                }
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
                    <span className="hidden sm:block text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">
                      {contact.service}
                    </span>
                    <span
                      className={`px-2.5 py-1 text-xs rounded-full border ${statusColors[contact.status]}`}
                    >
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
                        <span className="flex items-center gap-1">
                          <Phone size={12} /> {contact.phone}
                        </span>
                      )}
                      {contact.company && (
                        <span className="flex items-center gap-1">
                          <Building size={12} /> {contact.company}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleResolve(contact.id)
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30 transition-colors"
                      >
                        <CheckCircle size={12} /> Mark Resolved
                      </button>
                      <a
                        href={`mailto:${contact.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 px-3 py-1.5 bg-primary-500/20 text-primary-400 rounded-lg text-xs hover:bg-primary-500/30 transition-colors"
                      >
                        <Mail size={12} /> Reply
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(contact.id)
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition-colors ml-auto"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No contacts found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
