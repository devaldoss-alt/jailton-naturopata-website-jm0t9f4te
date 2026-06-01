import { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getAnamnese, updateAnamnese, retryAnamneseAi } from '@/services/anamnesis'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import {
  ArrowLeft,
  Printer,
  Loader2,
  Edit,
  Save,
  X,
  AlertCircle,
  Copy,
  MessageCircle,
} from 'lucide-react'
import logoUrl from '@/assets/logoanaminese-removebg-preview-31311.png'
import assinaturaUrl from '@/assets/assinaturajailton-removebg-preview-82f7a.png'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/pocketbase/errors'

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

  const execCommand = (command: string, arg?: string) => {
    document.execCommand(command, false, arg)
    ref.current?.focus()
    handleInput()
  }

  if (!isEditing) {
    return (
      <div
        className="content-html"
        dangerouslySetInnerHTML={{ __html: value || '<p>Nenhum dado informado.</p>' }}
        style={{ fontSize: '14px', marginBottom: '25px', color: '#111' }}
      />
    )
  }

  return (
    <div className="mb-6 border-2 border-primary/30 rounded-md bg-white shadow-sm overflow-hidden transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-1 flex-wrap">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 font-bold"
          onClick={() => execCommand('bold')}
        >
          B
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 italic"
          onClick={() => execCommand('italic')}
        >
          I
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 underline"
          onClick={() => execCommand('underline')}
        >
          U
        </Button>
        <div className="w-px h-5 bg-gray-300 mx-1 self-center"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => execCommand('insertUnorderedList')}
        >
          • Lista
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => execCommand('insertOrderedList')}
        >
          1. Lista
        </Button>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={handleInput}
        className="content-html min-h-[200px] p-5 focus:outline-none bg-white"
        style={{ fontSize: '14px', color: '#111' }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  )
}

export default function Resultado() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [anamnese, setAnamnese] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [loadError, setLoadError] = useState(false)

  const handleRetry = async () => {
    setRetrying(true)
    try {
      setAnamnese((prev: any) => ({ ...prev, status: 'pending' }))
      await retryAnamneseAi(id as string)
      toast.success('Geração iniciada! Aguarde a conclusão.')
    } catch (error) {
      toast.error(`Erro ao tentar novamente: ${getErrorMessage(error)}`)
      setAnamnese((prev: any) => ({ ...prev, status: 'error' }))
    } finally {
      setRetrying(false)
    }
  }
  const [diagnostico, setDiagnostico] = useState('')
  const [sugestoes, setSugestoes] = useState('')
  const [suplementacao, setSuplementacao] = useState('')
  const [aparelhos, setAparelhos] = useState('')
  const [referencias, setReferencias] = useState('')

  useEffect(() => {
    if (id) {
      setLoadError(false)
      getAnamnese(id)
        .then((data) => {
          setAnamnese(data)
          if (!isEditing) {
            setDiagnostico(data.ia_diagnostico || '')
            setSugestoes(data.ia_sugestoes_terapeuticas || '')
            setSuplementacao(data.ia_suplementacao || '')
            setAparelhos(data.ia_aparelhos || '')
            setReferencias(data.ia_referencias || '')
          }
        })
        .catch((error) => {
          console.error(error)
          setLoadError(true)
        })
    } else {
      setLoadError(true)
    }
  }, [id, isEditing])

  useRealtime('anamnesis', (e) => {
    if (e.record.id === id) {
      setAnamnese(e.record)
      if (!isEditing) {
        setDiagnostico(e.record.ia_diagnostico || '')
        setSugestoes(e.record.ia_sugestoes_terapeuticas || '')
        setSuplementacao(e.record.ia_suplementacao || '')
        setAparelhos(e.record.ia_aparelhos || '')
        setReferencias(e.record.ia_referencias || '')
      }
    }
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateAnamnese(id as string, {
        ia_diagnostico: diagnostico,
        ia_sugestoes_terapeuticas: sugestoes,
        ia_suplementacao: suplementacao,
        ia_aparelhos: aparelhos,
        ia_referencias: referencias,
      })
      toast.success('Alterações salvas com sucesso!')
      setIsEditing(false)
    } catch (error) {
      toast.error(`Erro ao salvar: ${getErrorMessage(error)}`)
    } finally {
      setSaving(false)
    }
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Relatório não encontrado</h2>
        <p className="text-gray-500 text-center max-w-md mb-6">
          Não foi possível carregar o relatório solicitado. O link pode estar incorreto ou o
          relatório foi removido.
        </p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>
    )
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
        .content-html ul { list-style-type: disc; padding-left: 20px; margin-bottom: 12px; }
        .content-html ol { list-style-type: decimal; padding-left: 20px; margin-bottom: 12px; }
        .content-html li { margin-bottom: 8px; line-height: 1.6; }
        .content-html p { margin-bottom: 12px; line-height: 1.6; }
        .content-html strong { font-weight: bold; color: #1a4025; }
        
        @media print {
          html, body, #root { 
            height: auto !important; 
            min-height: auto !important; 
            overflow: visible !important; 
            background-color: white !important; 
            margin: 0; 
            padding: 0; 
            display: block !important;
            -webkit-print-color-adjust: exact; 
          }
            
          .no-print { display: none !important; }
            
          body * { visibility: hidden; }
          #printable-pdf, #printable-pdf * { visibility: visible; }
            
          * {
            overflow: visible !important;
            max-height: none !important;
          }

          #printable-pdf {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%; 
            margin: 0 !important; padding: 0 !important; 
            border: none !important; box-shadow: none !important;
          }

          .content-html { page-break-inside: auto; }          .content-html p, .content-html li { page-break-inside: avoid; }
          h1, h2, h3, h4 { page-break-after: avoid; }
          .avoid-break { page-break-inside: avoid; }

          @page { margin: 15mm; }
        }
      `}</style>

      <div
        className="flex justify-between items-center mb-8 mt-12 md:mt-20 no-print bg-white p-4 rounded-xl shadow-sm border border-gray-100"
        style={{ position: 'relative', zIndex: 999 }}
      >
        <h1 className="text-xl font-bold text-gray-800 ml-2 flex items-center gap-2">
          Relatório Terapêutico
          {isAuthenticated && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary border border-primary/20">
              Modo Profissional Ativo
            </span>
          )}
        </h1>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 no-print flex flex-col sm:flex-row gap-4 justify-between items-center animate-fade-in-up">
        <div className="flex gap-2 flex-wrap">
          <a
            href="/anamnese"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </a>
          {anamnese.status === 'completed' && !isEditing && (
            <a
              href={isAuthenticated ? `/editar/${id}` : '/login'}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-primary text-primary hover:bg-primary/5 h-10 px-4 py-2"
            >
              <Edit className="mr-2 h-4 w-4" /> Editar Ficha
            </a>
          )}
          {anamnese.status === 'completed' && !isEditing && (
            <Button
              variant="outline"
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login')
                } else {
                  setIsEditing(true)
                }
              }}
              className="text-primary border-primary hover:bg-primary/5"
            >
              <Edit className="mr-2 h-4 w-4" /> Editar IA
            </Button>
          )}
          {isEditing && (
            <>
              <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={saving}>
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
                )}{' '}
                Salvar
              </Button>
            </>
          )}
          {!isEditing && anamnese.status === 'completed' && (
            <>
              <a
                href={
                  (anamnese.telefone_paciente || '').replace(/\D/g, '')
                    ? `https://api.whatsapp.com/send?phone=55${(anamnese.telefone_paciente || '').replace(/\D/g, '')}&text=${encodeURIComponent(`Olá, segue o link do seu Diagnóstico Naturopático: ${window.location.href}`)}`
                    : `https://api.whatsapp.com/send?text=${encodeURIComponent(`Olá, segue o link do seu Diagnóstico Naturopático: ${window.location.href}`)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
              >
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
              </a>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" /> Gerar Impressão/PDF
              </Button>
            </>
          )}
        </div>

        {!isEditing && anamnese.status === 'completed' && (
          <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <input
              type="text"
              readOnly
              value={window.location.href}
              id="copy-link-input"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-64"
            />
            <Button
              variant="outline"
              onClick={() => {
                const copyText = document.getElementById('copy-link-input') as HTMLInputElement
                if (copyText) {
                  copyText.select()
                  copyText.setSelectionRange(0, 99999) // For mobile devices
                  try {
                    document.execCommand('copy')
                    alert('Link copiado com sucesso!')
                  } catch (err) {
                    toast.error('Não foi possível copiar o link')
                  }
                }
              }}
            >
              <Copy className="mr-2 h-4 w-4" /> Copiar
            </Button>
          </div>
        )}
      </div>

      <div id="printable-pdf" className="bg-white shadow-sm border border-gray-200">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead className="print-header">
            <tr>
              <td>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '30px 40px 10px',
                    borderBottom: '2px solid #1a4025',
                  }}
                >
                  <img
                    src={logoUrl}
                    alt="Green Life Biofísica"
                    style={{ height: '70px', objectFit: 'contain' }}
                  />
                  <div style={{ textAlign: 'right', color: '#1a4025' }}>
                    <h2
                      style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        margin: 0,
                        letterSpacing: '1px',
                      }}
                    >
                      PLANO TERAPÊUTICO
                    </h2>
                    <p style={{ fontSize: '14px', margin: '5px 0 0' }}>
                      Paciente: <strong>{anamnese.nome_paciente}</strong>
                    </p>
                    {anamnese.data_nascimento && (
                      <p style={{ fontSize: '12px', margin: '2px 0 0', color: '#4a5568' }}>
                        Nasc.: {format(new Date(anamnese.data_nascimento), 'dd/MM/yyyy')}
                      </p>
                    )}
                    {anamnese.cpf && (
                      <p style={{ fontSize: '12px', margin: '2px 0 0', color: '#4a5568' }}>
                        CPF: {anamnese.cpf}
                      </p>
                    )}
                    {anamnese.rg && (
                      <p style={{ fontSize: '12px', margin: '2px 0 0', color: '#4a5568' }}>
                        RG: {anamnese.rg}
                      </p>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div
                  style={{
                    padding: '30px 40px 40px',
                    fontFamily: 'Arial, sans-serif',
                    color: '#111',
                  }}
                >
                  {anamnese.status === 'error' && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md no-print">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            Não foi possível gerar o plano terapêutico
                          </h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>
                              Ocorreu um erro técnico na comunicação com o serviço de Inteligência
                              Artificial.
                            </p>
                            {anamnese.erro_detalhado && (
                              <div className="mt-3 bg-red-100/50 p-3 rounded text-xs font-mono break-all border border-red-200">
                                {anamnese.erro_detalhado}
                              </div>
                            )}
                          </div>
                          <div className="mt-4">
                            <Button
                              variant="outline"
                              onClick={handleRetry}
                              disabled={retrying || anamnese.status === 'pending'}
                              className="bg-white border-red-200 text-red-700 hover:bg-red-50"
                              size="sm"
                            >
                              {anamnese.status === 'pending' || retrying ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : null}
                              {anamnese.status === 'pending' || retrying
                                ? 'Processando...'
                                : 'Tentar Novamente'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    className="avoid-break"
                    style={{
                      backgroundColor: '#f4f7f5',
                      padding: '15px 20px',
                      borderRadius: '8px',
                      marginBottom: '30px',
                      border: '1px solid #e2e8e4',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                      <p style={{ margin: '0', fontSize: '14px' }}>
                        <strong>Data:</strong>{' '}
                        {format(new Date(anamnese.data_atendimento), 'dd/MM/yyyy')}
                      </p>
                      <p style={{ margin: '0', fontSize: '14px' }}>
                        <strong>Contato:</strong>{' '}
                        {anamnese.telefone_paciente || anamnese.telefone || 'N/I'}
                      </p>
                      <p style={{ margin: '0', fontSize: '14px' }}>
                        <strong>Profissão:</strong> {anamnese.profissao || 'N/I'}
                      </p>
                      <p style={{ margin: '0', fontSize: '14px', width: '100%' }}>
                        <strong>Motivo / Queixa Principal:</strong> {anamnese.motivo_consulta}
                      </p>
                    </div>
                  </div>

                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      marginBottom: '15px',
                      color: '#1a4025',
                      borderBottom: '1px solid #1a4025',
                      paddingBottom: '5px',
                    }}
                  >
                    Diagnóstico Naturopático
                  </h3>
                  {anamnese.status === 'pending' ? (
                    <div className="flex items-center text-gray-500 mb-6 py-4">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin text-primary" />
                      <span>Processando diagnóstico...</span>
                    </div>
                  ) : anamnese.status === 'error' ? (
                    <p className="text-red-500 mb-6 text-sm">
                      Operação falhou. Veja os detalhes do erro acima.
                    </p>
                  ) : (
                    <ContentEditableField
                      value={diagnostico}
                      onChange={setDiagnostico}
                      isEditing={isEditing}
                    />
                  )}

                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      marginBottom: '15px',
                      color: '#1a4025',
                      borderBottom: '1px solid #1a4025',
                      paddingBottom: '5px',
                    }}
                  >
                    Sugestões Terapêuticas
                  </h3>
                  {anamnese.status === 'pending' ? (
                    <div className="flex items-center text-gray-500 mb-6 py-4">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin text-primary" />
                      <span>Processando análise clínica...</span>
                    </div>
                  ) : anamnese.status === 'error' ? (
                    <p className="text-red-500 mb-6 text-sm">
                      Operação falhou. Veja os detalhes do erro acima.
                    </p>
                  ) : (
                    <ContentEditableField
                      value={sugestoes}
                      onChange={setSugestoes}
                      isEditing={isEditing}
                    />
                  )}

                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      marginBottom: '15px',
                      color: '#1a4025',
                      borderBottom: '1px solid #1a4025',
                      paddingBottom: '5px',
                      marginTop: '30px',
                    }}
                  >
                    Suplementação
                  </h3>
                  {anamnese.status === 'pending' ? (
                    <div className="flex items-center text-gray-500 mb-6 py-4">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin text-primary" />
                      <span>Processando suplementação...</span>
                    </div>
                  ) : anamnese.status === 'error' ? (
                    <p className="text-red-500 mb-6 text-sm">
                      Operação falhou. Veja os detalhes do erro acima.
                    </p>
                  ) : (
                    <ContentEditableField
                      value={suplementacao}
                      onChange={setSuplementacao}
                      isEditing={isEditing}
                    />
                  )}

                  {(isEditing || !!aparelhos) && (
                    <div className="avoid-break">
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          marginBottom: '15px',
                          color: '#1a4025',
                          borderBottom: '1px solid #1a4025',
                          paddingBottom: '5px',
                          marginTop: '30px',
                        }}
                      >
                        Orientação de Aparelhos
                      </h3>
                      {anamnese.status === 'pending' ? (
                        <div className="flex items-center text-gray-500 mb-6 py-4">
                          <Loader2 className="w-5 h-5 mr-2 animate-spin text-primary" />
                          <span>Processando orientações de aparelhos...</span>
                        </div>
                      ) : anamnese.status === 'error' ? (
                        <p className="text-red-500 mb-6 text-sm">
                          Operação falhou. Veja os detalhes do erro acima.
                        </p>
                      ) : (
                        <ContentEditableField
                          value={aparelhos}
                          onChange={setAparelhos}
                          isEditing={isEditing}
                        />
                      )}
                    </div>
                  )}

                  <div className="avoid-break">
                    <h3
                      style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginTop: '40px',
                        marginBottom: '10px',
                        color: '#4a5568',
                        borderBottom: '1px solid #e2e8f0',
                        paddingBottom: '5px',
                      }}
                    >
                      Referências
                    </h3>
                    {anamnese.status === 'pending' ? (
                      <p className="text-gray-500 text-sm">Aguardando elaboração...</p>
                    ) : anamnese.status === 'error' ? (
                      <p className="text-red-500 text-sm mb-6">
                        Operação falhou. Veja os detalhes do erro acima.
                      </p>
                    ) : (
                      <ContentEditableField
                        value={referencias}
                        onChange={setReferencias}
                        isEditing={isEditing}
                      />
                    )}
                  </div>

                  <div className="avoid-break" style={{ marginTop: '50px', textAlign: 'center' }}>
                    <img
                      src={assinaturaUrl}
                      alt="Assinatura Jailton"
                      style={{ height: '80px', margin: '0 auto', objectFit: 'contain' }}
                    />
                    <p
                      style={{
                        margin: '10px 0 0',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        color: '#1a4025',
                      }}
                    >
                      JAILTON SANTOS CONCEIÇÃO
                    </p>
                    <p style={{ margin: '2px 0', fontSize: '12px', color: '#4a5568' }}>
                      CBO 6320-10
                    </p>
                    <p style={{ margin: '2px 0', fontSize: '12px', color: '#4a5568' }}>
                      jailtonnaturopata@hotmail.com
                    </p>
                    <p style={{ margin: '2px 0', fontSize: '12px', color: '#4a5568' }}>
                      WhatsApp (71) 99929-2989
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot className="print-footer">
            <tr>
              <td>
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '11px',
                    color: '#718096',
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: '10px',
                    paddingBottom: '20px',
                    margin: '0 40px',
                  }}
                >
                  <strong>Green Life Biofísica</strong> - Ciência que transforma. Vida que floresce.
                  <br />
                  Plano terapêutico de suporte clínico complementar. As orientações não substituem a
                  avaliação médica.
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
