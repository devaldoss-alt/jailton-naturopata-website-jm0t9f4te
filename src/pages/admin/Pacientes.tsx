import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAnamnesis } from '@/services/anamnesis'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Users } from 'lucide-react'

export default function Pacientes() {
  const [lista, setLista] = useState<any[]>([])

  useEffect(() => {
    getAnamnesis().then(setLista).catch(console.error)
  }, [])

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-lg text-primary">
          <Users className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Histórico de Pacientes</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Data do Atendimento
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
              {lista.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.nome_paciente}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {format(new Date(item.data_atendimento), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'error'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {item.status === 'completed'
                        ? 'Concluído'
                        : item.status === 'error'
                          ? 'Erro'
                          : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/resultado/${item.id}`}>Ver Relatório</Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {lista.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Nenhum paciente no histórico.
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
