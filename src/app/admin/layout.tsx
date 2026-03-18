import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Nexvora Admin Panel',
  description: 'Admin dashboard for Nexvora',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-right" />
      {children}
    </>
  )
}
