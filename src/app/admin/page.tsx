'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  FolderOpen,
  Star,
  BookOpen,
  TrendingUp,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import AdminShell from './AdminShell'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  IN_PROGRESS: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  RESOLVED: 'bg-green-500/20 text-green-400 border-green-500/30',
  ARCHIVED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export default function AdminDashboard() {
  const { data, isLoading } = useSWR('/api/admin/stats', fetcher, { refreshInterval: 30000 })

  const stats = [
    { icon: MessageSquare, label: 'New Contacts', value: data ? String(data.stats?.newContacts ?? 0) : '—', change: `${data?.stats?.contacts ?? 0} total`, color: 'from-blue-500 to-indigo-600' },
    { icon: FolderOpen, label: 'Active Projects', value: data ? String(data.stats?.projects ?? 0) : '—', change: 'published', color: 'from-cyan-500 to-blue-600' },
    { icon: Star, label: 'Testimonials', value: data ? String(data.stats?.testimonials ?? 0) : '—', change: 'published', color: 'from-purple-500 to-pink-600' },
    { icon: BookOpen, label: 'Blog Posts', value: data ? String(data.stats?.posts ?? 0) : '—', change: 'published', color: 'from-green-500 to-emerald-600' },
  ]

  const recentContacts = data?.recentContacts ?? []

  return (
    <AdminShell>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 text-sm">
              Welcome back! Here&apos;s what&apos;s happening at Nexvora.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-5 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon size={18} className="text-white" />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{stat.change}</span>
                  </div>
                  {isLoading ? (
                    <Loader2 size={20} className="text-gray-500 animate-spin mb-1" />
                  ) : (
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                  )}
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Contacts */}
          <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="font-bold text-white">Recent Contacts</h2>
              <Link href="/admin/contacts">
                <span className="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors cursor-pointer">
                  View All <ChevronRight size={14} />
                </span>
              </Link>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
                </div>
              ) : recentContacts.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-sm">No contacts yet</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">Name</th>
                      <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Email</th>
                      <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">Service</th>
                      <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                      <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentContacts.map((contact: any, i: number) => (
                      <motion.tr
                        key={contact.id ?? i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center text-sm font-bold text-white">
                              {contact.name?.[0] ?? '?'}
                            </div>
                            <span className="text-white text-sm font-medium">{contact.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-400 text-sm hidden md:table-cell">{contact.email}</td>
                        <td className="px-5 py-4 text-gray-400 text-sm">{contact.service ?? '—'}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 text-xs rounded-full border ${statusColors[contact.status] ?? ''}`}>
                            {contact.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500 text-xs hidden sm:table-cell">
                          {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('fr-FR') : '—'}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
