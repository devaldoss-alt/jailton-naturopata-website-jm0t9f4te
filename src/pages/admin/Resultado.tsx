import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAnamnese, updateAnamnese } from '@/services/anamnesis'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ArrowLeft, Printer, Loader2, Edit, Save, X } from 'lucide-react'
import logoUrl from '@/assets/image-09e0a.png'
import { toast } from 'sonner'

const ContentEditableField = ({
  value,
  onChange,
  isEditing,
}: {
  value: string
  onChange: (val: string) => void
  isEditing: boolean
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && !isEditing) {
      ref.current.innerHTML = value
    }
  }, [isEditing, value])

  const handleInput = () => {
    if (ref.current) {
      onChange(ref.current.innerHTML)
    }
  }

  if (!isEditing) {
    return (
      <div
        className="content-html"
        dangerouslySetInnerHTML={{ __html: value || '<p>Nenhum dado informado.</p>' }}
        style={{ fontSize: '14px', marginBottom: '25px' }}
      />
    )
  }

  return (
    <>
      <div className="text-xs text-gray-500 mb-2 font-medium">
        Modo de edição ativo. Você pode alterar o texto livremente (atalhos como Ctrl+B e Ctrl+I
        funcionam).
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={handleInput}
        className="content-html min-h-[150px] p-4 border-2 border-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm mb-6 transition-colors"
        style={{ fontSize: '14px' }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </>
  )
}

export default function Resultado() {
  const { id } = useParams()
  const [anamnese, setAnamnese] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [sugestoes, setSugestoes] = useState('')
  const [suplementacao, setSuplementacao] = useState('')

  useEffect(() => {
    if (id) {
      getAnamnese(id)
        .then((data) => {
          setAnamnese(data)
          if (!isEditing) {
            setSugestoes(data.ia_sugestoes_terapeuticas || '')
            setSuplementacao(data.ia_suplementacao || '')
          }
        })
        .catch(console.error)
    }
  }, [id, isEditing])

  useRealtime('anamnesis', (e) => {
    if (e.record.id === id) {
      setAnamnese(e.record)
      if (!isEditing) {
        setSugestoes(e.record.ia_sugestoes_terapeuticas || '')
        setSuplementacao(e.record.ia_suplementacao || '')
      }
    }
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateAnamnese(id as string, {
        ia_sugestoes_terapeuticas: sugestoes,
        ia_suplementacao: suplementacao,
      })
      toast.success('Alterações salvas com sucesso!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Erro ao salvar as alterações.')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (anamnese) {
      setSugestoes(anamnese.ia_sugestoes_terapeuticas || '')
      setSuplementacao(anamnese.ia_suplementacao || '')
    }
  }

  if (!anamnese) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-primary/20 rounded-full mb-4"></div>
          <p className="text-gray-500">Carregando relatório...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in-up">
      <style>{`
        .content-html ul { list-style-type: disc; padding-left: 20px; margin-bottom: 10px; }
        .content-html li { margin-bottom: 6px; line-height: 1.5; }
        .content-html p { margin-bottom: 10px; line-height: 1.6; }
        .content-html strong { font-weight: 600; color: #1a4025; }
        
        @media print {
          body { background-color: white !important; }
          body * { visibility: hidden; }
          #printable-pdf, #printable-pdf * { visibility: visible; }
          #printable-pdf {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            border: none !important;
          }
          .no-print { display: none !important; }
          @page { margin: 1cm; }
        }
      `}</style>

      <div className="flex justify-between items-center mb-8 no-print bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-xl font-bold text-gray-800 ml-2">Relatório Gerado</h1>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/painel">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Link>
          </Button>

          {anamnese.status === 'completed' && !isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="text-primary border-primary hover:bg-primary/5"
            >
              <Edit className="mr-2 h-4 w-4" /> Editar Recomendações
            </Button>
          )}

          {isEditing && (
            <>
              <Button variant="ghost" onClick={handleCancel} disabled={saving}>
                <X className="mr-2 h-4 w-4" /> Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar Alterações
              </Button>
            </>
          )}

          {!isEditing && (
            <Button
              onClick={() => window.print()}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              <Printer className="mr-2 h-4 w-4" /> Gerar PDF
            </Button>
          )}
        </div>
      </div>

      <div id="printable-pdf" className="bg-white shadow-sm border border-gray-200">
        <div
          style={{
            border: '2px solid #1a4025',
            padding: '40px',
            fontFamily: 'Arial, sans-serif',
            minHeight: '1000px',
            color: '#111',
            backgroundColor: '#fff',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <img
              src={logoUrl}
              alt="Green Life Biofísica"
              style={{
                height: '140px',
                width: 'auto',
                margin: '0 auto 20px',
                objectFit: 'contain',
              }}
            />
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#1a4025',
              }}
            >
              Relatório de Anamnese Integrativa
            </h2>
          </div>

          <div
            style={{
              backgroundColor: '#f4f7f5',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '30px',
              border: '1px solid #e2e8e4',
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#1a4025',
                textTransform: 'uppercase',
              }}
            >
              Dados do Paciente
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <p style={{ margin: '0', fontSize: '15px' }}>
                <strong>Tipo:</strong>{' '}
                <span style={{ textTransform: 'capitalize' }}>
                  {anamnese.tipo_atendimento || 'Consulta'}
                </span>
              </p>
              <p style={{ margin: '0', fontSize: '15px' }}>
                <strong>Nome:</strong> {anamnese.nome_paciente}
              </p>
              <p style={{ margin: '0', fontSize: '15px' }}>
                <strong>Data:</strong> {format(new Date(anamnese.data_atendimento), 'dd/MM/yyyy')}
              </p>
            </div>
          </div>

          <h3
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '15px',
              color: '#1a4025',
              borderBottom: '2px solid #1a4025',
              paddingBottom: '8px',
            }}
          >
            Análise e Sintomas (Checklist)
          </h3>
          <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '12px' }}>
            <strong>Queixa principal / Histórico:</strong> {anamnese.motivo_consulta}
          </p>
          <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '12px' }}>
            <strong>Sintomas Identificados:</strong>{' '}
            {anamnese.sintomas_principais || 'Nenhum sintoma marcado.'}
          </p>
          <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '30px' }}>
            <strong>Órgãos/Sistemas Relacionados:</strong>{' '}
            {anamnese.orgaos_afetados || 'Nenhum órgão marcado.'}
          </p>

          <h3
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '15px',
              color: '#1a4025',
              borderBottom: '2px solid #1a4025',
              paddingBottom: '8px',
            }}
          >
            Plano Terapêutico e Sugestões
          </h3>
          {anamnese.status === 'pending' ? (
            <div className="flex items-center text-gray-500 mb-6 py-4">
              <Loader2 className="w-5 h-5 mr-2 animate-spin text-primary" />
              <span>Processando plano terapêutico... A IA está analisando os dados.</span>
            </div>
          ) : anamnese.status === 'error' ? (
            <div className="text-red-500 mb-6 py-4">
              <p>Erro ao gerar sugestões. Por favor, edite a anamnese ou gere novamente.</p>
            </div>
          ) : (
            <ContentEditableField value={sugestoes} onChange={setSugestoes} isEditing={isEditing} />
          )}

          <h3
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '15px',
              color: '#1a4025',
              borderBottom: '2px solid #1a4025',
              paddingBottom: '8px',
            }}
          >
            Protocolo de Suplementação Sistemática
          </h3>
          {anamnese.status === 'pending' ? (
            <div className="flex items-center text-gray-500 mb-6 py-4">
              <Loader2 className="w-5 h-5 mr-2 animate-spin text-primary" />
              <span>Processando protocolo de suplementação...</span>
            </div>
          ) : anamnese.status === 'error' ? (
            <div className="text-red-500 mb-6 py-4">
              <p>Erro ao gerar protocolo.</p>
            </div>
          ) : (
            <ContentEditableField
              value={suplementacao}
              onChange={setSuplementacao}
              isEditing={isEditing}
            />
          )}

          {anamnese.ia_referencias && !isEditing && (
            <>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginTop: '40px',
                  marginBottom: '10px',
                  color: '#4a5568',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '5px',
                }}
              >
                Referências e Embasamento
              </h3>
              <div
                className="content-html"
                dangerouslySetInnerHTML={{ __html: anamnese.ia_referencias }}
                style={{ fontSize: '13px', color: '#718096' }}
              />
            </>
          )}

          <div
            style={{
              textAlign: 'center',
              marginTop: '60px',
              fontSize: '13px',
              color: '#718096',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '20px',
            }}
          >
            <strong>Green Life Biofísica</strong> - Ciência que transforma. Vida que floresce.
            <br />
            Plano terapêutico de suporte clínico complementar.
          </div>
        </div>
      </div>
    </div>
  )
}
