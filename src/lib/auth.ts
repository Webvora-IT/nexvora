import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        try {
          console.log('Attempting login for:', credentials.email)
          const user = await prisma.user.findUnique({ where: { email: credentials.email } })
          if (!user) {
            console.log('User not found:', credentials.email)
            return null
          }
          console.log('User found, verifying password...')
          const valid = await bcrypt.compare(credentials.password, user.password)
          if (!valid) {
            console.log('Invalid password for:', credentials.email)
            return null
          }
          console.log('Login successful for:', credentials.email)
          return { id: user.id, email: user.email, name: user.name }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string
      }
      return session
    },
  },
}
