import { createNavigation } from 'next-intl/navigation'

export const locales = ['fr', 'en', 'es'] as const
export const defaultLocale = 'fr' as const

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
})
