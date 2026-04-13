import { useState } from 'react'
import { FadeIn } from '@/components/ui/fade-in'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const products = [
  {
    id: 1,
    name: 'Encapsulados Detox & Imunidade',
    shortDesc:
      'Fórmula exclusiva para fortalecer o sistema imunológico e desintoxicar o organismo.',
    longDesc:
      'Nossos Encapsulados Detox & Imunidade foram desenvolvidos com extratos puros de plantas medicinais. Uma combinação poderosa que atua na limpeza hepática, melhora da digestão e fortalecimento das defesas naturais do corpo contra agentes externos. Ideal para uso diário.',
    image: 'https://img.usecurling.com/p/600/600?q=green%20pill%20bottle%20on%20wood&color=green',
    badge: 'Mais Vendido',
    price: 'R$ 89,90',
  },
  {
    id: 2,
    name: 'Kit Aromaterapia Relax',
    shortDesc:
      'Sinergia de óleos essenciais para combater o estresse e melhorar a qualidade do sono.',
    longDesc:
      'Um kit cuidadosamente montado com óleos essenciais de Lavanda Francesa, Camomila Romana e Bergamota. Esta sinergia atua diretamente no sistema límbico, reduzindo os níveis de cortisol, aliviando a ansiedade diária e preparando o corpo para um sono profundo e reparador.',
    image: 'https://img.usecurling.com/p/600/600?q=essential%20oils%20bottles%20leaves&color=green',
    price: 'R$ 145,00',
  },
  {
    id: 3,
    name: 'Florais de Bach Equilíbrio',
    shortDesc: 'Composto floral para harmonia emocional e clareza mental no dia a dia.',
    longDesc:
      'O composto Equilíbrio utiliza a sabedoria original do Dr. Edward Bach para tratar oscilações de humor, cansaço mental e sentimentos de sobrecarga. Sem contraindicações, é uma ferramenta gentil e eficaz para manter a serenidade diante dos desafios cotidianos.',
    image: 'https://img.usecurling.com/p/600/600?q=dropper%20bottle%20flowers&color=green',
    price: 'R$ 65,00',
  },
]

export function Products() {
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[0] | null>(null)

  return (
    <section id="produtos" className="py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Nossos Produtos
            </h2>
            <p className="text-lg text-muted-foreground">
              Fórmulas naturais e exclusivas desenvolvidas para complementar seu tratamento e manter
              sua vitalidade.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <FadeIn key={product.id} delay={index * 150}>
              <Card className="h-full overflow-hidden flex flex-col border-border/50 hover:border-primary/30 transition-colors">
                <div className="relative aspect-square overflow-hidden bg-accent/20">
                  {product.badge && (
                    <Badge className="absolute top-4 right-4 z-10 bg-amber-500 hover:bg-amber-600 text-white border-none px-3 py-1">
                      {product.badge}
                    </Badge>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  />
                </div>
                <CardContent className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{product.name}</h3>
                    <p className="text-muted-foreground mb-4">{product.shortDesc}</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">{product.price}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0 gap-3">
                  <Button
                    className="w-full rounded-full"
                    variant="default"
                    onClick={() => setSelectedProduct(product)}
                  >
                    Ver Detalhes
                  </Button>
                </CardFooter>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white border-none shadow-2xl rounded-2xl">
          {selectedProduct && (
            <div className="grid md:grid-cols-2 h-full">
              <div className="relative aspect-square md:aspect-auto bg-accent/20">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <DialogHeader className="mb-6 text-left">
                  <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                    {selectedProduct.name}
                  </DialogTitle>
                  <p className="text-3xl font-bold text-primary mb-4">{selectedProduct.price}</p>
                  <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                    {selectedProduct.longDesc}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-auto pt-6 space-y-3">
                  <Button
                    className="w-full h-12 rounded-full text-base font-semibold bg-[#25D366] hover:bg-[#1DA851] text-white"
                    asChild
                  >
                    <a
                      href={`https://wa.me/5571999292989?text=Olá, gostaria de saber mais sobre o produto: ${selectedProduct.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Comprar via WhatsApp
                    </a>
                  </Button>
                  <Button
                    className="w-full h-12 rounded-full text-base font-semibold"
                    variant="outline"
                    onClick={() => setSelectedProduct(null)}
                  >
                    Continuar Navegando
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
