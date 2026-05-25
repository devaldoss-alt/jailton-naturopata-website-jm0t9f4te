import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAnamnese } from '@/services/anamnesis'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ArrowLeft, Printer, Loader2 } from 'lucide-react'
import logoUrl from '@/assets/logo-oficial_sem-fundo-420d8.png'

export default function Resultado() {
  const { id } = useParams()
  const [anamnese, setAnamnese] = useState<any>(null)

  useEffect(() => {
    if (id) {
      getAnamnese(id).then(setAnamnese).catch(console.error)
    }
  }, [id])

  useRealtime('anamnesis', (e) => {
    if (e.record.id === id) {
      setAnamnese(e.record)
    }
  })

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
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao painel
            </Link>
          </Button>
          <Button
            onClick={() => window.print()}
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            <Printer className="mr-2 h-4 w-4" /> Gerar PDF
          </Button>
        </div>
      </div>

      <div id="printable-pdf" className="bg-white shadow-sm border border-gray-200">
        <div
          style={{
            border: '2px solid #3a3a3a',
            padding: '40px',
            fontFamily: 'Arial, sans-serif',
            minHeight: '1000px',
            color: '#111',
            backgroundColor: '#fff',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img
              src={logoUrl}
              alt="Logo"
              style={{ height: '100px', width: 'auto', margin: '0 auto 20px' }}
            />
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Relatório de Anamnese Integrativa
            </h2>
          </div>

          <div
            style={{
              backgroundColor: '#f9f9f9',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '25px',
              border: '1px solid #eee',
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '10px',
                color: '#2a5a3b',
                textTransform: 'uppercase',
              }}
            >
              Dados do Paciente
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <p style={{ margin: '0' }}>
                <strong>Tipo:</strong>{' '}
                <span style={{ textTransform: 'capitalize' }}>
                  {anamnese.tipo_atendimento || 'Consulta'}
                </span>
              </p>
              <p style={{ margin: '0' }}>
                <strong>Nome:</strong> {anamnese.nome_paciente}
              </p>
              <p style={{ margin: '0' }}>
                <strong>Data:</strong> {format(new Date(anamnese.data_atendimento), 'dd/MM/yyyy')}
              </p>
            </div>
          </div>

          <h3
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#2a5a3b',
              borderBottom: '1px solid #ccc',
              paddingBottom: '5px',
            }}
          >
            Anamnese Integrativa (Checklist results)
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '10px' }}>
            <strong>Queixa principal / Histórico:</strong> {anamnese.motivo_consulta}
          </p>
          <p style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '10px' }}>
            <strong>Sintomas Identificados:</strong>{' '}
            {anamnese.sintomas_principais || 'Nenhum sintoma marcado.'}
          </p>
          <p style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '25px' }}>
            <strong>Órgãos/Sistemas Relacionados:</strong>{' '}
            {anamnese.orgaos_afetados || 'Nenhum órgão marcado.'}
          </p>

          <h3
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#2a5a3b',
              borderBottom: '1px solid #ccc',
              paddingBottom: '5px',
            }}
          >
            Sugestões Terapêuticas
          </h3>
          {anamnese.status === 'pending' ? (
            <div className="flex items-center text-gray-500 mb-6 py-4">
              <Loader2 className="w-5 h-5 mr-2 animate-spin text-primary" />
              <span>Processando sugestões... A IA está analisando os dados.</span>
            </div>
          ) : anamnese.status === 'error' ? (
            <div className="text-red-500 mb-6 py-4">
              <p>Erro ao gerar sugestões. Por favor, edite a anamnese ou gere novamente.</p>
            </div>
          ) : (
            <div
              className="content-html"
              dangerouslySetInnerHTML={{
                __html: anamnese.ia_sugestoes_terapeuticas || '<p>Nenhuma sugestão gerada.</p>',
              }}
              style={{ fontSize: '14px', marginBottom: '25px' }}
            />
          )}

          <h3
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#2a5a3b',
              borderBottom: '1px solid #ccc',
              paddingBottom: '5px',
            }}
          >
            Suplementação
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
            <div
              className="content-html"
              dangerouslySetInnerHTML={{
                __html: anamnese.ia_suplementacao || '<p>Nenhum protocolo gerado.</p>',
              }}
              style={{ fontSize: '14px', marginBottom: '25px' }}
            />
          )}

          {anamnese.ia_referencias && (
            <>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  color: '#2a5a3b',
                  borderBottom: '1px solid #ccc',
                  paddingBottom: '5px',
                }}
              >
                Referências
              </h3>
              <div
                className="content-html"
                dangerouslySetInnerHTML={{ __html: anamnese.ia_referencias }}
                style={{ fontSize: '12px', color: '#555' }}
              />
            </>
          )}

          <p
            style={{
              textAlign: 'center',
              marginTop: '50px',
              fontSize: '11px',
              color: '#999',
              borderTop: '1px solid #eee',
              paddingTop: '15px',
            }}
          >
            Relatório gerado automaticamente por IA para suporte clínico.
            <br />
            Jailton Naturopata - Terapia Integrativa
          </p>
        </div>
      </div>
    </div>
  )
}
