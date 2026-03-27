'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.className = savedTheme
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.className = newTheme
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 12 }}
      whileTap={{ scale: 0.9, rotate: -12 }}
      onClick={toggleTheme}
      className="p-2.5 rounded-2xl glass border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white transition-all duration-300 shadow-sm"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun size={18} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
      ) : (
        <Moon size={18} className="text-primary-600 drop-shadow-[0_0_8px_rgba(79,70,229,0.3)]" />
      )}
    </motion.button>
  )
}
