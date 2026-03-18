'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Globe, Mail, Lock, Bell, Palette } from 'lucide-react'

const sections = [
  {
    icon: Globe,
    title: 'General Settings',
    fields: [
      { label: 'Site Name', value: 'Nexvora', type: 'text' },
      { label: 'Site URL', value: 'https://nexvora.com', type: 'text' },
      { label: 'Tagline', value: 'Innovative IT Solutions', type: 'text' },
      { label: 'Support Email', value: 'hello@nexvora.com', type: 'email' },
    ]
  },
  {
    icon: Mail,
    title: 'Email Notifications',
    fields: [
      { label: 'Admin Email', value: 'admin@nexvora.com', type: 'email' },
      { label: 'New Contact Alert', value: 'true', type: 'toggle' },
      { label: 'Weekly Report', value: 'false', type: 'toggle' },
    ]
  },
  {
    icon: Lock,
    title: 'Security',
    fields: [
      { label: 'Current Password', value: '', type: 'password' },
      { label: 'New Password', value: '', type: 'password' },
      { label: 'Confirm Password', value: '', type: 'password' },
    ]
  },
]

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [toggles, setToggles] = useState({ 'New Contact Alert': true, 'Weekly Report': false })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#050510] p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <button className="p-2 glass rounded-lg text-gray-400 hover:text-white border border-white/10">
                <ArrowLeft size={18} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Settings</h1>
              <p className="text-gray-400 text-sm">Manage your site configuration</p>
            </div>
          </div>
          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-primary-600 to-accent-500 text-white'
            }`}
          >
            <Save size={15} />
            {saved ? 'Saved!' : 'Save Changes'}
          </motion.button>
        </div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                  <section.icon size={16} className="text-primary-400" />
                </div>
                <h3 className="font-semibold text-white">{section.title}</h3>
              </div>
              <div className="p-6 space-y-4">
                {section.fields.map((field, j) => (
                  <div key={j}>
                    <label className="block text-sm text-gray-400 mb-1.5">{field.label}</label>
                    {field.type === 'toggle' ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setToggles(prev => ({ ...prev, [field.label]: !prev[field.label as keyof typeof prev] }))}
                          className={`relative w-11 h-6 rounded-full transition-colors ${
                            toggles[field.label as keyof typeof toggles] ? 'bg-primary-500' : 'bg-white/10'
                          }`}
                        >
                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            toggles[field.label as keyof typeof toggles] ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                        <span className="text-sm text-gray-300">
                          {toggles[field.label as keyof typeof toggles] ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        defaultValue={field.value}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
