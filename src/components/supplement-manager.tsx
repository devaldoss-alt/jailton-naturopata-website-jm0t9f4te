import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Search } from 'lucide-react'
import type { SelectedSupplement } from '@/services/report-suplementos'
import type { Product } from '@/services/products'

interface SupplementManagerProps {
  supplements: SelectedSupplement[]
  products: Product[]
  isEditing: boolean
  onAdd: (product: Product) => void
  onRemove: (index: number) => void
  onPosologyChange: (index: number, posology: string) => void
}

export function SupplementManager({
  supplements,
  products,
  isEditing,
  onAdd,
  onRemove,
  onPosologyChange,
}: SupplementManagerProps) {
  const [search, setSearch] = useState('')

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      !supplements.some((s) => s.product === p.id),
  )

  if (!isEditing && supplements.length === 0) return null

  return (
    <div>
      {isEditing && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto para adicionar..."
              className="pl-9"
            />
          </div>
          {search && filteredProducts.length > 0 && (
            <div className="mt-2 border rounded-md shadow-sm max-h-48 overflow-y-auto bg-white">
              {filteredProducts.slice(0, 10).map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    onAdd(product)
                    setSearch('')
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-0"
                >
                  <span className="font-medium">{product.name}</span>
                  <span className="text-sm text-gray-500 ml-2">({product.type || 'outro'})</span>
                </button>
              ))}
            </div>
          )}
          {search && filteredProducts.length === 0 && (
            <p className="mt-2 text-sm text-gray-400">Nenhum produto encontrado.</p>
          )}
        </div>
      )}

      <div className="space-y-3">
        {supplements.map((sup, index) => (
          <div
            key={sup.id || index}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-md border border-gray-200"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm">{sup.productName}</p>
              {sup.productType && (
                <p className="text-xs text-gray-500 capitalize">{sup.productType}</p>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <Input
                  value={sup.posology}
                  onChange={(e) => onPosologyChange(index, e.target.value)}
                  placeholder="Ex: 30 gotas, 3 vezes ao dia"
                  className="h-9"
                />
              ) : (
                <p className="text-sm text-gray-700">{sup.posology}</p>
              )}
            </div>
            {isEditing && (
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => onRemove(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {isEditing && supplements.length === 0 && (
        <p className="text-sm text-gray-400 italic">Nenhum produto selecionado.</p>
      )}
    </div>
  )
}
