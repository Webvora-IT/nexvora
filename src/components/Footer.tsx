'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Github, Twitter, Linkedin, Mail } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')
  const navT = useTranslations('nav')
  const locale = useLocale()
  
  const footerLinks = {
    [t('links.services')]: [
      { label: t('nav_links.web'), href: `/${locale}/#services` },
      { label: t('nav_links.mobile'), href: `/${locale}/#services` },
      { label: t('nav_links.devops'), href: `/${locale}/#services` },
      { label: t('nav_links.ai'), href: `/${locale}/#services` },
      { label: t('nav_links.automation'), href: `/${locale}/#services` },
      { label: t('nav_links.cyber'), href: `/${locale}/#services` },
    ],
    [t('links.company')]: [
      { label: navT('about'), href: `/${locale}/#about` },
      { label: navT('portfolio'), href: `/${locale}/#portfolio` },
      { label: navT('blog'), href: `/${locale}/blog` },
      { label: navT('contact'), href: `/${locale}/#contact` },
    ],
    [t('links.legal')]: [
      { label: t('legal_links.privacy'), href: '#' },
      { label: t('legal_links.terms'), href: '#' },
      { label: t('legal_links.cookies'), href: '#' },
    ],
  }

  return (
    <footer className="relative border-t border-white/10 pt-16 pb-8">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">NEXVORA</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-6">
              {t('description')}
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Nexvora. {t('rights')}
          </p>
          <p className="text-gray-500 text-sm">{t('made_with')}</p>
        </div>
      </div>
    </footer>
  )
}
