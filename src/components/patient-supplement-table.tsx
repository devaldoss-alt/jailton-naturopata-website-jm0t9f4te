import type { SelectedSupplement } from '@/services/report-suplementos'

interface PatientSupplementTableProps {
  supplements: SelectedSupplement[]
}

export function PatientSupplementTable({ supplements }: PatientSupplementTableProps) {
  if (!supplements || supplements.length === 0) return null

  return (
    <table className="w-full border-collapse mb-6" style={{ fontSize: '14px' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #1a4025' }}>
          <th
            style={{
              textAlign: 'left',
              padding: '10px 15px',
              color: '#1a4025',
              fontSize: '14px',
            }}
          >
            Produto
          </th>
          <th
            style={{
              textAlign: 'left',
              padding: '10px 15px',
              color: '#1a4025',
              fontSize: '14px',
            }}
          >
            Posologia
          </th>
        </tr>
      </thead>
      <tbody>
        {supplements.map((sup, index) => (
          <tr key={sup.id || index} style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td style={{ padding: '10px 15px', color: '#111' }}>{sup.productName}</td>
            <td style={{ padding: '10px 15px', color: '#111' }}>{sup.posology || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
