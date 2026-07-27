import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface Product extends RecordModel {
  name: string
  type: string
  description: string
}

export const getProducts = () => pb.collection('products').getFullList<Product>({ sort: 'name' })

export const getProduct = (id: string) => pb.collection('products').getOne<Product>(id)

export const createProduct = (data: { name: string; type: string; description?: string }) =>
  pb.collection('products').create<Product>(data)

export const updateProduct = (
  id: string,
  data: Partial<{ name: string; type: string; description: string }>,
) => pb.collection('products').update<Product>(id, data)

export const deleteProduct = (id: string) => pb.collection('products').delete(id)
