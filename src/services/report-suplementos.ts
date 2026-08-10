import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface ReportSuplemento extends RecordModel {
  anamnesis: string
  product: string | null
  product_name?: string
  posology: string
  expand?: Record<string, any>
}

export interface SelectedSupplement {
  id?: string
  product: string
  productName: string
  productType: string
  posology: string
}

export const getSuplementos = (anamnesisId: string) =>
  pb.collection('report_suplementos').getFullList<ReportSuplemento>({
    filter: `anamnesis = "${anamnesisId}"`,
    expand: 'product',
    sort: 'created',
  })

export const createSuplemento = (data: {
  anamnesis: string
  product?: string
  posology: string
  product_name?: string
}) => pb.collection('report_suplementos').create<ReportSuplemento>(data)

export const deleteSuplemento = (id: string) => pb.collection('report_suplementos').delete(id)

export const deleteAllSuplementos = async (anamnesisId: string) => {
  const items = await getSuplementos(anamnesisId)
  await Promise.all(items.map((item) => deleteSuplemento(item.id)))
}

export const syncSuplementos = async (anamnesisId: string, items: SelectedSupplement[]) => {
  await deleteAllSuplementos(anamnesisId)
  await Promise.all(
    items.map((item) => {
      const data: {
        anamnesis: string
        product?: string
        posology: string
        product_name?: string
      } = {
        anamnesis: anamnesisId,
        posology: item.posology,
      }
      if (item.product) data.product = item.product
      if (item.productName) data.product_name = item.productName
      return createSuplemento(data)
    }),
  )
}
