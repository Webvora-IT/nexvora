'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import ThemeSwitcher from '@/components/ThemeSwitcher'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Determine the base path for anchor links. 
  // If we're on the blog page, they must point to the home page with the anchor.
  const isHomePage = pathname === `/${locale}` || pathname === '/' || pathname === `/${locale}/`
  const baseHref = isHomePage ? '' : (locale === 'fr' ? '/' : `/${locale}/`)

  const navLinks = [
    { href: `${baseHref}#home`, label: t('home') },
    { href: `${baseHref}#services`, label: t('services') },
    { href: `${baseHref}#portfolio`, label: t('portfolio') },
    { href: `${baseHref}#about`, label: t('about') },
    { href: `${baseHref}#testimonials`, label: t('testimonials') },
    { href: `/${locale}/blog`, label: t('blog'), isPage: true },
    { href: `${baseHref}#contact`, label: t('contact') },
  ]

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-white/10 py-3'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">NEXVORA</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              link.isPage ? (
                <motion.div key={link.href} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 0.3 }}>
                  <Link href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white transition-colors duration-200 text-sm font-black uppercase tracking-widest relative group">
                    {link.label}
                    <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-500 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                  </Link>
                </motion.div>
              ) : (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white transition-colors duration-200 text-sm font-black uppercase tracking-widest relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-500 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                  </motion.a>
              )
            ))}
          </div>

          {/* CTA Buttons + Language Switcher */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full text-sm font-semibold text-white glow hover:opacity-90 transition-opacity"
            >
              {t('cta')}
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10 mt-3"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white py-3 text-base font-black uppercase tracking-widest transition-colors"
                  >
                    {link.label}
                  </a>
              ))}
              <div className="flex items-center justify-between py-2">
                <LanguageSwitcher />
                <ThemeSwitcher />
              </div>
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full text-sm font-semibold text-white text-center mt-4"
              >
                {t('cta')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
