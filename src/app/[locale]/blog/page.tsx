import { prisma } from '@/lib/prisma'
import BlogClient from './BlogClient'

export const revalidate = 60 // Revalidate every minute for better performance

async function getPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        tags: true,
        publishedAt: true,
        createdAt: true,
      },
    })
    
    // Ensure data is serializable
    return posts.map(post => ({
      ...post,
      publishedAt: post.publishedAt?.toISOString() || null,
      createdAt: post.createdAt.toISOString(),
    }))
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getPosts()
  
  return <BlogClient initialPosts={posts as any} />
}
