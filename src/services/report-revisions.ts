import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface ReportRevision extends RecordModel {
  anamnesis: string
  version_number: number
  snapshot: string
  reason: string
  created: string
}

export const getRevisions = (anamnesisId: string) =>
  pb.collection('report_revisions').getFullList<ReportRevision>({
    filter: `anamnesis = "${anamnesisId}"`,
    sort: '-version_number',
  })

export const getRevision = (id: string) =>
  pb.collection('report_revisions').getOne<ReportRevision>(id)
