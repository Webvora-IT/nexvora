import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './src/i18n'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // /fr/ only when not default
})

export const config = {
  // Match all paths except admin, api, _next, and static files
  matcher: ['/((?!admin|api|_next|_vercel|.*\\..*).*)'],
}
