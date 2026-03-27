'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Award, Users, Target, TrendingUp } from 'lucide-react'

const team = [
  {
    name: 'Alex Rivera',
    role: 'CEO & Tech Lead',
    bio: '10+ years building enterprise software. Former Google engineer.',
    avatar: '👨‍💻',
    skills: ['Architecture', 'Leadership', 'Strategy'],
  },
  {
    name: 'Sofia Chen',
    role: 'Head of AI/ML',
    bio: 'PhD in Machine Learning. Expert in NLP and computer vision.',
    avatar: '👩‍🔬',
    skills: ['TensorFlow', 'PyTorch', 'LLMs'],
  },
  {
    name: 'Marcus Johnson',
    role: 'DevOps Architect',
    bio: 'Cloud infrastructure specialist. AWS/GCP certified.',
    avatar: '👨‍🚀',
    skills: ['Kubernetes', 'Terraform', 'AWS'],
  },
  {
    name: 'Priya Patel',
    role: 'Lead Developer',
    bio: 'Full-stack expert specializing in scalable web applications.',
    avatar: '👩‍💻',
    skills: ['Next.js', 'Node.js', 'PostgreSQL'],
  },
]

const values = [
  { Icon: Award, title: 'Excellence', desc: 'We deliver nothing but the best quality code and solutions.' },
  { Icon: Users, title: 'Collaboration', desc: 'We work closely with clients as true technology partners.' },
  { Icon: Target, title: 'Results-Driven', desc: 'Every project is measured by its business impact.' },
  { Icon: TrendingUp, title: 'Innovation', desc: 'We stay ahead of technology trends to give you the edge.' },
]

import { useTranslations } from 'next-intl'

export default function About() {
  const t = useTranslations('about')
  const [ref, inView] = useInView({ triggerOnce: true })

  const values = [
    { Icon: Award, title: t('values.excellence.title'), desc: t('values.excellence.desc') },
    { Icon: Users, title: t('values.collaboration.title'), desc: t('values.collaboration.desc') },
    { Icon: Target, title: t('values.results.title'), desc: t('values.results.desc') },
    { Icon: TrendingUp, title: t('values.innovation.title'), desc: t('values.innovation.desc') },
  ]

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-white dark:bg-transparent transition-colors duration-500">
      <div className="absolute inset-0">
        <div className="absolute right-0 top-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute left-0 bottom-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 glass rounded-full text-sm text-purple-400 border border-purple-500/30 mb-4">
            {t('badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white mb-6">
            {t('title')}
            <br />
            <span className="gradient-text">{t('titleGradient')}</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {values.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass rounded-3xl p-8 text-center border border-gray-200 dark:border-white/10 hover:border-primary-500/30 transition-all duration-300 shadow-sm"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon size={22} className="text-white" />
              </div>
               <h3 className="font-black text-gray-950 dark:text-white mb-3 text-lg uppercase tracking-tight">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Team Section Removed from About since we have a dedicated Team component */}
         <div className="text-center mb-16">
          <h3 className="text-4xl font-black text-gray-950 dark:text-white mb-4 uppercase tracking-tighter">{t('team_title')}</h3>
          <p className="text-gray-600 dark:text-gray-400 font-bold text-lg">{t('team_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1 + 0.3 }}
              whileHover={{ y: -8 }}
               className="glass rounded-3xl p-8 text-center border border-gray-200 dark:border-white/10 hover:border-primary-500/30 transition-all group shadow-sm bg-gray-50/50 dark:bg-white/5"
            >
              <div className="text-5xl mb-4">{member.avatar}</div>
               <h4 className="font-black text-gray-950 dark:text-white text-xl uppercase tracking-tight mb-1">{member.name}</h4>
              <p className="text-primary-600 dark:text-primary-400 font-black text-xs uppercase tracking-[0.2em] mb-4">{member.role}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 font-medium leading-relaxed">{member.bio}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {member.skills.map((skill, j) => (
                   <span
                    key={j}
                    className="px-3 py-1 text-[10px] font-black uppercase tracking-widest glass rounded-full text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
