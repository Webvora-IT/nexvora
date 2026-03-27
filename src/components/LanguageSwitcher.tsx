'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'

const languages = [
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
]

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const currentLang = languages.find(l => l.code === locale) || languages[0]

  const switchLocale = (newLocale: string) => {
    // 1. Manually set the cookie for middleware backup
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // 2. Use locale-aware router for navigation (instantly updates UI)
    router.replace(pathname, { locale: newLocale })
    
    setOpen(false)
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 px-4 py-2 bg-gray-50/50 dark:bg-white/5 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-primary-500/30 transition-all shadow-sm"
      >
        <Globe size={14} className="text-primary-600 dark:text-primary-400 group-hover:rotate-12 transition-transform" />
        <span className="ml-1">{currentLang.flag}</span>
        <span className="hidden sm:inline italic">{currentLang.code.toUpperCase()}</span>
        <ChevronDown size={14} strokeWidth={3} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 top-full mt-3 w-44 bg-white dark:bg-[#0a0a1a]/95 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 shadow-2xl shadow-primary-500/10"
            >
              <div className="px-4 py-3 border-b border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Language</span>
              </div>
              <div className="p-1.5 space-y-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLocale(lang.code)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                      locale === lang.code 
                        ? 'bg-primary-500/10 text-primary-600 dark:text-white' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-950 dark:hover:text-white'
                    }`}
                  >
                    <span className="text-lg grayscale-0">{lang.flag}</span>
                    <span className="flex-1 text-left">{lang.label}</span>
                    {locale === lang.code && (
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
