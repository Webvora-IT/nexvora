'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, Loader2, AlertCircle } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    if (result?.error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030617] flex items-center justify-center p-4 transition-colors duration-500">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
         <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary-500 to-accent-500 mb-6 shadow-2xl shadow-primary-500/20 animate-pulse-glow">
            <Zap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-950 dark:text-white uppercase tracking-tighter italic">NEXVORA Admin</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-bold uppercase tracking-widest mt-2">Connectez-vous à votre espace admin</p>
        </div>

        {/* Form */}
         <div className="glass rounded-[2rem] p-10 border border-gray-200 dark:border-white/10 shadow-2xl bg-white dark:bg-transparent">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

             <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" />
                 <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@nexvora.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                />
              </div>
            </div>

             <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" />
                 <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-medium"
                />
              </div>
            </div>

             <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-primary-600 to-accent-500 rounded-2xl font-black text-white uppercase tracking-widest shadow-xl shadow-primary-500/20 disabled:opacity-70 transition-all"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Connexion...</> : 'Se Connecter'}
            </motion.button>
          </form>

           <p className="text-center text-gray-500 text-[10px] font-black uppercase tracking-widest mt-6">
            Accès réservé aux administrateurs autorisés
          </p>
        </div>
      </motion.div>
    </div>
  )
}
