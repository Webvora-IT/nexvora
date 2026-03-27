import { prisma } from '@/lib/prisma'
import BlogPostClient from './BlogPostClient'
import { notFound } from 'next/navigation'

export const revalidate = 60

async function getPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        image: true,
        tags: true,
        publishedAt: true,
        createdAt: true,
      },
    })
    
    if (!post) return null

    // Ensure serializable data
    return {
      ...post,
      publishedAt: post.publishedAt?.toISOString() || null,
      createdAt: post.createdAt.toISOString(),
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  
  if (!post) {
    notFound()
  }

  return <BlogPostClient initialPost={post as any} />
}
