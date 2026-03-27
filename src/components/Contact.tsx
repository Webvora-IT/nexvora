'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react'

import { useTranslations } from 'next-intl'

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

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 glass rounded-full text-sm text-green-400 border border-green-500/30 mb-4">
            {t('badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('title')}
            <br />
            <span className="gradient-text">{t('titleGradient')}</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Cards */}
          <div className="space-y-4">
            {[
              {
                icon: Mail,
                label: t('labels.email'),
                value: 'hello@nexvora.com',
                color: 'from-primary-500 to-indigo-600',
              },
              {
                icon: Phone,
                label: t('labels.phone'),
                value: '+33 6 00 00 00 00',
                color: 'from-accent-500 to-blue-600',
              },
              {
                icon: MapPin,
                label: t('labels.location'),
                value: 'Remote-First, Worldwide',
                color: 'from-purple-500 to-pink-600',
              },
            ].map(({ icon: Icon, label, value, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-5 border border-white/10 flex items-center gap-4"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider">{label}</div>
                  <div className="text-white font-medium">{value}</div>
                </div>
              </motion.div>
            ))}

            {/* Why choose us */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-5 border border-white/10"
            >
              <h4 className="font-bold text-white mb-3">{t('why_title')}</h4>
              {[
                t('why_item1'),
                t('why_item2'),
                t('why_item3'),
                t('why_item4'),
                t('why_item5'),
              ].map((item, i) => (
                <p key={i} className="text-gray-400 text-sm py-1 flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                  {item}
                </p>
              ))}
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
              <div className="glass rounded-2xl p-12 border border-green-500/30 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <CheckCircle size={64} className="text-green-400" />
                  <h3 className="text-2xl font-bold text-white">{t('success_title')}</h3>
                  <p className="text-gray-400">{t('success_subtitle')}</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full font-medium mt-4"
                  >
                    {t('send_another')}
                  </button>
                </motion.div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass rounded-2xl p-8 border border-white/10 space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">{t('labels.fullName')}</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">{t('labels.emailStar')}</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@company.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">{t('labels.phoneLabel')}</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+33 6 ..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">{t('labels.company')}</label>
                    <input
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t('labels.service')}</label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full bg-[#0f0f1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  >
                    <option value="">{t('labels.selectService')}</option>
                    {serviceOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t('labels.message')}</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                  />
                </div>
                {error && (
                  <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary-600 to-accent-500 rounded-xl font-semibold text-lg glow hover:opacity-90 transition-opacity disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> {t('sending')}
                    </>
                  ) : (
                    <>
                      <Send size={20} /> {t('send_button')}
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
