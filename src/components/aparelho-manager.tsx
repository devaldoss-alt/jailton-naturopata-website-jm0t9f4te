import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Trash2, Search } from 'lucide-react'
import type { SelectedAparelho } from '@/services/report-aparelhos'
import type { Aparelho } from '@/services/aparelhos'

interface AparelhoManagerProps {
  selectedAparelhos: SelectedAparelho[]
  allAparelhos: Aparelho[]
  isEditing: boolean
  onAdd: (aparelho: Aparelho) => void
  onRemove: (aparelhoId: string) => void
  onComoUsarChange: (aparelhoId: string, comoUsar: string) => void
}

export function AparelhoManager({
  selectedAparelhos,
  allAparelhos,
  isEditing,
  onAdd,
  onRemove,
  onComoUsarChange,
}: AparelhoManagerProps) {
  const [search, setSearch] = useState('')

  const filteredAparelhos = allAparelhos.filter(
    (a) =>
      a.nome.toLowerCase().includes(search.toLowerCase()) &&
      !selectedAparelhos.some((s) => s.aparelho === a.id),
  )

  if (!isEditing && selectedAparelhos.length === 0) return null

  return (
    <div>
      {isEditing && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar aparelho para adicionar..."
              className="pl-9"
            />
          </div>
          {search && filteredAparelhos.length > 0 && (
            <div className="mt-2 border rounded-md shadow-sm max-h-48 overflow-y-auto bg-white">
              {filteredAparelhos.slice(0, 10).map((aparelho) => (
                <button
                  key={aparelho.id}
                  type="button"
                  onClick={() => {
                    onAdd(aparelho)
                    setSearch('')
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-0"
                >
                  <span className="font-medium">{aparelho.nome}</span>
                  <span className="text-sm text-gray-500 ml-2">({aparelho.funcao})</span>
                </button>
              ))}
            </div>
          )}
          {search && filteredAparelhos.length === 0 && (
            <p className="mt-2 text-sm text-gray-400">Nenhum aparelho encontrado.</p>
          )}
        </div>
      )}

      <div className="space-y-3">
        {selectedAparelhos.map((ap) => (
          <div key={ap.aparelho} className="p-3 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{ap.aparelhoName}</p>
              </div>
              {isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => onRemove(ap.aparelho)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            {ap.aparelhoFuncao && (
              <p className="text-xs text-gray-600 mt-2">
                <strong>Função:</strong> {ap.aparelhoFuncao}
              </p>
            )}
            {ap.aparelhoBeneficios && (
              <p className="text-xs text-gray-600 mt-1">
                <strong>Benefícios:</strong> {ap.aparelhoBeneficios}
              </p>
            )}
            {isEditing ? (
              <div className="mt-2">
                <Label className="text-xs font-semibold text-gray-700">Como Usar</Label>
                <Textarea
                  value={ap.como_usar || ''}
                  onChange={(e) => onComoUsarChange(ap.aparelho, e.target.value)}
                  placeholder="Instruções de uso personalizadas para este paciente..."
                  className="mt-1 text-sm"
                  rows={2}
                />
              </div>
            ) : (
              ap.como_usar && (
                <div className="mt-2 text-xs text-gray-600">
                  <strong>Como Usar:</strong> {ap.como_usar}
                </div>
              )
            )}
          </div>
        ))}
      </div>

      {isEditing && selectedAparelhos.length === 0 && (
        <p className="text-sm text-gray-400 italic">Nenhum aparelho selecionado.</p>
      )}
    </div>
  )
}
