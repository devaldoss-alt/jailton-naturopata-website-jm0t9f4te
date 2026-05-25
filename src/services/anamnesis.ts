import pb from '@/lib/pocketbase/client'

export const getAnamnesis = () => pb.collection('anamnesis').getFullList({ sort: '-created' })

export const getAnamnese = (id: string) => pb.collection('anamnesis').getOne(id)

export const createAnamnese = (data: {
  user_id: string
  nome_paciente: string
  data_atendimento: string
  tipo_atendimento?: string
  motivo_consulta: string
  sintomas_principais?: string
  orgaos_afetados?: string
  sintomas_figado?: boolean
  sintomas_coracao?: boolean
  sintomas_baco?: boolean
  sintomas_pulmao?: boolean
  sintomas_rins?: boolean
  status: string
}) => pb.collection('anamnesis').create(data)
