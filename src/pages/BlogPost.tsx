import { useEffect, useState } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Clock, Share2, Loader2 } from 'lucide-react'
import { FadeIn } from '@/components/ui/fade-in'
import { useToast } from '@/hooks/use-toast'
import { getPostBySlug, type BlogPost as BlogPostType } from '@/services/blog_posts'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [post, setPost] = useState<BlogPostType | null>(null)
  const [loading, setLoading] = useState(true)

  const loadPost = async () => {
    if (!slug) return
    try {
      const data = await getPostBySlug(slug)
      setPost(data)
    } catch (err) {
      navigate('/blog', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPost()
  }, [slug])

  useRealtime('blog_posts', (e) => {
    if (e.action === 'update' && e.record.slug === slug) {
      loadPost()
    } else if (e.action === 'delete' && e.record.slug === slug) {
      navigate('/blog', { replace: true })
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: 'Link copiado!',
      description: 'O link deste artigo foi copiado para a sua área de transferência.',
    })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const imageUrl = post.cover_image
    ? pb.files.getURL(post, post.cover_image)
    : `https://img.usecurling.com/p/1920/1080?q=nature%20herbs&seed=${post.id}`

  return (
    <article className="pt-20 min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[60vh] w-full bg-[#132A1B] overflow-hidden">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#132A1B] via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container max-w-4xl mx-auto">
            <FadeIn>
              <div className="mb-6">
                <span className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider">
                  Naturopatia
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center text-white/80 gap-6 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.created)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Leitura Rápida</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <FadeIn delay={200}>
          <div className="flex justify-between items-center mb-12 border-b border-border pb-6">
            <Button
              variant="ghost"
              asChild
              className="gap-2 text-muted-foreground hover:text-foreground -ml-4"
            >
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4" />
                Voltar para o Blog
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
              Compartilhar
            </Button>
          </div>

          <div
            className="text-lg max-w-none 
              [&_h2]:text-[#132A1B] [&_h2]:font-bold [&_h2]:text-3xl [&_h2]:mt-12 [&_h2]:mb-6
              [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-6
              [&_ul]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6
              [&_ol]:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6
              [&_li]:mb-2 [&_li]:leading-relaxed
              [&_strong]:text-foreground [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-16 pt-8 border-t border-border bg-white rounded-2xl p-8 shadow-sm text-center">
            <h3 className="text-2xl font-bold text-[#132A1B] mb-4">
              Gostaria de iniciar seu tratamento?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Agende uma avaliação e descubra como a naturopatia pode ajudar você a recuperar seu
              equilíbrio e vitalidade de forma integral.
            </p>
            <Button size="lg" className="rounded-full" asChild>
              <a href="https://wa.me/5571999292989" target="_blank" rel="noopener noreferrer">
                Agendar Consulta pelo WhatsApp
              </a>
            </Button>
          </div>
        </FadeIn>
      </div>
    </article>
  )
}
