import { useEffect, useState } from 'react'
import {
  getAparelhos,
  createAparelho,
  updateAparelho,
  deleteAparelho,
  type Aparelho,
} from '@/services/aparelhos'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ContentEditor } from '@/components/content-editor'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'

export default function Aparelhos() {
  const [aparelhos, setAparelhos] = useState<Aparelho[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formNome, setFormNome] = useState('')
  const [formFuncao, setFormFuncao] = useState('')
  const [formBeneficios, setFormBeneficios] = useState('')
  const [formOrder, setFormOrder] = useState(0)
  const [formContraindicacoes, setFormContraindicacoes] = useState('')
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    try {
      const data = await getAparelhos()
      setAparelhos(data)
    } catch (error) {
      toast.error('Erro ao carregar aparelhos: ' + getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('aparelhos', () => {
    loadData()
  })

  const filtered = aparelhos.filter(
    (a) =>
      a.nome.toLowerCase().includes(search.toLowerCase()) ||
      a.funcao.toLowerCase().includes(search.toLowerCase()),
  )

  const openCreate = () => {
    setEditingId(null)
    setFormNome('')
    setFormFuncao('')
    setFormBeneficios('')
    setFormOrder(0)
    setFormContraindicacoes('')
    setIsDialogOpen(true)
  }

  const openEdit = (item: Aparelho) => {
    setEditingId(item.id)
    setFormNome(item.nome)
    setFormFuncao(item.funcao)
    setFormBeneficios(item.beneficios)
    setFormOrder(item.order ?? 0)
    setFormContraindicacoes(item.contraindicacoes || '')
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formNome.trim() || !formFuncao.trim() || !formBeneficios.trim()) {
      toast.error('Nome, Função e Benefícios são obrigatórios.')
      return
    }
    setSaving(true)
    try {
      const data = {
        nome: formNome,
        funcao: formFuncao,
        beneficios: formBeneficios,
        order: formOrder,
        contraindicacoes: formContraindicacoes,
      }
      if (editingId) {
        await updateAparelho(editingId, data)
        toast.success('Aparelho atualizado!')
      } else {
        await createAparelho(data)
        toast.success('Aparelho criado!')
      }
      setIsDialogOpen(false)
    } catch (error) {
      toast.error('Erro ao salvar: ' + getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este aparelho?')) return
    try {
      await deleteAparelho(id)
      toast.success('Aparelho excluído.')
    } catch (error) {
      toast.error('Erro ao excluir: ' + getErrorMessage(error))
    }
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Aparelhos</h1>
          <p className="text-gray-500">Catálogo de aparelhos recomendados</p>
        </div>
        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Novo Aparelho
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou função..."
          className="pl-9"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Ordem</th>
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">Função</th>
                <th className="px-6 py-4 font-medium">Benefícios</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhum aparelho encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-gray-600 font-medium">{item.order ?? 0}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.nome}</td>
                    <td className="px-6 py-4 text-gray-600">{item.funcao}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{item.beneficios}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Aparelho' : 'Novo Aparelho'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="aparelho-nome">Nome *</Label>
                <Input
                  id="aparelho-nome"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  placeholder="Ex: Biofeedback Quantum"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aparelho-order">Ordem</Label>
                <Input
                  id="aparelho-order"
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="aparelho-funcao">Função *</Label>
              <Input
                id="aparelho-funcao"
                value={formFuncao}
                onChange={(e) => setFormFuncao(e.target.value)}
                placeholder="Ex: Equilíbrio energético"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aparelho-beneficios">Benefícios *</Label>
              <Textarea
                id="aparelho-beneficios"
                value={formBeneficios}
                onChange={(e) => setFormBeneficios(e.target.value)}
                placeholder="Descreva os benefícios do aparelho"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Contraindicações</Label>
              <ContentEditor
                value={formContraindicacoes}
                onChange={setFormContraindicacoes}
                isEditing={true}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary hover:bg-primary/90"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
