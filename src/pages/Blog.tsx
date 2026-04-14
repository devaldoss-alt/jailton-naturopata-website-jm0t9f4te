import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen } from 'lucide-react'
import { FadeIn } from '@/components/ui/fade-in'
import { getPublishedPosts, type BlogPost } from '@/services/blog_posts'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])

  const loadPosts = async () => {
    try {
      const data = await getPublishedPosts()
      setPosts(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  useRealtime('blog_posts', () => {
    loadPosts()
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const getImageUrl = (post: BlogPost) => {
    if (post.cover_image) {
      return pb.files.getURL(post, post.cover_image)
    }
    return `https://img.usecurling.com/p/800/600?q=nature%20herbs&seed=${post.id}`
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50/50">
      <div className="container px-4 md:px-6">
        <FadeIn className="max-w-3xl mx-auto text-center mb-16 mt-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#132A1B] mb-6">
            Blog da Saúde Natural
          </h1>
          <p className="text-lg text-muted-foreground">
            Artigos, dicas de saúde e conhecimentos aprofundados sobre terapias naturais para
            transformar sua vida através da Naturopatia.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <FadeIn key={post.id} delay={index * 100}>
              <Card className="relative overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 border-border/50 group bg-white">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img
                    src={getImageUrl(post)}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 z-20 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
                    Naturopatia
                  </div>
                </div>
                <CardHeader className="pt-6">
                  <div className="flex items-center text-sm text-muted-foreground mb-3 gap-3">
                    <span>{formatDate(post.created)}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>Leitura Rápida</span>
                  </div>
                  <h2 className="text-2xl font-bold leading-tight line-clamp-2 text-[#132A1B] group-hover:text-primary transition-colors">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="focus:outline-none before:absolute before:inset-0"
                    >
                      {post.title}
                    </Link>
                  </h2>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="pb-6">
                  <Button
                    variant="ghost"
                    className="p-0 text-primary hover:text-primary/80 hover:bg-transparent group/btn font-semibold relative z-20"
                    asChild
                  >
                    <Link to={`/blog/${post.slug}`} className="flex items-center">
                      Ler Artigo Completo
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </FadeIn>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Nenhum artigo publicado no momento.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
