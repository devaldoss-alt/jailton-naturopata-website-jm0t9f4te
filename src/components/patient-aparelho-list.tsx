import type { SelectedAparelho } from '@/services/report-aparelhos'

interface PatientAparelhoListProps {
  aparelhos: SelectedAparelho[]
}

export function PatientAparelhoList({ aparelhos }: PatientAparelhoListProps) {
  if (!aparelhos || aparelhos.length === 0) {
    return <p style={{ fontSize: '14px', color: '#718096' }}>Nenhum aparelho recomendado.</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {aparelhos.map((item, index) => (
        <div
          key={item.id || index}
          style={{
            backgroundColor: '#f4f7f5',
            padding: '15px 20px',
            borderRadius: '8px',
            border: '1px solid #e2e8e4',
          }}
        >
          <p
            style={{
              margin: '0 0 5px',
              fontSize: '15px',
              fontWeight: 'bold',
              color: '#1a4025',
            }}
          >
            {item.aparelhoName}
          </p>
          {item.aparelhoFuncao && (
            <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#111' }}>
              <strong>Função:</strong> {item.aparelhoFuncao}
            </p>
          )}
          {item.aparelhoBeneficios && (
            <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#111' }}>
              <strong>Benefícios:</strong> {item.aparelhoBeneficios}
            </p>
          )}
          {item.aparelhoComoUsar && (
            <div style={{ margin: '5px 0', fontSize: '14px', color: '#111' }}>
              <strong>Como Usar:</strong>{' '}
              <div
                className="content-html"
                dangerouslySetInnerHTML={{ __html: item.aparelhoComoUsar }}
              />
            </div>
          )}
          {item.aparelhoContraindicacoes && (
            <div style={{ margin: '5px 0', fontSize: '14px', color: '#111' }}>
              <strong>Contraindicações:</strong>{' '}
              <div
                className="content-html"
                dangerouslySetInnerHTML={{ __html: item.aparelhoContraindicacoes }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
