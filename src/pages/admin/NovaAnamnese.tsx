import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { createAnamnese } from '@/services/anamnesis'
import { toast } from 'sonner'
import { Loader2, Activity } from 'lucide-react'
import logoUrl from '@/assets/logoanaminese-removebg-preview-31311.png'

const HISTORY_CHECKBOXES = [
  { id: 'hiv_status', label: 'É soropositivo / Tem HIV' },
  { id: 'hipertenso', label: 'É Hipertenso(a)' },
  { id: 'hipotenso', label: 'É Hipotenso(a)' },
  { id: 'atividade_fisica', label: 'Faz atividade Física?' },
  { id: 'marcapasso', label: 'Tem marcapasso' },
  { id: 'alergia', label: 'Tem alergia' },
  { id: 'histerectomia', label: 'Removeu Útero/Histerectomia' },
  { id: 'animais_casa', label: 'Tem animais em casa?' },
  { id: 'renite', label: 'Tem Renite' },
  { id: 'platina', label: 'Tem Platina' },
  { id: 'tireoide_removida', label: 'Removeu a Tireóide' },
  { id: 'arritmia', label: 'Sente arritmia Cardíaca' },
  { id: 'cancer', label: 'Oncológico(a) / Tem Câncer?' },
  { id: 'vesicula_removida', label: 'Removeu a Vesícula' },
  { id: 'bebida_alcoolica', label: 'Toma Bebida alcoólica' },
  { id: 'amalgama_preta', label: 'Tem dentes obturados com amálgamas Preta?' },
]

const ORGANS = {
  Rins: [
    { id: 'pressao_alta', label: 'Tem Pressão alta' },
    { id: 'urina_espumosa', label: 'Urina sai espumosa' },
    { id: 'dores_nuca', label: 'Sente dores na nuca' },
    { id: 'tremores_maos', label: 'Sente tremores nas mãos' },
    { id: 'gosto_metalico', label: 'Sente um gosto metálico na boca quando se alimenta?' },
  ],
  Pulmão: [
    { id: 'asma', label: 'Tem asma' },
    { id: 'pele_ressecada', label: 'Pele ressecada' },
    { id: 'tristeza', label: 'Tem sensação de tristeza' },
    { id: 'gripes_frequentes', label: 'Teve gripes nos últimos 30 dias' },
  ],
  Baço: [
    { id: 'refluxo', label: 'Sente refluxo' },
    { id: 'cansaco_fraqueza', label: 'Sente Cansaço/Fraqueza' },
    { id: 'fadiga_palidez', label: 'Sente Fadiga/Palidez' },
    { id: 'dores_costela', label: 'Sente dores do lado esquerdo embaixo da última costela' },
    { id: 'removeu_utero_baco', label: 'Removeu Útero' },
  ],
  Iodo: [
    { id: 'dores_corpo', label: 'Dores constantes pelo corpo' },
    { id: 'excesso_gases', label: 'Excesso de gases' },
    { id: 'maos_pes_gelados', label: 'Mão e pés gelados' },
    { id: 'mucosa_fezes', label: 'Presença de mucosa nas fezes' },
  ],
  Fígado: [
    { id: 'visao_turva', label: 'Visão Turva' },
    { id: 'barriga_inchada', label: 'Barriga inchada' },
    { id: 'fezes_esbranquicadas', label: 'Fezes Esbranquiçada' },
    { id: 'manchas_pele', label: 'Aparece mancha na pele' },
    { id: 'urina_escura', label: 'Urina sai escura' },
  ],
  'Pressão arterial': [
    { id: 'dor_cabeca', label: 'Dores de cabeça' },
    { id: 'enxaqueca', label: 'Enxaquecas' },
    { id: 'pressao_nuca_art', label: 'Pressão na nuca' },
    { id: 'tontura', label: 'Tontura' },
    { id: 'zumbido', label: 'Zumbido no ouvido' },
  ],
}

const PATHOGENS = [
  { id: 'gases_candida', label: 'Tem Gases e dores abdominais? (Cândida, Giárdia e Strongilóide)' },
  {
    id: 'cansaco_ascaris',
    label: 'Sente Cansaço Extremo? (Áscaris Lumbricóide, Toxoplasma, Giárdia)',
  },
  { id: 'dores_cabeca_toxoplasma', label: 'Sente Dores de Cabeça? (Toxoplasma, Tênia Solium)' },
  { id: 'acne_candida', label: 'Tem acne, Rosácea, Psoríase? (Cândida Albicans, Giárdia)' },
  { id: 'nervoso_mental', label: 'Tem Névoa Mental? (Cândida Albicans, Toxoplasma Gondii)' },
  {
    id: 'diarreia_etamoeba',
    label: 'Tem Diarréia e Dores Abdominais? (Etamoeba Histolística, Giárdia Lambia)',
  },
  { id: 'constipacao_ascaris', label: 'Tem Constipação? (Áscaris Lumbricóide, Tênia)' },
  { id: 'inchaco_candida', label: 'Tem inchaço? (Cândida Albicans, Giárdia)' },
  { id: 'falta_foco', label: 'Está com falta de Foco? (Toxoplasma Gondii, Candida Albicans)' },
  { id: 'insonia_toxoplasma', label: 'Tem Insônia? (Toxoplasma Gondii, Cândida Albicans)' },
  { id: 'ansiedade_toxoplasma', label: 'Sente Ansiedade? (Toxoplasma Gondii, Cândida Glabata)' },
  { id: 'irritabilidade_giardia', label: 'Sente Irritabilidade? (Giárdia e Strongilóides)' },
  { id: 'depressao_candida', label: 'Tem Depressão? (Candida Glabata e Toxoplasma Gondii)' },
  { id: 'compulsao_doces', label: 'Tem Compulsão por doces? (Cândida Albicans, Giárdia Lambia)' },
  { id: 'dores_migram', label: 'Sente dores que migram? (Strongilóides e Trichinella Spiralís)' },
  {
    id: 'resfriado_frequente',
    label: 'Tem Resfriado freqüente? (Áscaris Lumbricóides, Etamoeba Histólistica)',
  },
  {
    id: 'palpitacao_toxoplasma',
    label: 'Sente Palpitação? (Toxoplasma Gondii, Áscaris Lumbricóide)',
  },
  { id: 'ma_digestao_giardia', label: 'Tem Má Digestão? (Giárdia Lambia, Etamoeba Histolística)' },
  { id: 'azia_etamoeba', label: 'Tem Azia?/Má Digestão? (Etamoeba Histolistica, Giária Lambia)' },
  { id: 'coceira_corpo', label: 'Coceira pelo corpo todo / Acúmulo de toxinas' },
]

export default function NovaAnamnese() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useRealtime(
    'anamnesis',
    (e) => {
      if (e.action === 'update' && e.record.id === processingId) {
        if (e.record.status === 'completed') {
          toast.success('Análise IA concluída com sucesso!')
          setProcessingId(null)
          setLoading(false)
          navigate(`/resultado/${e.record.id}`)
        } else if (e.record.status === 'error') {
          toast.error('Erro na análise IA: ' + (e.record.erro_detalhado || 'Erro desconhecido'))
          setProcessingId(null)
          setLoading(false)
          navigate(`/resultado/${e.record.id}`)
        }
      }
    },
    !!processingId,
  )

  const [formData, setFormData] = useState<Record<string, any>>({
    nome_paciente: '',
    email_paciente: '',
    telefone_paciente: '',
    data_nascimento: '',
    endereco: '',
    profissao: '',
    data_atendimento: new Date().toISOString().split('T')[0],
    peso: '',
    altura: '',
    motivo_consulta: '',
    historico_familiar: '',
    habitos_alimentares: '',
    qualidade_sono: '',
    ingestao_agua: '',
    medicamentos_em_uso: '',
    observacoes_gerais: '',
    habito_intestinal: '',
    remedio_verme_tempo: '',
    cansaco_grau: '',
    status: 'pending',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSelectChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleCheckbox = (id: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [id]: checked }))
  }

  const renderCheckboxes = (items: { id: string; label: string }[], cols = 3) => (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-4`}>
      {items.map((item) => (
        <div key={item.id} className="flex items-start space-x-3">
          <Checkbox
            id={item.id}
            checked={!!formData[item.id]}
            onCheckedChange={(val) => handleCheckbox(item.id, val === true)}
            className="mt-0.5 border-primary/50 text-primary"
          />
          <Label
            htmlFor={item.id}
            className="text-sm text-gray-700 font-normal leading-snug cursor-pointer select-none"
          >
            {item.label}
          </Label>
        </div>
      ))}
    </div>
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!formData.nome_paciente || !formData.data_atendimento || !formData.motivo_consulta) {
      toast.error('Preencha os campos obrigatórios (Nome, Data, Motivo).')
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...formData,
        user_id: user.id,
        data_atendimento: formData.data_atendimento + ' 12:00:00.000Z',
        data_nascimento: formData.data_nascimento
          ? formData.data_nascimento + ' 12:00:00.000Z'
          : null,
        peso: formData.peso ? parseFloat(formData.peso) : null,
        altura: formData.altura ? parseFloat(formData.altura) : null,
        cansaco_grau: formData.cansaco_grau ? parseInt(formData.cansaco_grau) : null,
      }
      const result = await createAnamnese(payload)
      toast.info('Anamnese enviada. Aguardando análise da IA...', { duration: 5000 })
      setProcessingId(result.id)
    } catch (err) {
      toast.error('Erro ao processar anamnese. Verifique os dados e tente novamente.')
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100 animate-fade-in-up mb-12">
      <div className="mb-8 border-b border-gray-200 pb-6 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary flex items-center justify-center md:justify-start gap-3 uppercase tracking-wide">
            <Activity className="w-8 h-8" /> ANAMNESE INTEGRATIVA
          </h1>
          <p className="text-gray-500 mt-2">
            Preencha detalhadamente o perfil clínico do paciente para a geração sistêmica do plano
            terapêutico.
          </p>
        </div>
        <img src={logoUrl} alt="Logo" className="w-48 object-contain" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* SEÇÃO 1: Identificação do Paciente */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
            1. Identificação do Paciente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="nome_paciente">Nome Completo *</Label>
              <Input
                id="nome_paciente"
                value={formData.nome_paciente}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_nascimento">Data de Nascimento</Label>
              <Input
                id="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_atendimento">Data do Atendimento *</Label>
              <Input
                id="data_atendimento"
                type="date"
                value={formData.data_atendimento}
                onChange={handleChange}
                required
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="email_paciente">E-mail</Label>
              <Input
                id="email_paciente"
                type="email"
                value={formData.email_paciente}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone_paciente">Telefone / WhatsApp</Label>
              <Input
                id="telefone_paciente"
                value={formData.telefone_paciente}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profissao">Profissão</Label>
              <Input id="profissao" value={formData.profissao} onChange={handleChange} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Input id="endereco" value={formData.endereco} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                value={formData.peso}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="altura">Altura (m)</Label>
              <Input
                id="altura"
                type="number"
                step="0.01"
                value={formData.altura}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* SEÇÃO 2: Histórico Clínico e Familiar */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
            2. Histórico Clínico e Familiar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="motivo_consulta">Queixa Principal / Motivo da Consulta *</Label>
              <Textarea
                id="motivo_consulta"
                value={formData.motivo_consulta}
                onChange={handleChange}
                required
                className="h-20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="historico_familiar">
                Histórico Familiar de Doenças (Ex: Câncer, Diabetes)
              </Label>
              <Textarea
                id="historico_familiar"
                value={formData.historico_familiar}
                onChange={handleChange}
                className="h-20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicamentos_em_uso">Faz uso contínuo de medicamentos? Quais?</Label>
              <Textarea
                id="medicamentos_em_uso"
                value={formData.medicamentos_em_uso}
                onChange={handleChange}
                className="h-20"
              />
            </div>
          </div>

          <div className="bg-gray-50/80 p-6 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase">
              Condições Pré-existentes e Procedimentos
            </h3>
            {renderCheckboxes(HISTORY_CHECKBOXES, 4)}
          </div>
        </section>

        {/* SEÇÃO 3: Estilo de Vida e Hábitos */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
            3. Estilo de Vida e Hábitos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="habitos_alimentares">Hábitos Alimentares (Resumo)</Label>
              <Input
                id="habitos_alimentares"
                value={formData.habitos_alimentares}
                onChange={handleChange}
                placeholder="Ex: Consome muito doce, fast food..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ingestao_agua">Ingestão Diária de Água</Label>
              <Input
                id="ingestao_agua"
                value={formData.ingestao_agua}
                onChange={handleChange}
                placeholder="Ex: 2 litros"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualidade_sono">Qualidade do Sono</Label>
              <Select
                value={formData.qualidade_sono}
                onValueChange={(v) => handleSelectChange('qualidade_sono', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ruim">Ruim</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="bom">Bom</SelectItem>
                  <SelectItem value="excelente">Excelente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remedio_verme_tempo">Última desparasitação (Remédio de verme)</Label>
              <Input
                id="remedio_verme_tempo"
                value={formData.remedio_verme_tempo}
                onChange={handleChange}
                placeholder="Ex: Há 2 anos"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold mb-2 block">
                Evacuações diárias (Hábito Intestinal)
              </Label>
              <RadioGroup
                value={formData.habito_intestinal}
                onValueChange={(v) => handleSelectChange('habito_intestinal', v)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="h1" />
                  <Label htmlFor="h1">Uma</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="h2" />
                  <Label htmlFor="h2">Duas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="h3" />
                  <Label htmlFor="h3">Três ou Mais</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2 lg:col-span-3">
              <Label htmlFor="observacoes_gerais">Observações Gerais</Label>
              <Textarea
                id="observacoes_gerais"
                value={formData.observacoes_gerais}
                onChange={handleChange}
                className="h-20"
              />
            </div>
          </div>
        </section>

        {/* SEÇÃO 4: Mapeamento de Sintomas e Patógenos */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
            4. Mapeamento de Sintomas (Sistemas e Órgãos)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {Object.entries(ORGANS).map(([organ, symptoms]) => (
              <div
                key={organ}
                className="space-y-3 bg-white p-4 rounded-md border border-gray-100 shadow-sm"
              >
                <h3 className="font-bold text-primary uppercase text-sm tracking-wider">{organ}</h3>
                {renderCheckboxes(symptoms, 1)}
                {organ === 'Pulmão' && (
                  <div className="flex items-center space-x-3 pt-3 mt-2 border-t border-gray-100">
                    <Label
                      htmlFor="cansaco_grau"
                      className="text-sm font-semibold text-gray-700 whitespace-nowrap"
                    >
                      Grau de Cansaço (0 a 10):
                    </Label>
                    <Input
                      id="cansaco_grau"
                      type="number"
                      min="0"
                      max="10"
                      className="w-20 h-9"
                      value={formData.cansaco_grau}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <h3 className="text-lg font-bold text-gray-800 mt-8 mb-4">
            Indicadores Analíticos de Patógenos
          </h3>
          <div className="bg-green-50/50 p-6 rounded-lg border border-green-100 shadow-sm">
            {renderCheckboxes(PATHOGENS, 2)}
          </div>
        </section>

        <Button
          type="submit"
          className="w-full h-14 text-lg font-bold shadow-md hover:shadow-lg transition-all"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-3 h-6 w-6 animate-spin" /> Analisando e Gerando Protocolo...
            </>
          ) : (
            'Gerar Análise IA e Protocolo Terapêutico'
          )}
        </Button>
      </form>
    </div>
  )
}
