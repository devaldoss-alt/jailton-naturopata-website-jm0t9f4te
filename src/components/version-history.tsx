import { useEffect, useState } from 'react'
import { getRevisions, type ReportRevision } from '@/services/report-revisions'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { RotateCcw, History } from 'lucide-react'

const FIELD_LABELS: Record<string, string> = {
  ia_diagnostico: 'Diagnóstico Naturopático',
  ia_sugestoes_terapeuticas: 'Sugestões Terapêuticas',
  ia_suplementacao: 'Suplementação (IA)',
  ia_aparelhos: 'Orientação de Aparelhos',
  ia_referencias: 'Referências',
  suplementacao_outras_recomendacoes: 'Outras Recomendações',
}

interface VersionHistoryProps {
  anamnesisId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onRestore: (snapshot: any, versionNumber: number) => void
}

export function VersionHistory({
  anamnesisId,
  open,
  onOpenChange,
  onRestore,
}: VersionHistoryProps) {
  const [revisions, setRevisions] = useState<ReportRevision[]>([])
  const [selectedRevision, setSelectedRevision] = useState<ReportRevision | null>(null)
  const [snapshot, setSnapshot] = useState<any>(null)

  useEffect(() => {
    if (open && anamnesisId) {
      getRevisions(anamnesisId)
        .then((data) => {
          setRevisions(data)
          if (data.length > 0) {
            setSelectedRevision(data[0])
            setSnapshot(JSON.parse(data[0].snapshot || '{}'))
          }
        })
        .catch(() => setRevisions([]))
    }
  }, [open, anamnesisId])

  const handleSelect = (rev: ReportRevision) => {
    setSelectedRevision(rev)
    setSnapshot(JSON.parse(rev.snapshot || '{}'))
  }

  const handleRestore = () => {
    if (snapshot && selectedRevision) {
      onRestore(snapshot, selectedRevision.version_number)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" /> Histórico de Revisões
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 mt-4" style={{ maxHeight: '60vh' }}>
          <div className="w-64 shrink-0 border-r pr-4 overflow-y-auto">
            {revisions.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhuma revisão encontrada.</p>
            ) : (
              <div className="space-y-1">
                {revisions.map((rev) => (
                  <button
                    key={rev.id}
                    type="button"
                    onClick={() => handleSelect(rev)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      selectedRevision?.id === rev.id ? 'bg-primary/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    <p className="font-medium text-sm">Versão {rev.version_number}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(rev.created), 'dd/MM/yyyy HH:mm')}
                    </p>
                    {rev.reason && (
                      <p className="text-xs text-gray-400 italic mt-1 truncate">{rev.reason}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            {snapshot ? (
              <div className="space-y-4">
                {Object.entries(snapshot).map(([key, value]) => {
                  if (key === 'suplementos') {
                    const sups = value as any[]
                    if (!sups || sups.length === 0) return null
                    return (
                      <div key={key}>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Suplementos</h4>
                        <ul className="text-sm space-y-1">
                          {sups.map((s, i) => (
                            <li key={i} className="text-gray-600">
                              {s.product}: {s.posology}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  }
                  const label = FIELD_LABELS[key] || key
                  if (!value) return null
                  return (
                    <div key={key}>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">{label}</h4>
                      <div
                        className="content-html text-sm border rounded-md p-3 bg-gray-50 max-h-40 overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: value as string }}
                      />
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Selecione uma revisão para visualizar.</p>
            )}
          </div>
        </div>
        {selectedRevision && (
          <div className="flex justify-end mt-4 pt-4 border-t">
            <Button
              onClick={handleRestore}
              variant="outline"
              className="text-primary border-primary hover:bg-primary/5"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Restaurar Versão{' '}
              {selectedRevision.version_number}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
