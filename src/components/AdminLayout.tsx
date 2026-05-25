import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, FileText, Users, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AdminLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r flex flex-col no-print hidden md:flex">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-primary">Área Restrita</h2>
          <p className="text-xs text-muted-foreground mt-1">Anamnese Integrativa</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/painel"
            className={cn(
              'flex items-center gap-3 p-3 rounded-md transition-colors',
              location.pathname === '/painel'
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-gray-600 hover:bg-gray-100',
            )}
          >
            <LayoutDashboard className="w-5 h-5" /> Painel
          </Link>
          <Link
            to="/anamnese"
            className={cn(
              'flex items-center gap-3 p-3 rounded-md transition-colors',
              location.pathname === '/anamnese'
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-gray-600 hover:bg-gray-100',
            )}
          >
            <FileText className="w-5 h-5" /> Nova Anamnese
          </Link>
          <Link
            to="/pacientes"
            className={cn(
              'flex items-center gap-3 p-3 rounded-md transition-colors',
              location.pathname === '/pacientes'
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-gray-600 hover:bg-gray-100',
            )}
          >
            <Users className="w-5 h-5" /> Histórico
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" /> Sair
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-auto relative">
        <Outlet />
      </main>
    </div>
  )
}
