import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface Aparelho extends RecordModel {
  nome: string
  funcao: string
  beneficios: string
  order: number
  como_usar: string
  contraindicacoes: string
}

export const getAparelhos = () => pb.collection('aparelhos').getFullList<Aparelho>({ sort: 'nome' })

export const getAparelho = (id: string) => pb.collection('aparelhos').getOne<Aparelho>(id)

export const createAparelho = (data: {
  nome: string
  funcao: string
  beneficios: string
  order?: number
  como_usar?: string
  contraindicacoes?: string
}) => pb.collection('aparelhos').create<Aparelho>(data)

export const updateAparelho = (
  id: string,
  data: Partial<{
    nome: string
    funcao: string
    beneficios: string
    order: number
    como_usar: string
    contraindicacoes: string
  }>,
) => pb.collection('aparelhos').update<Aparelho>(id, data)

export const deleteAparelho = (id: string) => pb.collection('aparelhos').delete(id)
