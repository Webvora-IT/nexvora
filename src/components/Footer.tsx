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
    <footer className="relative border-t border-gray-200 dark:border-white/10 pt-20 pb-10 overflow-hidden bg-white dark:bg-[#030617] transition-colors duration-500">
      {/* Background decoration */}
      <div className="absolute inset-0 grid-pattern opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />
      <div className="absolute -top-24 -right-48 w-96 h-96 bg-primary-600/5 dark:bg-primary-600/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -left-48 w-96 h-96 bg-accent-500/5 dark:bg-accent-500/10 rounded-full blur-[100px]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8 group cursor-pointer">
              <Link href={`/${locale}`} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 duration-500 shadow-xl shadow-primary-500/20">
                  <Zap size={24} strokeWidth={3} className="text-white" />
                </div>
                <span className="text-3xl font-black text-gray-950 dark:text-white tracking-tighter uppercase italic">
                  {config?.siteName || 'NEXVORA'}<span className="text-primary-500 not-italic">.</span>
                </span>
              </Link>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-10 font-medium italic">
              {t('description')}
            </p>
            <div className="flex flex-wrap gap-4">
              {socialIcons.map(({ Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary-500/50 transition-all duration-300 shadow-lg shadow-black/5"
                >
                  <Icon size={22} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-8">
              <h4 className="font-black text-gray-950 dark:text-white tracking-tight text-sm uppercase italic border-l-4 border-primary-500 pl-4">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-xs font-black uppercase tracking-widest transition-all duration-300 hover:translate-x-2 inline-block"
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
        <div className="pt-10 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5 text-gray-500 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">
            <span>&copy; {new Date().getFullYear()} {config?.siteName || 'Nexvora'}</span>
            <span className="w-1.5 h-1.5 bg-primary-500/30 rounded-full" />
            <span>{t('rights')}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-gray-400 dark:text-gray-600 text-[10px] font-black uppercase tracking-widest italic">{t('made_with')}</span>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/5">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">System Live</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
