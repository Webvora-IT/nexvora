Create a new component for Nexvora.

When creating a component, follow these conventions:

1. Add `'use client'` if it has state, effects, or event handlers
2. Import translations: `const t = useTranslations('sectionKey')`
3. Add translations to `messages/fr.json`, `messages/en.json`, `messages/es.json`
4. Use Framer Motion for animations with `useInView` for scroll triggers
5. Follow the dark theme: `bg-[#0a0a14]`, `glass` cards, `text-white`, `text-gray-400`
6. Use `cn()` from `@/lib/utils` for conditional classes

Template:
```tsx
'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function MyComponent() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const t = useTranslations('mySection')

  return (
    <section ref={ref} id="my-section" className="py-24 bg-[#0a0a14]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* content */}
        </motion.div>
      </div>
    </section>
  )
}
```
