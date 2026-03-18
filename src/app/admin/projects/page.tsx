'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Edit, Trash2, Eye, Search, FolderOpen } from 'lucide-react'

const categories = ['All', 'Web App', 'Mobile', 'AI/ML', 'DevOps', 'Automation']

const initialProjects = [
  {
    id: '1',
    title: 'HealthFlow Platform',
    category: 'Web App',
    client: 'HealthBridge',
    status: true,
    featured: true,
  },
  {
    id: '2',
    title: 'RetailAI Assistant',
    category: 'AI/ML',
    client: 'RetailPro',
    status: true,
    featured: false,
  },
  {
    id: '3',
    title: 'LogiTrack Mobile',
    category: 'Mobile',
    client: 'LogiFlow',
    status: true,
    featured: true,
  },
  {
    id: '4',
    title: 'CloudOps Pipeline',
    category: 'DevOps',
    client: 'TechCorp',
    status: false,
    featured: false,
  },
  {
    id: '5',
    title: 'FinanceBot',
    category: 'AI/ML',
    client: 'FinEdge',
    status: true,
    featured: false,
  },
  {
    id: '6',
    title: 'AutoHR System',
    category: 'Automation',
    client: 'HRSolutions',
    status: true,
    featured: true,
  },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = projects.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  const handleToggleStatus = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: !p.status } : p))
    )
  }

  return (
    <div className="min-h-screen bg-[#050510] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <button className="p-2 glass rounded-lg text-gray-400 hover:text-white border border-white/10 transition-all">
                <ArrowLeft size={18} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Projects</h1>
              <p className="text-gray-400 text-sm">{projects.length} total projects</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-500 rounded-xl text-sm font-medium text-white">
            <Plus size={16} /> Add Project
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white'
                    : 'glass text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Table */}
        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-gray-500 uppercase px-5 py-3">Project</th>
                <th className="text-left text-xs text-gray-500 uppercase px-5 py-3 hidden md:table-cell">
                  Category
                </th>
                <th className="text-left text-xs text-gray-500 uppercase px-5 py-3 hidden lg:table-cell">
                  Client
                </th>
                <th className="text-left text-xs text-gray-500 uppercase px-5 py-3">Status</th>
                <th className="text-left text-xs text-gray-500 uppercase px-5 py-3">Featured</th>
                <th className="text-right text-xs text-gray-500 uppercase px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project, i) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                        <FolderOpen size={16} className="text-primary-400" />
                      </div>
                      <span className="text-white font-medium text-sm">{project.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="px-2.5 py-1 text-xs glass rounded-full text-gray-400 border border-white/10">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-sm hidden lg:table-cell">
                    {project.client}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleStatus(project.id)}
                      className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                        project.status
                          ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30'
                      }`}
                    >
                      {project.status ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs rounded-full border ${
                        project.featured
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}
                    >
                      {project.featured ? '★ Featured' : 'Regular'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors">
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
