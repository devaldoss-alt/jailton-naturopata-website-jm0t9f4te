import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/hooks/use-auth'
import { createAnamnese } from '@/services/anamnesis'
import { toast } from 'sonner'
import { Loader2, Activity } from 'lucide-react'

const ORGAN_SYSTEMS = [
  {
    name: 'Fígado e Vesícula Biliar',
    symptoms: [
      'Enxaqueca / Dor de cabeça',
      'Irritabilidade / Raiva fácil',
      'Gosto amargo na boca',
      'Acorda entre 1h e 3h da manhã',
      'TPM forte / Cólicas',
      'Visão turva / Olhos secos ou vermelhos',
      'Má digestão de gorduras',
    ],
  },
  {
    name: 'Coração e Intestino Delgado',
    symptoms: [
      'Insônia / Dificuldade para dormir',
      'Palpitações / Taquicardia',
      'Agitação mental / Ansiedade',
      'Ponta da língua muito vermelha',
      'Transpiração excessiva',
      'Dores articulares migratórias',
    ],
  },
  {
    name: 'Baço, Pâncreas e Estômago',
    symptoms: [
      'Preocupação excessiva / Pensamento acelerado',
      'Fadiga após as refeições',
      'Gases / Distensão abdominal',
      'Fezes amolecidas',
      'Vontade excessiva de doces',
      'Hematomas frequentes',
      'Mãos e pés frios',
    ],
  },
  {
    name: 'Pulmão e Intestino Grosso',
    symptoms: [
      'Tristeza / Melancolia',
      'Tosse crônica ou frequente',
      'Intestino preso / Constipação',
      'Pele ressecada',
      'Rinite / Sinusite / Alergias respiratórias',
      'Baixa imunidade',
    ],
  },
  {
    name: 'Rins e Bexiga',
    symptoms: [
      'Medos / Insegurança',
      'Zumbido no ouvido',
      'Dores lombares crônicas',
      'Urina muito frequente, especialmente à noite',
      'Queda de cabelo / Cabelo fraco',
      'Falta de energia vital / Cansaço crônico',
    ],
  },
]

export default function NovaAnamnese() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome_paciente: '',
    data_atendimento: new Date().toISOString().split('T')[0],
    tipo_atendimento: 'consulta',
    motivo_consulta: '',
  })
  const [symptoms, setSymptoms] = useState<Record<string, string[]>>({})

  const handleSymptomToggle = (system: string, symptom: string) => {
    setSymptoms((prev) => {
      const current = prev[system] || []
      const updated = current.includes(symptom)
        ? current.filter((s) => s !== symptom)
        : [...current, symptom]
      return { ...prev, [system]: updated }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const selectedSymptoms = Object.values(symptoms).flat()
    const affectedOrgans = Object.keys(symptoms).filter((k) => symptoms[k].length > 0)

    setLoading(true)
    try {
      const result = await createAnamnese({
        user_id: user.id,
        nome_paciente: formData.nome_paciente,
        data_atendimento: formData.data_atendimento + ' 12:00:00.000Z',
        tipo_atendimento: formData.tipo_atendimento,
        motivo_consulta: formData.motivo_consulta,
        sintomas_principais:
          selectedSymptoms.length > 0
            ? selectedSymptoms.join(', ')
            : 'Nenhum sintoma marcado no checklist.',
        orgaos_afetados:
          affectedOrgans.length > 0 ? affectedOrgans.join(', ') : 'Nenhum órgão marcado.',
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
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in-up">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" /> Nova Anamnese Integrativa
        </h1>
        <p className="text-gray-500 mt-2">
          Preencha os dados do paciente e o checklist de sintomas para que a IA analise e gere o
          protocolo inicial.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-6">
          <div>
            <Label className="text-base font-semibold mb-4 block">Tipo de Atendimento</Label>
            <RadioGroup
              value={formData.tipo_atendimento}
              onValueChange={(val) => setFormData({ ...formData, tipo_atendimento: val })}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-100 pr-6">
                <RadioGroupItem value="consulta" id="consulta" />
                <Label htmlFor="consulta" className="cursor-pointer">
                  Consulta (Primeira vez)
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-100 pr-6">
                <RadioGroupItem value="revisão" id="revisao" />
                <Label htmlFor="revisao" className="cursor-pointer">
                  Revisão (Retorno)
                </Label>
              </div>
            </RadioGroup>
          </div>

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
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold block border-b pb-2">
            Checklist de Sistemas e Órgãos
          </Label>
          <p className="text-sm text-gray-500 mb-4">
            Marque os sintomas apresentados pelo paciente para identificação do desequilíbrio
            orgânico.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {ORGAN_SYSTEMS.map((system) => (
              <div key={system.name} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="font-medium text-gray-800 mb-3 text-sm">{system.name}</h3>
                <div className="space-y-3">
                  {system.symptoms.map((symptom) => (
                    <div key={symptom} className="flex items-start space-x-3">
                      <Checkbox
                        id={symptom}
                        checked={(symptoms[system.name] || []).includes(symptom)}
                        onCheckedChange={() => handleSymptomToggle(system.name, symptom)}
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor={symptom}
                        className="text-sm text-gray-600 font-normal leading-snug cursor-pointer select-none"
                      >
                        {symptom}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="motivo" className="text-base font-semibold">
            Histórico Médico / Observações Adicionais
          </Label>
          <Textarea
            id="motivo"
            required
            className="min-h-[150px] resize-y p-4 text-base leading-relaxed"
            placeholder="Descreva detalhes adicionais, uso de medicações, estilo de vida..."
            value={formData.motivo_consulta}
            onChange={(e) => setFormData({ ...formData, motivo_consulta: e.target.value })}
          />
        </div>

        <Button type="submit" className="w-full h-14 text-lg font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" /> Processando Análise IA... Aguarde.
            </>
          ) : (
            'Gerar Análise e Protocolo'
          )}
        </Button>
      </form>
    </div>
  )
}
