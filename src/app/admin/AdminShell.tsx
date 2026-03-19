'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
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
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <div className="flex h-screen overflow-hidden bg-[#050510]">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 256 : 72 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 border-r border-white/10 flex flex-col bg-[#080818]"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/10 gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
            <Zap size={18} className="text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-bold gradient-text text-lg">NEXVORA</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = isActive(href)
            return (
              <Link key={href} href={href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    active
                      ? 'bg-gradient-to-r from-primary-600/30 to-accent-500/20 text-white border border-primary-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="text-sm font-medium flex-1">{label}</span>
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <a href="/" target="_blank" rel="noopener noreferrer">
            <motion.div
              whileHover={{ x: 2 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all"
            >
              <ExternalLink size={18} className="flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">View Site</span>}
            </motion.div>
          </a>
          <motion.div
            whileHover={{ x: 2 }}
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/5 cursor-pointer transition-all"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
          </motion.div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#080818]/50 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                placeholder="Search..."
                className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-primary-500 w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white">
                A
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-white">Admin</div>
                <div className="text-xs text-gray-500">admin@nexvora.com</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
