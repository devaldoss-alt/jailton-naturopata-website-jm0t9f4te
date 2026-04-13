import { FadeIn } from '@/components/ui/fade-in'
import { Quote } from 'lucide-react'

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://img.usecurling.com/p/1920/1080?q=calm%20nature%20stones%20water&color=green"
          alt="Fundo natureza"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-secondary/90 mix-blend-multiply" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <FadeIn className="max-w-4xl mx-auto text-center">
          <Quote className="h-16 w-16 mx-auto text-white/30 mb-8" />
          <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-tight mb-8">
            "A naturopatia mudou minha vida. As dores crônicas que me acompanhavam há anos
            desapareceram com o tratamento integrativo. O cuidado e a atenção do Jailton foram
            fundamentais nesse processo de cura profunda."
          </p>
          <div>
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 border-2 border-white/20">
              <img
                src="https://img.usecurling.com/ppl/thumbnail?gender=female"
                alt="Cliente"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-lg font-bold text-white">Maria Fernanda Silva</h4>
            <p className="text-white/70">Paciente de Terapias Integrativas</p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
