import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/use-auth'
import { createAnamnese } from '@/services/anamnesis'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function NovaAnamnese() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome_paciente: '',
    data_atendimento: new Date().toISOString().split('T')[0],
    motivo_consulta: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const result = await createAnamnese({
        user_id: user.id,
        nome_paciente: formData.nome_paciente,
        data_atendimento: formData.data_atendimento + ' 12:00:00.000Z',
        motivo_consulta: formData.motivo_consulta,
        status: 'pending',
      })
      toast.success('Anamnese processada com sucesso!')
      navigate(`/resultado/${result.id}`)
    } catch (err) {
      toast.error('Erro ao processar anamnese. Verifique os dados e tente novamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in-up">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nova Anamnese Integrativa</h1>
        <p className="text-gray-500 mt-2">
          Preencha os dados do paciente para que a IA analise e gere o protocolo inicial de forma
          automática.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="nome" className="text-sm font-semibold">
              Nome do Paciente
            </Label>
            <Input
              id="nome"
              required
              placeholder="Ex: João Silva"
              value={formData.nome_paciente}
              onChange={(e) => setFormData({ ...formData, nome_paciente: e.target.value })}
              className="h-12"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="data" className="text-sm font-semibold">
              Data do Atendimento
            </Label>
            <Input
              id="data"
              type="date"
              required
              value={formData.data_atendimento}
              onChange={(e) => setFormData({ ...formData, data_atendimento: e.target.value })}
              className="h-12"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="motivo" className="text-sm font-semibold">
            Motivo da Consulta / Histórico Médico
          </Label>
          <Textarea
            id="motivo"
            required
            className="min-h-[200px] resize-y p-4 text-base leading-relaxed"
            placeholder="Descreva detalhadamente as queixas do paciente, sintomas relatados, histórico médico pregressos, uso de medicações e rotina/estilo de vida..."
            value={formData.motivo_consulta}
            onChange={(e) => setFormData({ ...formData, motivo_consulta: e.target.value })}
          />
          <p className="text-xs text-gray-500">
            Quanto mais detalhes você fornecer, mais preciso será o protocolo gerado pela IA.
          </p>
        </div>

        <Button type="submit" className="w-full h-14 text-lg font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" /> Processando com IA... Aguarde.
            </>
          ) : (
            'Gerar Análise e Protocolo'
          )}
        </Button>
      </form>
    </div>
  )
}
