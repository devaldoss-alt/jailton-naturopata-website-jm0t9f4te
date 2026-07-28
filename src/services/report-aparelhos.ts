import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface ReportAparelho extends RecordModel {
  anamnesis: string
  aparelho: string
  como_usar: string
  expand?: Record<string, any>
}

export interface SelectedAparelho {
  id?: string
  aparelho: string
  aparelhoName: string
  aparelhoFuncao: string
  aparelhoBeneficios: string
  aparelhoOrder: number
  aparelhoComoUsar: string
  aparelhoContraindicacoes: string
  como_usar: string
}

export const getReportAparelhos = (anamnesisId: string) =>
  pb.collection('report_aparelhos').getFullList<ReportAparelho>({
    filter: `anamnesis = "${anamnesisId}"`,
    expand: 'aparelho',
    sort: 'created',
  })

export const createReportAparelho = (data: {
  anamnesis: string
  aparelho: string
  como_usar?: string
}) => pb.collection('report_aparelhos').create<ReportAparelho>(data)

export const deleteReportAparelho = (id: string) => pb.collection('report_aparelhos').delete(id)

export const deleteAllReportAparelhos = async (anamnesisId: string) => {
  const items = await getReportAparelhos(anamnesisId)
  await Promise.all(items.map((item) => deleteReportAparelho(item.id)))
}

export const syncReportAparelhos = async (anamnesisId: string, aparelhos: SelectedAparelho[]) => {
  await deleteAllReportAparelhos(anamnesisId)
  await Promise.all(
    aparelhos.map((a) =>
      createReportAparelho({
        anamnesis: anamnesisId,
        aparelho: a.aparelho,
        como_usar: a.como_usar || '',
      }),
    ),
  )
}
