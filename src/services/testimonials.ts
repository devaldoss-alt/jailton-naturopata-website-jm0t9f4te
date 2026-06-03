import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface Testimonial extends RecordModel {
  name: string
  message: string
  rating: number
  avatar?: string
  approved: boolean
}

export const getApprovedTestimonials = async () => {
  return await pb.collection('testimonials').getFullList<Testimonial>({
    filter: 'approved = true',
    sort: '-created',
  })
}

export const getAllTestimonials = async () => {
  return await pb.collection('testimonials').getFullList<Testimonial>({
    sort: '-created',
  })
}

export const createTestimonial = async (data: {
  name: string
  message: string
  rating: number
}) => {
  return await pb.collection('testimonials').create<Testimonial>({ ...data, approved: false })
}

export const updateTestimonial = async (id: string, data: Partial<Testimonial>) => {
  return await pb.collection('testimonials').update<Testimonial>(id, data)
}

export const deleteTestimonial = async (id: string) => {
  return await pb.collection('testimonials').delete(id)
}
