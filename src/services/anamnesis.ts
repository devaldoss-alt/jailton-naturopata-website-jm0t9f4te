import pb from '@/lib/pocketbase/client'

export const getAnamnesis = () => pb.collection('anamnesis').getFullList({ sort: '-created' })

export const getAnamnese = (id: string) => pb.collection('anamnesis').getOne(id)

export const updateAnamnese = (id: string, data: Partial<any>) =>
  pb.collection('anamnesis').update(id, data)

export const createAnamnese = (data: Record<string, any>) => pb.collection('anamnesis').create(data)
