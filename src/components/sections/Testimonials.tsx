import { useEffect, useState } from 'react'
import { FadeIn } from '@/components/ui/fade-in'
import { Quote, Star, MessageSquarePlus, Loader2, User } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import {
  getApprovedTestimonials,
  createTestimonial,
  type Testimonial,
} from '@/services/testimonials'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const loadData = async () => {
    try {
      const data = await getApprovedTestimonials()
      setTestimonials(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('testimonials', () => {
    loadData()
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    setIsSubmitting(true)

    try {
      await createTestimonial({ name, message, rating })
      setIsOpen(false)
      setName('')
      setRating(5)
      setMessage('')
      toast({
        title: 'Depoimento enviado!',
        description:
          'Agradecemos de coração! Seu depoimento foi enviado e está aguardando aprovação.',
      })
    } catch (err) {
      setFieldErrors(extractFieldErrors(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const getAvatarUrl = (t: Testimonial) => {
    if (!t.avatar) return null
    if (t.avatar.startsWith('http://') || t.avatar.startsWith('https://')) {
      return t.avatar
    }
    return pb.files.getURL(t, t.avatar)
  }

  return (
    <section className="py-24 relative overflow-hidden bg-[#0A1A10]">
      <div className="absolute inset-0 z-0">
        <img
          src="https://img.usecurling.com/p/1920/1080?q=calm%20nature%20stones%20water&color=green"
          alt="Fundo natureza"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A10] via-transparent to-[#0A1A10]" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <FadeIn className="text-center mb-16">
          <Quote className="h-16 w-16 mx-auto text-primary/40 mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            O Que Dizem Nossos Pacientes
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Acompanhe as histórias de transformação e bem-estar de quem já experimentou o poder da
            naturopatia.
          </p>
        </FadeIn>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : testimonials.length > 0 ? (
          <div className="max-w-6xl mx-auto">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 md:-ml-6">
                {testimonials.map((t) => (
                  <CarouselItem key={t.id} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3">
                    <div className="h-full">
                      <Card className="h-full bg-white/5 border-white/10 backdrop-blur-sm shadow-xl hover:bg-white/10 transition-colors">
                        <CardContent className="p-8 flex flex-col h-full justify-between gap-6">
                          <div>
                            <div className="flex text-yellow-400 mb-6">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    'h-5 w-5',
                                    i < t.rating ? 'fill-current' : 'text-white/20',
                                  )}
                                />
                              ))}
                            </div>
                            <p className="text-white/90 italic leading-relaxed">"{t.message}"</p>
                          </div>
                          <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/10">
                            <Avatar className="w-14 h-14 border-2 border-primary/50 shrink-0 bg-transparent">
                              <AvatarImage
                                src={getAvatarUrl(t) || ''}
                                alt={t.name}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-white/10 text-white/50">
                                <User className="w-6 h-6" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-bold text-white">{t.name}</h4>
                              <p className="text-primary text-sm">Paciente</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-12 gap-4">
                <CarouselPrevious className="static translate-y-0 w-12 h-12 bg-white/10 hover:bg-white/20 text-white border-0 transition-colors" />
                <CarouselNext className="static translate-y-0 w-12 h-12 bg-white/10 hover:bg-white/20 text-white border-0 transition-colors" />
              </div>
            </Carousel>
          </div>
        ) : (
          <div className="text-center text-white/50 py-12">Nenhum depoimento encontrado.</div>
        )}

        <FadeIn className="mt-20 text-center">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full gap-2 px-8 py-6 text-lg">
                <MessageSquarePlus className="w-5 h-5" />
                Compartilhe sua Experiência
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">Seu Depoimento</DialogTitle>
                <DialogDescription>
                  Conte para nós como foi sua experiência com as terapias naturais do Jailton
                  Naturopata.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className={cn(fieldErrors.name && 'text-destructive')}>
                    Seu Nome
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ex: João Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={cn(fieldErrors.name && 'border-destructive')}
                  />
                  {fieldErrors.name && (
                    <p className="text-sm text-destructive">{fieldErrors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className={cn(fieldErrors.rating && 'text-destructive')}>Avaliação</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none focus-visible:ring-2 ring-primary rounded transition-transform hover:scale-110"
                      >
                        <Star
                          className={cn(
                            'w-8 h-8',
                            star <= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground/30',
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  {fieldErrors.rating && (
                    <p className="text-sm text-destructive">{fieldErrors.rating}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className={cn(fieldErrors.message && 'text-destructive')}
                  >
                    Seu Depoimento
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Como as terapias ajudaram no seu processo de cura?"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={cn('resize-none', fieldErrors.message && 'border-destructive')}
                  />
                  {fieldErrors.message && (
                    <p className="text-sm text-destructive">{fieldErrors.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full"
                  size="lg"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Enviar Depoimento
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </FadeIn>
      </div>
    </section>
  )
}
