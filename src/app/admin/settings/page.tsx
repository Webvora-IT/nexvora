'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { Save, Globe, Mail, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminShell from '../AdminShell'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const configKeys = [
  { section: 'General', icon: Globe, fields: [
    { label: 'Site Name', key: 'siteName', type: 'text', placeholder: 'Nexvora' },
    { label: 'Site URL', key: 'siteUrl', type: 'text', placeholder: 'https://nexvora.com' },
    { label: 'Tagline', key: 'tagline', type: 'text', placeholder: 'Innovative IT Solutions' },
    { label: 'Support Email', key: 'supportEmail', type: 'email', placeholder: 'hello@nexvora.com' },
  ]},
  { section: 'Email Notifications', icon: Mail, fields: [
    { label: 'Admin Email', key: 'adminEmail', type: 'email', placeholder: 'admin@nexvora.com' },
    { label: 'New Contact Alert', key: 'notifyNewContact', type: 'toggle', placeholder: '' },
    { label: 'Weekly Report', key: 'notifyWeeklyReport', type: 'toggle', placeholder: '' },
  ]},
]

export default function SettingsPage() {
  const { data: config, isLoading } = useSWR<Record<string, string>>('/api/admin/config', fetcher)
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const get = (key: string) => {
    if (key in values) return values[key]
    return config?.[key] ?? ''
  }

  const set = (key: string, value: string) => setValues(prev => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const allKeys = configKeys.flatMap(s => s.fields.map(f => f.key))
      const payload: Record<string, string> = {}
      allKeys.forEach(key => { payload[key] = get(key) })
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      toast.success('Settings saved!')
      setValues({})
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminShell>
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Settings</h1>
              <p className="text-gray-400 text-sm">Manage your site configuration</p>
            </div>
            <motion.button
              onClick={handleSave}
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-primary-600 to-accent-500 text-white disabled:opacity-70 transition-all"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {configKeys.map((section, i) => (
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
                    <h3 className="font-semibold text-white">{section.section}</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm text-gray-400 mb-1.5">{field.label}</label>
                        {field.type === 'toggle' ? (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => set(field.key, get(field.key) === 'true' ? 'false' : 'true')}
                              className={`relative w-11 h-6 rounded-full transition-colors ${get(field.key) === 'true' ? 'bg-primary-500' : 'bg-white/10'}`}
                            >
                              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${get(field.key) === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                            <span className="text-sm text-gray-300">
                              {get(field.key) === 'true' ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        ) : (
                          <input
                            type={field.type}
                            value={get(field.key)}
                            onChange={e => set(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 transition-colors placeholder-gray-600"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
