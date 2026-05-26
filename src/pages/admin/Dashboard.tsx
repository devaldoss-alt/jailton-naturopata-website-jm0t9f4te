import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAnamnesis } from '@/services/anamnesis'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { FileText, Users, Activity, AlertTriangle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function Dashboard() {
  const [lista, setLista] = useState<any[]>([])

  useEffect(() => {
    getAnamnesis().then(setLista).catch(console.error)
  }, [])

  const recentes = lista.slice(0, 5)

  return (
    <div className="space-y-8 animate-fade-in-up">
      <h1 className="text-3xl font-bold text-gray-800">
        PAINEL DO PROFISSIONAL – ANAMNESE INTEGRATIVA
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center gap-4 text-primary mb-2">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Total de Atendimentos</h3>
          </div>
          <p className="text-4xl font-bold text-gray-900 mt-2">{lista.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center gap-3">
          <Button asChild className="w-full py-6 text-md font-medium">
            <Link to="/anamnese">
              <FileText className="mr-2 w-5 h-5" /> Nova Anamnese
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/pacientes">
              <Users className="mr-2 w-4 h-4" /> Histórico Completo
            </Link>
          </Button>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100 flex items-center">
          <p className="text-blue-800 font-medium leading-relaxed">
            “Este painel organiza todas as anamneses, sugestões terapêuticas e protocolos gerados
            automaticamente.”
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-semibold text-gray-800">Atendimentos Recentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {recentes.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.nome_paciente}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {format(new Date(item.data_atendimento), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                    {item.tipo_atendimento || 'consulta'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.status === 'error' ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="px-2.5 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 cursor-help">
                            <AlertTriangle className="w-3 h-3" />
                            Erro
                          </span>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="max-w-[300px] whitespace-normal bg-red-900 text-white border-red-800"
                        >
                          <p className="font-semibold text-sm mb-1">Falha na geração (IA)</p>
                          <p className="text-xs text-red-100 break-words">
                            {item.erro_detalhado || 'Erro desconhecido.'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.status === 'completed' ? 'Concluído' : 'Pendente'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        to={`/resultado/${item.id}`}
                        className="text-primary hover:text-primary/80"
                      >
                        Ver Relatório PDF
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {recentes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Nenhum atendimento registrado ainda. Clique em "Nova Anamnese" para começar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
