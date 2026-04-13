import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/ui/fade-in'
import { ChevronDown, MessageCircle } from 'lucide-react'

export function Hero() {
  const scrollToAbout = () => {
    document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="https://img.usecurling.com/p/1920/1080?q=nature%20leaves%20water%20drops&color=green"
          alt="Background natural"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
        <FadeIn delay={100} className="mb-6">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20 mb-4">
            Especialista Integrativo
          </span>
        </FadeIn>

        <FadeIn delay={200}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl mb-6">
            Terapias Naturais <span className="text-primary">Integrativas</span>
          </h1>
        </FadeIn>

        <FadeIn delay={300}>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Recupere seu equilíbrio físico, mental e emocional através de tratamentos naturais e
            personalizados. A cura verdadeira começa de dentro para fora.
          </p>
        </FadeIn>

        <FadeIn delay={400} className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="rounded-full h-14 px-8 text-lg font-semibold bg-[#25D366] hover:bg-[#1DA851] text-white shadow-lg shadow-[#25D366]/30 transition-all hover:-translate-y-1"
            asChild
          >
            <a href="https://wa.me/5571999292989" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Fale Conosco no WhatsApp
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full h-14 px-8 text-lg font-semibold border-primary/20 hover:bg-primary/5 transition-all"
            onClick={scrollToAbout}
          >
            Conheça os Serviços
          </Button>
        </FadeIn>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <button
          onClick={scrollToAbout}
          className="p-2 rounded-full bg-background/50 backdrop-blur-sm border border-border text-muted-foreground hover:text-primary transition-colors"
          aria-label="Rolar para baixo"
        >
          <ChevronDown className="h-6 w-6" />
        </button>
      </div>
    </section>
  )
}
