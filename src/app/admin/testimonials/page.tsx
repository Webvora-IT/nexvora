'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Edit, Trash2, Star, Eye, EyeOff } from 'lucide-react'

const testimonials = [
  { id: '1', name: 'James Wilson', company: 'TechStart Inc.', position: 'CTO', content: 'Nexvora transformed our entire infrastructure...', rating: 5, published: true },
  { id: '2', name: 'Sarah Kim', company: 'RetailPro', position: 'CEO', content: 'The AI recommendation system increased sales by 40%...', rating: 5, published: true },
  { id: '3', name: 'David Okafor', company: 'HealthBridge', position: 'PM', content: 'Outstanding work on our healthcare platform...', rating: 5, published: false },
  { id: '4', name: 'Elena Martinez', company: 'LogiFlow', position: 'Ops Director', content: 'The automation solution saves us 200+ hours per month...', rating: 5, published: true },
]

export default function TestimonialsPage() {
  const [items, setItems] = useState(testimonials)
  const [showForm, setShowForm] = useState(false)

  const togglePublish = (id: string) => {
    setItems(items.map(t => t.id === id ? { ...t, published: !t.published } : t))
  }

  return (
    <div className="min-h-screen bg-[#050510] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <button className="p-2 glass rounded-lg text-gray-400 hover:text-white border border-white/10">
                <ArrowLeft size={18} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Testimonials</h1>
              <p className="text-gray-400 text-sm">{items.filter(t => t.published).length} published</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-500 rounded-xl text-sm font-medium text-white"
          >
            <Plus size={16} /> Add Testimonial
          </motion.button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 border border-white/10 mb-6"
          >
            <h3 className="font-bold text-white mb-4">New Testimonial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {['Name', 'Company', 'Position'].map(field => (
                <input
                  key={field}
                  placeholder={field}
                  className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500"
                />
              ))}
              <select className="px-4 py-2.5 bg-[#0f0f1a] border border-white/10 rounded-xl text-gray-300 text-sm focus:outline-none focus:border-primary-500">
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
              </select>
            </div>
            <textarea
              rows={3}
              placeholder="Testimonial content..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button className="px-5 py-2 bg-gradient-to-r from-primary-600 to-accent-500 rounded-xl text-sm font-medium text-white">Save</button>
              <button onClick={() => setShowForm(false)} className="px-5 py-2 glass border border-white/10 rounded-xl text-sm text-gray-400">Cancel</button>
            </div>
          </motion.div>
        )}

        <div className="space-y-3">
          {items.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass rounded-xl p-5 border transition-all ${t.published ? 'border-white/10' : 'border-white/5 opacity-60'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-white">{t.name}</span>
                    <span className="text-gray-400 text-sm">{t.position} @ {t.company}</span>
                    <div className="flex gap-0.5">
                      {Array.from({length: t.rating}).map((_, j) => (
                        <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{t.content}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => togglePublish(t.id)}
                    className={`p-1.5 rounded-lg transition-colors ${t.published ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-500 hover:bg-white/5'}`}
                  >
                    {t.published ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors">
                    <Edit size={14} />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
