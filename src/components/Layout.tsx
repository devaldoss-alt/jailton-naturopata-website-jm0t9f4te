import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Instagram, Mail, Phone, MapPin, Leaf, Facebook } from 'lucide-react'
import { cn } from '@/lib/utils'
import logoUrl from '../assets/logo-oficial-d840b.jpeg'

export default function Layout() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigate = useNavigate()

  const navLinks = [
    { name: 'Home', href: '/#home', isHash: true },
    { name: 'Sobre', href: '/#sobre', isHash: true },
    { name: 'Serviços', href: '/#servicos', isHash: true },
    { name: 'Produtos', href: '/#produtos', isHash: true },
    { name: 'Blog', href: '/blog', isHash: false },
    { name: 'Contato', href: '/#contato', isHash: true },
  ]

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: { href: string; isHash: boolean },
  ) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)

    if (!link.isHash) {
      navigate(link.href)
      window.scrollTo(0, 0)
      return
    }

    const targetId = link.href.replace('/', '')
    if (location.pathname !== '/') {
      navigate(`/${targetId}`)
      setTimeout(() => {
        const element = document.querySelector(targetId)
        if (element) {
          const top = element.getBoundingClientRect().top + window.scrollY - 80
          window.scrollTo({ top, behavior: 'smooth' })
        }
      }, 100)
      return
    }

    const element = document.querySelector(targetId)
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Header */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
          isScrolled
            ? 'bg-background/80 backdrop-blur-md shadow-sm border-border'
            : 'bg-transparent',
        )}
      >
        <div className="container px-4 h-20 flex items-center justify-between">
          <Link
            to="/"
            onClick={(e) => scrollToSection(e, { name: 'Home', href: '/#home', isHash: true })}
            className="flex items-center gap-2 group"
          >
            <img
              src={logoUrl}
              alt="Jailton Naturopata Logo"
              className="h-16 w-auto object-contain group-hover:scale-105 transition-transform mix-blend-multiply"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link)}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            ))}
            <Button className="rounded-full" asChild>
              <a href="https://wa.me/5571999292989" target="_blank" rel="noopener noreferrer">
                Agendar Consulta
              </a>
            </Button>
          </nav>

          {/* Mobile Nav */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col">
              <div className="flex items-center gap-2 mb-8 mt-4">
                <img
                  src={logoUrl}
                  alt="Jailton Naturopata Logo"
                  className="h-16 w-auto object-contain mix-blend-multiply"
                />
              </div>
              <nav className="flex flex-col gap-4 flex-grow">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link)}
                    className="text-lg font-medium py-2 border-b border-border text-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
              <div className="mt-auto pb-8">
                <Button className="w-full rounded-full" size="lg" asChild>
                  <a href="https://wa.me/5571999292989" target="_blank" rel="noopener noreferrer">
                    Agendar Consulta
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/5571999292989"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#1DA851] transition-all hover:-translate-y-1 animate-pulse-ring"
        aria-label="Contato via WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
        </svg>
      </a>

      {/* Footer */}
      <footer id="contato" className="bg-[#132A1B] text-white/80 pt-16 pb-8">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6 opacity-100 bg-white/95 p-3 rounded-xl inline-flex">
                <img
                  src={logoUrl}
                  alt="Jailton Naturopata Logo"
                  className="h-14 w-auto object-contain mix-blend-multiply"
                />
              </div>
              <p className="mb-6 max-w-sm">
                Transformando vidas através do poder de cura da natureza. Terapias integrativas para
                o seu equilíbrio físico e emocional.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6">Links Rápidos</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link)}
                      className="hover:text-white transition-colors flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-primary before:rounded-full cursor-pointer"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6">Contato</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-white">WhatsApp</span>
                    <a
                      href="https://wa.me/5571999292989"
                      className="hover:text-primary transition-colors"
                    >
                      (071) 99929-2989
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Instagram className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-white">Instagram</span>
                    <a
                      href="https://instagram.com/jailton_santos_nath"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      @jailton_santos_nath
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Facebook className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-white">Facebook</span>
                    <a
                      href="https://facebook.com/jsc.naturopatia.terapia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      jsc naturopatia terapia
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-white">E-mail</span>
                    <a
                      href="mailto:contato@jailtonnaturopata.com"
                      className="hover:text-primary transition-colors"
                    >
                      contato@jailtonnaturopata.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-white">Atendimento</span>
                    <span>Presencial e Online</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
            <p>
              &copy; {new Date().getFullYear()} Jailton Naturopata. Todos os direitos reservados.
            </p>
            <p className="mt-2 md:mt-0">Desenvolvido com excelência.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
