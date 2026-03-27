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
  NEW: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
  IN_PROGRESS: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30',
  RESOLVED: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30',
  ARCHIVED: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-500/30',
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
           <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-gray-950 dark:text-white uppercase tracking-tighter italic">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">
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
                 className="glass rounded-3xl p-6 border border-gray-200 dark:border-white/10 relative overflow-hidden group hover:border-primary-500/30 transition-all shadow-sm hover:shadow-xl bg-white dark:bg-transparent"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-[0.03] dark:opacity-5 group-hover:opacity-10 transition-opacity`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon size={18} className="text-white" />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{stat.change}</span>
                  </div>
                   {isLoading ? (
                    <Loader2 size={24} className="text-primary-500 animate-spin mb-1" />
                  ) : (
                    <div className="text-3xl font-black text-gray-950 dark:text-white uppercase tracking-tight">{stat.value}</div>
                  )}
                  <div className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Contacts */}
           <div className="glass rounded-[2rem] border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm bg-white dark:bg-transparent transition-all">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
              <h2 className="font-black text-gray-950 dark:text-white uppercase tracking-tight text-xl">Recent Contacts</h2>
              <Link href="/admin/contacts">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors cursor-pointer group">
                  View All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
                     <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
                      <th className="text-left text-[10px] font-black text-gray-500 uppercase tracking-widest px-6 py-4">Name</th>
                      <th className="text-left text-[10px] font-black text-gray-500 uppercase tracking-widest px-6 py-4 hidden md:table-cell">Email</th>
                      <th className="text-left text-[10px] font-black text-gray-500 uppercase tracking-widest px-6 py-4">Service</th>
                      <th className="text-left text-[10px] font-black text-gray-500 uppercase tracking-widest px-6 py-4">Status</th>
                      <th className="text-left text-[10px] font-black text-gray-500 uppercase tracking-widest px-6 py-4 hidden sm:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentContacts.map((contact: any, i: number) => (
                      <motion.tr
                        key={contact.id ?? i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                         className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-sm font-black text-white shadow-sm">
                              {contact.name?.[0] ?? '?'}
                            </div>
                            <span className="text-gray-950 dark:text-white text-sm font-bold uppercase tracking-tight">{contact.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-gray-600 dark:text-gray-400 text-sm hidden md:table-cell font-medium">{contact.email}</td>
                        <td className="px-6 py-5 text-gray-600 dark:text-gray-400 text-sm font-bold">{contact.service ?? '—'}</td>
                         <td className="px-6 py-5">
                          <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm ${statusColors[contact.status] ?? ''}`}>
                            {contact.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-gray-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest hidden sm:table-cell">
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
