'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  MessageSquare,
  FolderOpen,
  Star,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
  Bell,
  Search,
  Wrench,
  Users,
  ExternalLink,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'

const navItems: { icon: LucideIcon; label: string; href: string }[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: MessageSquare, label: 'Contacts', href: '/admin/contacts' },
  { icon: FolderOpen, label: 'Projects', href: '/admin/projects' },
  { icon: Wrench, label: 'Services', href: '/admin/services' },
  { icon: Star, label: 'Testimonials', href: '/admin/testimonials' },
  { icon: BookOpen, label: 'Blog', href: '/admin/blog' },
  { icon: Users, label: 'Team', href: '/admin/team' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) setSidebarOpen(false)
      else setSidebarOpen(true)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="flex h-screen overflow-hidden bg-[#050510] text-gray-300">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? (isMobile ? 280 : 260) : (isMobile ? 0 : 80),
          x: isMobile && !sidebarOpen ? -280 : 0
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed lg:relative z-50 h-full flex-shrink-0 border-r border-white/5 flex flex-col bg-[#0a0a1a] shadow-2xl transition-all duration-300`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 gap-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
            <Zap size={22} className="text-white" />
          </div>
          {(sidebarOpen || (isMobile && sidebarOpen)) && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-black text-xl tracking-tighter text-white"
            >
              NEXVORA<span className="text-primary-500">.</span>
            </motion.span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-hide py-6">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = isActive(href)
            return (
              <Link key={href} href={href} onClick={() => isMobile && setSidebarOpen(false)}>
                <motion.div
                  className={`group relative flex items-center gap-3.5 px-3.5 py-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                    active
                      ? 'bg-primary-500/10 text-white'
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {active && (
                     <motion.div 
                        layoutId="active-pill"
                        className="absolute left-0 w-1 h-6 bg-primary-500 rounded-r-full" 
                     />
                  )}
                  <Icon size={20} className={`flex-shrink-0 transition-colors ${active ? 'text-primary-400' : 'group-hover:text-primary-400'}`} />
                  {(sidebarOpen || (isMobile && sidebarOpen)) && (
                    <span className="text-sm font-bold tracking-wide flex-1">{label}</span>
                  )}
                  {active && sidebarOpen && (
                    <ChevronRight size={14} className="text-primary-500/50" />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-white/5 space-y-2 bg-black/20">
          <a href="/" target="_blank" rel="noopener noreferrer">
            <div className="flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
              <ExternalLink size={20} className="flex-shrink-0" />
              {(sidebarOpen || (isMobile && sidebarOpen)) && <span className="text-sm font-bold">Live Site</span>}
            </div>
          </a>
          <button 
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut size={20} className="flex-shrink-0" />
            {(sidebarOpen || (isMobile && sidebarOpen)) && <span className="text-sm font-bold">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-5">
            <button
              onClick={toggleSidebar}
              className="p-2.5 bg-white/5 text-gray-400 hover:text-white hover:bg-primary-500/10 rounded-xl border border-white/5 hover:border-primary-500/20 transition-all shadow-inner"
            >
              {sidebarOpen && !isMobile ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <div className="relative hidden sm:flex items-center">
              <Search size={18} className="absolute left-4 text-gray-600" />
              <input
                placeholder="Quick search..."
                className="pl-12 pr-6 py-2.5 bg-white/5 border border-white/5 rounded-2xl text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 w-72 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 bg-white/5 text-gray-400 hover:text-primary-400 rounded-xl border border-white/5 hover:border-primary-500/20 transition-all shadow-inner"
            >
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full animate-pulse shadow-glow" />
            </motion.button>
            
            <div className="flex items-center gap-3 pl-5 border-l border-white/5 h-10">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-black text-white leading-none mb-1 uppercase tracking-wider">Admin</p>
                <p className="text-[10px] font-bold text-gray-600">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-primary-500/10 border-2 border-white/5">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-hide bg-[#050510] relative">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
             <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px]" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[140px]" />
          </div>
          <div className="relative z-10 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
