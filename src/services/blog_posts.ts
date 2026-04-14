import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface BlogPost extends RecordModel {
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image?: string
  published: boolean
}

export const getPublishedPosts = async () => {
  return await pb.collection('blog_posts').getFullList<BlogPost>({
    filter: 'published = true',
    sort: '-created',
  })
}

export const getPostBySlug = async (slug: string) => {
  return await pb.collection('blog_posts').getFirstListItem<BlogPost>(`slug = "${slug}"`)
}
