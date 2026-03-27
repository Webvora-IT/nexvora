import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Nexvora | Solutions IT Innovantes',
  description: 'Nexvora livre des solutions web, mobile, IA, DevOps et automatisation pour transformer votre entreprise.',
}

import DesignEffects from '@/components/DesignEffects'

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()

  return (
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased relative transition-colors duration-500">
        <DesignEffects />
        <NextIntlClientProvider messages={messages}>
          <div className="relative z-10">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
