'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { Zap, Github, Twitter, Linkedin, Mail, Facebook, Instagram } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Footer() {
  const t = useTranslations('footer')
  const navT = useTranslations('nav')
  const locale = useLocale()
  
  const { data: config } = useSWR<Record<string, string>>('/api/config', fetcher)
  
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

  const socialIcons = [
    { Icon: Github, href: config?.socialGithub || '#' },
    { Icon: Twitter, href: config?.socialTwitter || '#' },
    { Icon: Linkedin, href: config?.socialLinkedin || '#' },
    { Icon: Facebook, href: config?.socialFacebook },
    { Icon: Instagram, href: config?.socialInstagram },
    { Icon: Mail, href: `mailto:${config?.supportEmail || 'hello@nexvora.com'}` },
  ].filter(s => s.href && s.href !== '#')

  return (
    <footer className="relative border-t border-white/10 pt-16 pb-8 overflow-hidden bg-[#0a0a14]">
      {/* Background decoration */}
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4 group cursor-pointer">
              <Link href={`/${locale}`} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                  <Zap size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">{config?.siteName || 'NEXVORA'}</span>
              </Link>
            </div>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-6">
              {t('description')}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {socialIcons.map(({ Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center text-gray-400 hover:text-primary-400 border border-white/10 hover:border-primary-500/30 transition-all duration-300"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h4 className="font-semibold text-white tracking-wide">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-gray-500 text-xs sm:text-sm">
            <span>&copy; {new Date().getFullYear()} {config?.siteName || 'Nexvora'}</span>
            <span className="w-1 h-1 bg-gray-700 rounded-full" />
            <span>{t('rights')}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm italic">{t('made_with')}</span>
            <div className="flex -space-x-1.5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
               {/* Decorative dots or avatars if needed */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
