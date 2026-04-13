import { FadeIn } from '@/components/ui/fade-in'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Leaf, Eye, Droplet, Flower2, Pill, Apple, Footprints, Sparkles } from 'lucide-react'

const services = [
  {
    title: 'Naturopatia',
    description:
      'Tratamento holístico focando no poder de cura da natureza para restaurar a saúde geral.',
    icon: Leaf,
  },
  {
    title: 'Iridologia',
    description:
      'Análise da íris para identificar desequilíbrios físicos e emocionais antes que se tornem problemas crônicos.',
    icon: Eye,
  },
  {
    title: 'Aromaterapia',
    description:
      'Uso de óleos essenciais terapêuticos para promover o bem-estar físico e psicológico.',
    icon: Droplet,
  },
  {
    title: 'Florais de Bach',
    description:
      'Essências florais que atuam no equilíbrio das emoções, tratando estresse, ansiedade e medos.',
    icon: Flower2,
  },
  {
    title: 'Fitoterapia',
    description:
      'Prevenção e tratamento de doenças através do uso de plantas medicinais e seus princípios ativos.',
    icon: Pill,
  },
  {
    title: 'Nutrição Natural',
    description:
      'Reeducação alimentar baseada em alimentos puros e naturais, focada na vitalidade e desintoxicação.',
    icon: Apple,
  },
  {
    title: 'Reflexologia',
    description:
      'Terapia que utiliza estímulos em pontos específicos dos pés para tratar e equilibrar todo o corpo.',
    icon: Footprints,
  },
  {
    title: 'Terapia com Cristais',
    description:
      'Alinhamento energético e harmonização dos chakras utilizando a frequência vibracional dos cristais.',
    icon: Sparkles,
  },
]

export function Services() {
  return (
    <section id="servicos" className="py-24 bg-accent/30">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Nossos Serviços
            </h2>
            <p className="text-lg text-muted-foreground">
              Conheça nossas abordagens terapêuticas, cada uma cuidadosamente selecionada para
              promover sua saúde integral.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <FadeIn key={index} delay={index * 100}>
              <Card className="h-full border-none shadow-subtle hover:shadow-elevation transition-all duration-300 hover:-translate-y-1 bg-white group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <service.icon className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
