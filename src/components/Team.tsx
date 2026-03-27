'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Github, Linkedin, Users } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string
  bio?: string | null
  imageUrl?: string | null
  linkedin?: string | null
  github?: string | null
  order: number
}

const STATIC_TEAM: TeamMember[] = [
  { id: '1', name: 'Alexandre Moreau', role: 'CEO & Founder', bio: 'Visionary leader with 15+ years in enterprise software and digital transformation.', imageUrl: null, linkedin: '#', github: null, order: 1 },
  { id: '2', name: 'Sarah Chen', role: 'CTO', bio: 'Full-stack architect specializing in cloud-native systems and AI/ML pipelines.', imageUrl: null, linkedin: '#', github: '#', order: 2 },
  { id: '3', name: 'Karim Benali', role: 'Lead DevOps Engineer', bio: 'Expert in Kubernetes, CI/CD automation and infrastructure-as-code practices.', imageUrl: null, linkedin: '#', github: '#', order: 3 },
  { id: '4', name: 'Emma Thornton', role: 'Head of Product', bio: 'Product strategist bridging the gap between business requirements and technical delivery.', imageUrl: null, linkedin: '#', github: null, order: 4 },
  { id: '5', name: 'Lucas Ferreira', role: 'Senior Mobile Developer', bio: 'React Native & Flutter specialist with apps serving millions of users worldwide.', imageUrl: null, linkedin: '#', github: '#', order: 5 },
  { id: '6', name: 'Yasmine Diallo', role: 'AI/ML Engineer', bio: 'Machine learning researcher turning complex models into production-ready solutions.', imageUrl: null, linkedin: '#', github: '#', order: 6 },
]

const AVATAR_COLORS = [
  'from-indigo-500 to-purple-600',
  'from-cyan-500 to-blue-600',
  'from-violet-500 to-indigo-600',
  'from-blue-500 to-cyan-600',
  'from-purple-500 to-violet-600',
  'from-indigo-400 to-cyan-500',
]

import { useTranslations } from 'next-intl'

export default function Team() {
  const t = useTranslations('about')
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [team, setTeam] = useState<TeamMember[]>(STATIC_TEAM)

  useEffect(() => {
    fetch('/api/team')
      .then(r => r.json())
      .then((data: TeamMember[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setTeam(data.filter(m => (m as any).published !== false))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="team" ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            {t('badge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('team_title')}
            <span className="gradient-text ml-2">NEXVORA</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('team_subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass rounded-2xl p-6 border border-white/10 hover:border-indigo-500/30 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                  {member.imageUrl ? (
                    <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-xl">
                      {member.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-lg leading-tight">{member.name}</h3>
                  <p className="text-indigo-400 text-sm font-medium mt-0.5">{member.role}</p>
                </div>
              </div>

              {member.bio && (
                <p className="text-gray-400 text-sm leading-relaxed mt-4 line-clamp-3">
                  {member.bio}
                </p>
              )}

              {(member.linkedin || member.github) && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                  {member.linkedin && member.linkedin !== '#' && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-gray-400 hover:text-indigo-400 transition-colors text-xs font-medium"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      LinkedIn
                    </a>
                  )}
                  {member.github && member.github !== '#' && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-xs font-medium"
                    >
                      <Github className="w-3.5 h-3.5" />
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
