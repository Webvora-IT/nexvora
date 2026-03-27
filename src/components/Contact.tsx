'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Contact() {
  const t = useTranslations('contact')
  const [ref, inView] = useInView({ triggerOnce: true })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
  })

  const { data: config } = useSWR<Record<string, string>>('/api/config', fetcher)

  const serviceOptions = [
    t('services.web'),
    t('services.mobile'),
    t('services.ai'),
    t('services.devops'),
    t('services.automation'),
    t('services.cyber'),
    t('services.other'),
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to send message')
      }
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', company: '', service: '', message: '' })
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      label: t('labels.email'),
      value: config?.supportEmail || 'hello@nexvora.com',
      color: 'from-primary-500 to-indigo-600',
    },
    {
      icon: Phone,
      label: t('labels.phone'),
      value: config?.contactPhone || '+33 6 00 00 00 00',
      color: 'from-accent-500 to-blue-600',
    },
    {
      icon: MapPin,
      label: t('labels.location'),
      value: config?.contactAddress || 'Remote-First, Worldwide',
      color: 'from-purple-500 to-pink-600',
    },
  ]

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-white dark:bg-[#0a0a14] transition-colors duration-500">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[100px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-block px-5 py-2 glass rounded-full text-xs font-black uppercase tracking-widest text-primary-400 border border-primary-500/30 mb-6">
            {t('badge')}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-950 dark:text-white mb-6 leading-tight">
            {t('title')}
            <br />
            <span className="gradient-text">{t('titleGradient')}</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Info Cards */}
          <div className="space-y-4 lg:sticky lg:top-24">
            {contactInfo.map(({ icon: Icon, label, value, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="glass group rounded-3xl p-6 border border-gray-200 dark:border-white/10 flex items-center gap-5 hover:border-primary-500/30 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-lg transition-transform group-hover:scale-110`}
                >
                  <Icon size={24} className="text-white" />
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</div>
                  <div className="text-gray-950 dark:text-white font-bold text-lg break-all">{value}</div>
                </div>
              </motion.div>
            ))}

            {/* Why choose us */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="glass rounded-3xl p-8 border border-gray-200 dark:border-white/10 mt-6"
            >
              <h4 className="font-black text-gray-950 dark:text-white text-lg mb-6 tracking-wide">{t('why_title')}</h4>
              <div className="space-y-4">
                {[
                  t('why_item1'),
                  t('why_item2'),
                  t('why_item3'),
                  t('why_item4'),
                  t('why_item5'),
                ].map((item, i) => (
                  <p key={i} className="text-gray-600 dark:text-gray-400 text-sm font-medium flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={14} className="text-green-400" />
                    </span>
                    {item}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            {success ? (
              <div className="glass rounded-3xl p-16 border border-green-500/30 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500/5" />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-6 relative z-10"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle size={48} className="text-green-400" />
                  </div>
                  <h3 className="text-3xl font-black text-white">{t('success_title')}</h3>
                  <p className="text-gray-400 font-medium text-lg max-w-sm mx-auto">{t('success_subtitle')}</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-10 py-4 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full font-bold text-white shadow-xl hover:opacity-90 transition-all mt-4"
                  >
                    {t('send_another')}
                  </button>
                </motion.div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-white/10 space-y-8 shadow-2xl transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500">{t('labels.fullName')}</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500">{t('labels.emailStar')}</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@company.com"
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500">{t('labels.phoneLabel')}</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+33 6 ..."
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500">{t('labels.company')}</label>
                    <input
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="..."
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500">{t('labels.service')}</label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#0a0a14] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all appearance-none"
                  >
                    <option value="">{t('labels.selectService')}</option>
                    {serviceOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500">{t('labels.message')}</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="..."
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all resize-none"
                  />
                </div>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="px-5 py-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm font-bold flex items-center gap-3"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    {error}
                  </motion.div>
                )}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(99,102,241,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-primary-600 to-accent-500 rounded-2xl font-black text-xl text-white shadow-xl hover:opacity-90 transition-all disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 size={24} className="animate-spin" /> {t('sending')}
                    </>
                  ) : (
                    <>
                      <Send size={24} /> {t('send_button')}
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
