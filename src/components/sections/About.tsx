import { FadeIn } from '@/components/ui/fade-in'
import { CheckCircle2 } from 'lucide-react'
import profilePic from '../../assets/foto-perfil-jailton-f8666.jpeg'

export function About() {
  const benefits = [
    'Abordagem holística e individualizada',
    'Foco na causa raiz, não apenas nos sintomas',
    'Uso exclusivo de métodos naturais e seguros',
    'Acompanhamento contínuo e acolhedor',
  ]

  return (
    <section id="sobre" className="py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <FadeIn direction="right" className="order-2 lg:order-1 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-square md:aspect-[4/3] lg:aspect-[3/4] max-w-md mx-auto lg:mx-0">
              <img
                src={profilePic}
                alt="Jailton Naturopata"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 border-2 border-primary/20 rounded-2xl z-10 pointer-events-none"></div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent rounded-full -z-10 blur-2xl opacity-60"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/20 rounded-full -z-10 blur-3xl opacity-60"></div>
          </FadeIn>

          <div className="order-1 lg:order-2 space-y-8">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Sobre Jailton Naturopata
              </h2>
              <div className="h-1 w-20 bg-primary mt-4 rounded-full"></div>
            </FadeIn>

            <FadeIn delay={100}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Com anos de experiência e dedicação ao bem-estar humano, Jailton Santos desenvolveu
                uma metodologia única que une os conhecimentos milenares das terapias naturais com
                abordagens integrativas modernas.
              </p>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nossa missão é guiar você em uma jornada de autocura, restaurando a harmonia entre
                corpo, mente e espírito através da sabedoria que a natureza nos oferece.
              </p>
            </FadeIn>

            <FadeIn delay={300}>
              <ul className="space-y-4 mt-6">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
