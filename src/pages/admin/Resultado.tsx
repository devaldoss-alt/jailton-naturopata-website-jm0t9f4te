import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAnamnese } from '@/services/anamnesis'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ArrowLeft, Printer } from 'lucide-react'

export default function Resultado() {
  const { id } = useParams()
  const [anamnese, setAnamnese] = useState<any>(null)

  useEffect(() => {
    if (id) {
      getAnamnese(id).then(setAnamnese).catch(console.error)
    }
  }, [id])

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
          body {
            background-color: white !important;
          }
          body * {
            visibility: hidden;
          }
          #printable-pdf, #printable-pdf * {
            visibility: visible;
          }
          #printable-pdf {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
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
          }}
        >
          <h2
            style={{
              textAlign: 'center',
              marginBottom: '40px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111',
            }}
          >
            Relatório de Anamnese Integrativa
          </h2>

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#222' }}>
            Dados do Paciente
          </h3>
          <p style={{ marginBottom: '6px' }}>
            <strong>Nome:</strong> {anamnese.nome_paciente}
          </p>
          <p style={{ marginBottom: '6px' }}>
            <strong>Data do Atendimento:</strong>{' '}
            {format(new Date(anamnese.data_atendimento), 'dd/MM/yyyy')}
          </p>
          <p style={{ marginBottom: '6px', lineHeight: '1.5' }}>
            <strong>Motivo da Consulta:</strong> {anamnese.motivo_consulta}
          </p>

          <hr style={{ margin: '30px 0', borderTop: '1px solid #ddd' }} />

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#222' }}>
            Sintomas Principais
          </h3>
          <p style={{ lineHeight: '1.5', color: '#333' }}>{anamnese.sintomas_principais}</p>

          <h3
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginTop: '25px',
              marginBottom: '12px',
              color: '#222',
            }}
          >
            Órgãos/Sistemas Relacionados
          </h3>
          <p style={{ lineHeight: '1.5', color: '#333' }}>{anamnese.orgaos_afetados}</p>

          <hr style={{ margin: '30px 0', borderTop: '1px solid #ddd' }} />

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#222' }}>
            Sugestões Terapêuticas
          </h3>
          <div
            className="content-html"
            dangerouslySetInnerHTML={{ __html: anamnese.ia_sugestoes_terapeuticas }}
            style={{ color: '#333' }}
          />

          <h3
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginTop: '25px',
              marginBottom: '12px',
              color: '#222',
            }}
          >
            Protocolo de Suplementação
          </h3>
          <div
            className="content-html"
            dangerouslySetInnerHTML={{ __html: anamnese.ia_suplementacao }}
            style={{ color: '#333' }}
          />

          <hr style={{ margin: '30px 0', borderTop: '1px solid #ddd' }} />

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#222' }}>
            Referências
          </h3>
          <div
            className="content-html"
            dangerouslySetInnerHTML={{ __html: anamnese.ia_referencias }}
            style={{ fontSize: '14px', color: '#555' }}
          />

          <p style={{ textAlign: 'center', marginTop: '60px', fontSize: '12px', color: '#888' }}>
            Relatório gerado automaticamente por IA com base nas respostas coletadas.
          </p>
        </div>
      </div>
    </div>
  )
}
