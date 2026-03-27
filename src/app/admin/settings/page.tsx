'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { Save, Globe, Mail, Loader2, Share2, Zap, Bell, Phone, MapPin, ShieldCheck, MailWarning } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminShell from '../AdminShell'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const configKeys = [
  { section: 'Notifications & Security', icon: Bell, fields: [
    { label: 'Admin Email (Primary)', key: 'adminEmail', type: 'email', placeholder: 'admin@nexvora.com' },
    { label: 'New Contact Alert (Email)', key: 'notifyNewContact', type: 'toggle', placeholder: '' },
    { label: 'System Health Reports', key: 'notifySystemHealth', type: 'toggle', placeholder: '' },
    { label: 'Weekly Summary Report', key: 'notifyWeeklyReport', type: 'toggle', placeholder: '' },
  ]},
  { section: 'General Brand', icon: Globe, fields: [
    { label: 'Site Name', key: 'siteName', type: 'text', placeholder: 'Nexvora' },
    { label: 'Site URL', key: 'siteUrl', type: 'text', placeholder: 'https://nexvora.com' },
    { label: 'Tagline', key: 'tagline', type: 'text', placeholder: 'Innovative IT Solutions' },
  ]},
  { section: 'Social Presence', icon: Share2, fields: [
    { label: 'Github', key: 'socialGithub', type: 'text', placeholder: 'https://github.com/nexvora' },
    { label: 'Twitter', key: 'socialTwitter', type: 'text', placeholder: 'https://twitter.com/nexvora' },
    { label: 'LinkedIn', key: 'socialLinkedin', type: 'text', placeholder: 'https://linkedin.com/company/nexvora' },
    { label: 'Instagram', key: 'socialInstagram', type: 'text', placeholder: 'https://instagram.com/nexvora' },
    { label: 'Facebook', key: 'socialFacebook', type: 'text', placeholder: 'https://facebook.com/nexvora' },
  ]},
  { section: 'Hero Stats', icon: Zap, fields: [
    { label: 'Projects Delivered', key: 'statProjects', type: 'text', placeholder: '200+' },
    { label: 'Happy Clients', key: 'statClients', type: 'text', placeholder: '50+' },
    { label: 'Years Experience', key: 'statYears', type: 'text', placeholder: '5+' },
    { label: 'Client Satisfaction', key: 'statSatisfaction', type: 'text', placeholder: '99%' },
  ]},
  { section: 'Contact Details', icon: Mail, fields: [
    { label: 'Support Email', key: 'supportEmail', type: 'email', placeholder: 'hello@nexvora.com' },
    { label: 'Phone Number', key: 'contactPhone', type: 'text', placeholder: '+1 234 567 890' },
    { label: 'Office Address', key: 'contactAddress', type: 'text', placeholder: '123 Tech Lane, Silicon Valley' },
  ]},
]

export default function SettingsPage() {
  const { data: config, isLoading, mutate } = useSWR<Record<string, string>>('/api/admin/config', fetcher)
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const getValue = (key: string) => {
    if (key in values) return values[key]
    return config?.[key] ?? ''
  }

  const setValue = (key: string, value: string) => setValues(prev => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const allKeys = configKeys.flatMap(s => s.fields.map(f => f.key))
      const payload: Record<string, string> = {}
      allKeys.forEach(key => { payload[key] = getValue(key) })
      
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      if (!res.ok) throw new Error()
      
      toast.success('Settings saved successfully!')
      mutate() // Revalidate
      setValues({})
    } catch {
      toast.error('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminShell>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
          >
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">Platform Settings</h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Configure site-wide branding and communications</p>
            </div>
            <motion.button
              onClick={handleSave}
              disabled={saving}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-lg font-black bg-gradient-to-r from-primary-600 to-indigo-600 text-white disabled:opacity-70 transition-all shadow-2xl shadow-primary-500/20 active:shadow-none"
            >
              {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} className="group-hover:rotate-12 transition-transform" />}
              {saving ? 'Saving...' : 'COMMIT CHANGES'}
            </motion.button>
          </motion.div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6 bg-[#0a0a1a] rounded-3xl border border-white/5">
              <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-primary-500 animate-spin" />
              <p className="text-gray-500 font-bold uppercase tracking-widest animate-pulse">Synchronizing Data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {configKeys.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl ${i === 0 ? 'md:col-span-2 border-primary-500/20 shadow-primary-500/5' : ''}`}
                >
                  <div className="flex items-center gap-4 px-8 py-5 border-b border-white/5 bg-white/2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600/20 to-indigo-600/20 flex items-center justify-center border border-primary-500/20 shadow-inner">
                      <section.icon size={20} className="text-primary-400" />
                    </div>
                    <h3 className="font-black text-white tracking-widest uppercase text-sm">{section.section}</h3>
                  </div>
                  <div className={`p-8 space-y-7 ${i === 0 ? 'grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7' : ''}`}>
                    {section.fields.map((field) => (
                      <div key={field.key} className={field.type === 'toggle' ? 'flex items-center justify-between gap-6 p-4 bg-white/2 rounded-2xl border border-white/5' : 'space-y-2'}>
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">{field.label}</label>
                           {field.type === 'toggle' && (
                              <p className="text-[10px] text-gray-600 font-medium">Toggle automated email notifications for this event.</p>
                           )}
                        </div>
                        
                        {field.type === 'toggle' ? (
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => setValue(field.key, getValue(field.key) === 'true' ? 'false' : 'true')}
                              className={`relative w-14 h-8 rounded-full transition-all duration-300 transform shadow-inner ${getValue(field.key) === 'true' ? 'bg-primary-500 ring-4 ring-primary-500/20' : 'bg-white/10 ring-4 ring-white/5 border border-white/10'}`}
                            >
                              <span className={`absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all shadow-xl ${getValue(field.key) === 'true' ? 'translate-x-7' : 'translate-x-1.5'}`} />
                            </button>
                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors w-12 text-center ${getValue(field.key) === 'true' ? 'text-primary-400' : 'text-gray-600'}`}>
                              {getValue(field.key) === 'true' ? 'ON' : 'OFF'}
                            </span>
                          </div>
                        ) : (
                          <div className="relative group">
                            <input
                              type={field.type}
                              value={getValue(field.key)}
                              onChange={e => setValue(field.key, e.target.value)}
                              placeholder={field.placeholder}
                              className="w-full px-6 py-4 bg-[#050510] border border-white/10 rounded-2xl text-white text-sm font-medium focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all placeholder-gray-700 shadow-inner group-hover:border-white/20"
                            />
                            {field.key.includes('social') && <Share2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none group-hover:text-primary-500/30 transition-colors" size={16} />}
                            {field.type === 'email' && <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none group-hover:text-primary-500/30 transition-colors" size={16} />}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-12 flex items-center justify-center gap-6 opacity-30">
             <ShieldCheck size={20} className="text-green-500" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em]">Secure Configuration Protocol Active</p>
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
