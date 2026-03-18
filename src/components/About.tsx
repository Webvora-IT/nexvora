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

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true })

  return (
    <section id="about" className="py-24 relative overflow-hidden">
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
            About Nexvora
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built by Experts,
            <br />
            <span className="gradient-text">Driven by Innovation</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            We&apos;re a team of passionate engineers, designers, and strategists who believe
            that great technology can transform any business. Based globally, thinking locally.
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
              className="glass rounded-2xl p-6 text-center border border-white/10"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Team */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-2">Meet the Team</h3>
          <p className="text-gray-400">The brilliant minds behind Nexvora</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1 + 0.3 }}
              whileHover={{ y: -8 }}
              className="glass rounded-2xl p-6 text-center border border-white/10 hover:border-primary-500/30 transition-all group"
            >
              <div className="text-5xl mb-4">{member.avatar}</div>
              <h4 className="font-bold text-white text-lg">{member.name}</h4>
              <p className="text-primary-400 text-sm mb-3">{member.role}</p>
              <p className="text-gray-400 text-xs mb-4">{member.bio}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {member.skills.map((skill, j) => (
                  <span
                    key={j}
                    className="px-2 py-0.5 text-xs glass rounded-full text-gray-400 border border-white/10"
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
