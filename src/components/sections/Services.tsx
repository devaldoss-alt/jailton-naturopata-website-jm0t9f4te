import { useState } from 'react'
import { FadeIn } from '@/components/ui/fade-in'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Leaf,
  Eye,
  Droplet,
  Flower2,
  Pill,
  Apple,
  Footprints,
  Sparkles,
  Syringe,
  Brain,
  Wind,
  Activity,
  Ear,
  ActivitySquare,
  Flame,
} from 'lucide-react'

const services = [
  {
    title: 'Naturopatia',
    description:
      'Tratamento holístico focando no poder de cura da natureza para restaurar a saúde geral.',
    benefits:
      'Apoia a capacidade natural do corpo de se curar, identifica e remove as causas das doenças, foca na prevenção, educa o paciente para um estilo de vida saudável e utiliza terapias seguras e não invasivas.',
    icon: Leaf,
  },
  {
    title: 'Iridologia',
    description: 'Análise da íris para identificar desequilíbrios físicos e emocionais.',
    benefits:
      'Avaliação não invasiva da saúde, identificação de predisposições genéticas, detecção precoce de desequilíbrios no organismo antes que se tornem doenças crônicas, orientação preventiva personalizada.',
    icon: Eye,
  },
  {
    title: 'Aromaterapia',
    description:
      'Uso de óleos essenciais terapêuticos para promover o bem-estar físico e psicológico.',
    benefits:
      'Alívio do estresse e ansiedade, melhora da qualidade do sono, reforço do sistema imunológico, alívio de dores de cabeça e musculares, e equilíbrio das emoções.',
    icon: Droplet,
  },
  {
    title: 'Florais de Bach',
    description:
      'Essências florais que atuam no equilíbrio das emoções, tratando estresse e ansiedade.',
    benefits:
      'Gestão de emoções negativas, redução do estresse diário, combate a medos e fobias, aumento da autoconfiança, superação de traumas emocionais sem efeitos colaterais.',
    icon: Flower2,
  },
  {
    title: 'Fitoterapia',
    description: 'Prevenção e tratamento de doenças através do uso de plantas medicinais.',
    benefits:
      'Tratamento natural de diversas condições de saúde, redução de dependência química, melhora do sistema digestivo, fortalecimento da imunidade.',
    icon: Pill,
  },
  {
    title: 'Trofoterapia',
    description:
      'O uso dos alimentos como tratamento para prevenção e cura de patologias adversas.',
    benefits:
      'Prevenção e tratamento de patologias adversas, Fortalecimento do sistema imunológico, Saúde intestinal, Saúde mental.',
    icon: Apple,
  },
  {
    title: 'Reflexologia',
    description:
      'Terapia que utiliza estímulos em pontos específicos dos pés para tratar todo o corpo.',
    benefits:
      'Relaxamento profundo, melhora da circulação sanguínea, alívio de dores locais e sistêmicas, estímulo do sistema nervoso, e equilíbrio das funções corporais.',
    icon: Footprints,
  },
  {
    title: 'Cromoterapia',
    description:
      'Uso das cores para alinhar a energia do corpo e tratar distúrbios físicos e emocionais.',
    benefits:
      'Restauração do equilíbrio energético, alívio de dores, melhora da circulação, regulação do humor e auxílio na regeneração celular através de frequências luminosas.',
    icon: Sparkles,
  },
  {
    title: 'Acupuntura na Estética',
    description: 'Técnica milenar aplicada à saúde e rejuvenescimento da pele e corpo.',
    benefits:
      'Estímulo de colágeno, redução de rugas, tonificação muscular facial e corporal, diminuição de olheiras e manchas, e melhora na textura e viço da pele.',
    icon: Syringe,
  },
  {
    title: 'Craniopuntura',
    description:
      'Microacupuntura no couro cabeludo para tratamento de disfunções neurológicas e dor.',
    benefits:
      'Alívio da dor, Equilíbrio emocional, Estímulo do sistema imunológico, Tratamento de transtornos mentais, recuperação motora e alívio de enxaquecas.',
    icon: Brain,
  },
  {
    title: 'Ventosaterapia',
    description: 'Aplicação de ventosas para criar vácuo e estimular a circulação sanguínea.',
    benefits:
      'Alívio da dor, Relaxamento muscular, Melhora da circulação, Redução da inflamação, Benefícios estéticos (celulite).',
    icon: Wind,
  },
  {
    title: 'Acupuntura',
    description:
      'Inserção de agulhas em pontos específicos para equilibrar a energia vital do corpo.',
    benefits:
      'Benefícios sistêmicos gerais, alívio de dores agudas e crônicas, regulação do sistema endócrino e nervoso, melhora do sono, e redução de estresse e ansiedade.',
    icon: Activity,
  },
  {
    title: 'Auriculoterapia',
    description:
      'Estímulo de pontos no pavilhão auricular para tratar problemas em todo o organismo.',
    benefits:
      'Alívio de dores, Redução da ansiedade, Melhora do sono, Equilíbrio emocional, Apoio ao tratamento de doenças crônicas e auxílio em vícios.',
    icon: Ear,
  },
  {
    title: 'Liberação Miofascial',
    description: 'Terapia manual focada em aliviar tensões na fáscia que envolve os músculos.',
    benefits:
      'Melhora da flexibilidade, recuperação muscular mais rápida, alinhamento postural, alívio de dores crônicas, e aumento da amplitude de movimento.',
    icon: ActivitySquare,
  },
  {
    title: 'Moxabustão',
    description:
      'Terapia que utiliza o calor da queima da erva artemísia sobre pontos de acupuntura.',
    benefits:
      'Melhora digestiva, fortalecimento imunológico, alívio de dores musculares e articulares causadas por frio ou umidade, e aumento da vitalidade.',
    icon: Flame,
  },
]

export function Services() {
  const [selectedService, setSelectedService] = useState<(typeof services)[0] | null>(null)

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
              promover sua saúde integral e equilíbrio.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <FadeIn key={index} delay={(index % 4) * 100}>
              <Card className="h-full flex flex-col border-none shadow-subtle hover:shadow-elevation transition-all duration-300 hover:-translate-y-1 bg-white group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <service.icon className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-base text-muted-foreground leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-primary/20 text-primary hover:bg-primary hover:text-white transition-colors"
                    onClick={() => setSelectedService(service)}
                  >
                    Saiba mais
                  </Button>
                </CardFooter>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedService && (
            <>
              <DialogHeader className="mb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                  <selectedService.icon className="h-8 w-8 text-primary" />
                </div>
                <DialogTitle className="text-2xl text-center mb-2">
                  {selectedService.title}
                </DialogTitle>
                <DialogDescription className="text-center text-base">
                  {selectedService.description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-foreground">
                    Principais Benefícios:
                  </h4>
                  <p className="text-muted-foreground leading-relaxed bg-accent/30 p-4 rounded-xl">
                    {selectedService.benefits}
                  </p>
                </div>
                <Button
                  className="w-full h-12 rounded-full text-base font-semibold bg-[#25D366] hover:bg-[#1DA851] text-white mt-4"
                  asChild
                >
                  <a
                    href={`https://wa.me/5571999292989?text=Olá, gostaria de agendar uma sessão de ${selectedService.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Agendar Sessão
                  </a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
