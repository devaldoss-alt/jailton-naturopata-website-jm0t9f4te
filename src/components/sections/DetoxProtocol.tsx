import { FadeIn } from '@/components/ui/fade-in'
import { Button } from '@/components/ui/button'
import { Leaf, MessageCircle, ShieldCheck, Zap } from 'lucide-react'

export function DetoxProtocol() {
  return (
    <section
      id="protocolo-detox"
      className="py-24 bg-[#132A1B] text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://img.usecurling.com/p/1920/1080?q=nature%20leaves&color=green"
          alt="Background leaves"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              100% Natural
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Protocolo Detox Baiano
            </h2>
            <p className="text-xl text-white/80 mb-8 font-medium">
              Seu corpo precisa de limpeza, não de remédio.
            </p>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Cansaço constante não é normal. O acúmulo de toxinas no corpo pode gerar inflamações,
              fadiga e diversas doenças crônicas. O Protocolo Detox Baiano foi desenvolvido para
              limpar seu organismo profundamente, restaurando sua energia vital e fortalecendo sua
              imunidade.
            </p>

            <div className="space-y-4 mb-10">
              <div className="flex items-start gap-3">
                <div className="bg-primary/20 p-2 rounded-lg mt-1">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Limpeza Profunda</h4>
                  <p className="text-white/60">
                    Eliminação de metais pesados e toxinas acumuladas.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/20 p-2 rounded-lg mt-1">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Restauração de Energia</h4>
                  <p className="text-white/60">Combate à fadiga crônica e indisposição.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/20 p-2 rounded-lg mt-1">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Fortalecimento</h4>
                  <p className="text-white/60">Aumento natural da imunidade e vitalidade.</p>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="rounded-full h-14 px-8 text-lg font-semibold bg-[#25D366] hover:bg-[#1DA851] text-white w-full sm:w-auto"
              asChild
            >
              <a
                href={`https://wa.me/5571999292989?text=${encodeURIComponent('Olá, gostaria de saber mais sobre o Protocolo Detox Baiano')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Agendar Protocolo Detox
              </a>
            </Button>
          </FadeIn>

          <FadeIn delay={200} className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl border border-white/10">
              <img
                src="https://img.usecurling.com/p/800/1000?q=green%20detox%20juice%20plants&color=green"
                alt="Protocolo Detox Baiano"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-2">Desintoxique seu corpo naturalmente</h3>
                  <p className="text-white/80 text-sm">
                    Um método exclusivo e integrativo para o seu bem-estar completo.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary rounded-full blur-3xl opacity-30"></div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
