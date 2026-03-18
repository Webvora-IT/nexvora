'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
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
    // Remove current locale prefix if present
    const pathWithoutLocale = pathname.replace(/^\/(fr|en|es)/, '') || '/'
    const newPath = newLocale === 'fr' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`
    router.push(newPath)
    setOpen(false)
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-full text-sm text-gray-300 border border-white/10 hover:border-white/20 transition-colors"
      >
        <Globe size={14} className="text-primary-400" />
        <span>{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-40 glass rounded-xl border border-white/10 overflow-hidden z-50 shadow-xl"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => switchLocale(lang.code)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${
                    locale === lang.code ? 'text-primary-400 bg-primary-500/10' : 'text-gray-300'
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  {lang.label}
                  {locale === lang.code && <span className="ml-auto w-1.5 h-1.5 bg-primary-400 rounded-full" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
