'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function DesignEffects() {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth springs for the cursor follower
  const springConfig = { damping: 25, stiffness: 150 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mouseX, mouseY, isMobile])

  if (!mounted || isMobile) return <div className="mesh-bg" />

  return (
    <>
      {/* Dynamic Mesh Background */}
      <div className="mesh-bg" />

      {/* Spotlight Follower */}
      <motion.div
        className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none z-[1] mix-blend-soft-light opacity-50"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        }}
      />
      
      <motion.div
        className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-[1] mix-blend-overlay opacity-30"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)',
        }}
      />
    </>
  )
}
