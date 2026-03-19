import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SessionProvider from '@/components/SessionProvider'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Nexvora Admin Panel',
  description: 'Admin dashboard for Nexvora',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <SessionProvider session={session}>
      <Toaster position="top-right" />
      {children}
    </SessionProvider>
  )
}
