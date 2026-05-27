import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, FileText } from 'lucide-react'
import { toast } from 'sonner'
import pb from '@/lib/pocketbase/client'

export default function ConsultarResultado() {
  const [reportId, setReportId] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reportId.trim()) {
      toast.error('Por favor, informe o Código do Relatório.')
      return
    }

    setLoading(true)
    try {
      await pb.collection('anamnesis').getOne(reportId.trim())
      navigate(`/resultado/${reportId.trim()}`)
    } catch (error) {
      toast.error('Relatório não encontrado. Verifique o código informado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in-up">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <FileText className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Consultar Resultado</h1>
        <p className="text-center text-gray-500 mb-8">
          Informe o código do seu relatório (ID) fornecido pelo profissional para acessar seu plano
          terapêutico.
        </p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <Input
              placeholder="Ex: abc123def456ghi"
              value={reportId}
              onChange={(e) => setReportId(e.target.value)}
              className="h-12 text-center text-lg bg-gray-50"
            />
          </div>
          <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
            {loading ? (
              'Buscando...'
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" /> Buscar Relatório
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
