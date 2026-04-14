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

export const createTestimonial = async (data: {
  name: string
  message: string
  rating: number
}) => {
  return await pb.collection('testimonials').create<Testimonial>({ ...data, approved: false })
}
