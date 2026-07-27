import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Printer, Heart, Activity, Leaf, Wind, Droplet, Brain } from 'lucide-react'
import { getAnamnesis } from '@/services/anamnesis'
import { getSuplementos, type ReportSuplemento } from '@/services/report-suplementos'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'

type AnamnesisRecord = Awaited<ReturnType<typeof getAnamnesis>>

export default function Resultado() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [record, setRecord] = useState<AnamnesisRecord | null>(null)
  const [suplementos, setSuplementos] = useState<ReportSuplemento[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    if (!id) return
    try {
      const data = await getAnamnesis(id)
      setRecord(data)
      const sups = await getSuplementos(id)
      setSuplementos(sups)
    } catch (error) {
      console.error('Error loading result:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  useRealtime('anamnesis', (e) => {
    if (e.record.id === id) loadData()
  })

  useRealtime('report_suplementos', () => {
    if (id) loadData()
  })

  const handlePrint = () => window.print()

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Relatório não encontrado</h1>
          <p className="text-gray-500 mb-6">O relatório solicitado não está disponível.</p>
          <Link to="/consultar-resultado">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const symptoms = [
    { field: 'sintomas_figado', label: 'Fígado', icon: Leaf },
    { field: 'sintomas_coracao', label: 'Coração', icon: Heart },
    { field: 'sintomas_baco', label: 'Baço', icon: Activity },
    { field: 'sintomas_pulmao', label: 'Pulmão', icon: Wind },
    { field: 'sintomas_rins', label: 'Rins', icon: Droplet },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto print-area">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 no-print">
          <Link to="/consultar-resultado">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
          <Button onClick={handlePrint} size="sm">
            <Printer className="mr-2 h-4 w-4" /> Imprimir / PDF
          </Button>
        </div>

        {/* Patient Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Relatório de Atendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-600">Paciente:</span>{' '}
                <span className="text-gray-800">{record.nome_paciente}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Data:</span>{' '}
                <span className="text-gray-800">{formatDate(record.data_atendimento)}</span>
              </div>
              {record.email_paciente && (
                <div>
                  <span className="font-semibold text-gray-600">E-mail:</span>{' '}
                  <span className="text-gray-800">{record.email_paciente}</span>
                </div>
              )}
              {record.telefone_paciente && (
                <div>
                  <span className="font-semibold text-gray-600">Telefone:</span>{' '}
                  <span className="text-gray-800">{record.telefone_paciente}</span>
                </div>
              )}
              {record.tipo_atendimento && (
                <div>
                  <span className="font-semibold text-gray-600">Tipo:</span>{' '}
                  <Badge variant="secondary" className="ml-1">
                    {record.tipo_atendimento}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Diagnóstico (IA) */}
        {record.ia_diagnostico && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5 text-primary" /> Diagnóstico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: record.ia_diagnostico }}
              />
            </CardContent>
          </Card>
        )}

        {/* Sintomas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Sintomas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {record.sintomas_principais && (
                <div>
                  <span className="font-semibold text-gray-600 text-sm">Sintomas Principais:</span>
                  <p className="text-gray-800 mt-1">{record.sintomas_principais}</p>
                </div>
              )}
              {record.orgaos_afetados && (
                <div>
                  <span className="font-semibold text-gray-600 text-sm">Órgãos Afetados:</span>
                  <p className="text-gray-800 mt-1">{record.orgaos_afetados}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                {symptoms.map(({ field, label, icon: Icon }) => {
                  const active = (record as Record<string, unknown>)[field] as boolean
                  if (!active) return null
                  return (
                    <div
                      key={field}
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg"
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">{label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        {record.observacoes_gerais && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800 whitespace-pre-wrap">{record.observacoes_gerais}</p>
            </CardContent>
          </Card>
        )}

        {/* Suplementação (IA) — visible on screen, hidden in print */}
        <Card className="mb-6 no-print">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Leaf className="h-5 w-5 text-primary" /> Suplementação (IA)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html:
                  record.ia_suplementacao ||
                  '<p class="text-gray-400">Sem recomendações de suplementação registradas.</p>',
              }}
            />
          </CardContent>
        </Card>

        {/* Suplementos Recomendados */}
        {suplementos.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Suplementos Recomendados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suplementos.map((sup, idx) => {
                  const productName = sup.expand?.product?.name || 'Produto'
                  const productType = sup.expand?.product?.type
                  return (
                    <div
                      key={idx}
                      className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-0"
                    >
                      <div>
                        <span className="font-medium text-gray-800">{productName}</span>
                        {productType && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {productType}
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-600 text-right">{sup.posology}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Outras Recomendações */}
        {record.suplementacao_outras_recomendacoes && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Outras Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: record.suplementacao_outras_recomendacoes }}
              />
            </CardContent>
          </Card>
        )}

        {/* Orientação de Aparelhos */}
        {record.ia_aparelhos && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Orientação de Aparelhos</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: record.ia_aparelhos }}
              />
            </CardContent>
          </Card>
        )}

        {/* Sugestões Terapêuticas */}
        {record.ia_sugestoes_terapeuticas && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Sugestões Terapêuticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: record.ia_sugestoes_terapeuticas }}
              />
            </CardContent>
          </Card>
        )}

        {/* Referências */}
        {record.ia_referencias && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Referências</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: record.ia_referencias }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
