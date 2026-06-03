import { useEffect, useState } from 'react'
import {
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
  type Testimonial,
} from '@/services/testimonials'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'

export default function Depoimentos() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [editName, setEditName] = useState('')
  const [editMessage, setEditMessage] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const loadData = async () => {
    try {
      const data = await getAllTestimonials()
      setTestimonials(data)
    } catch (error) {
      toast.error('Erro ao carregar depoimentos: ' + getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('testimonials', () => {
    loadData()
  })

  const handleToggleApprove = async (testimonial: Testimonial) => {
    try {
      await updateTestimonial(testimonial.id, { approved: !testimonial.approved })
      toast.success(testimonial.approved ? 'Depoimento reprovado.' : 'Depoimento aprovado.')
    } catch (error) {
      toast.error('Erro ao atualizar status: ' + getErrorMessage(error))
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este depoimento?')) return
    try {
      await deleteTestimonial(id)
      toast.success('Depoimento excluído com sucesso.')
    } catch (error) {
      toast.error('Erro ao excluir: ' + getErrorMessage(error))
    }
  }

  const openEdit = (testimonial: Testimonial) => {
    setEditingItem(testimonial)
    setEditName(testimonial.name)
    setEditMessage(testimonial.message)
    setIsDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingItem) return
    try {
      await updateTestimonial(editingItem.id, { name: editName, message: editMessage })
      toast.success('Depoimento atualizado com sucesso.')
      setIsDialogOpen(false)
      setEditingItem(null)
    } catch (error) {
      toast.error('Erro ao salvar: ' + getErrorMessage(error))
    }
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Depoimentos</h1>
          <p className="text-gray-500">Gerencie os depoimentos dos pacientes</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Paciente</th>
                <th className="px-6 py-4 font-medium">Mensagem</th>
                <th className="px-6 py-4 font-medium text-center">Aprovação</th>
                <th className="px-6 py-4 font-medium">Data</th>
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
              ) : testimonials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhum depoimento encontrado.
                  </td>
                </tr>
              ) : (
                testimonials.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-md truncate">{item.message}</td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant={item.approved ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleApprove(item)}
                        className={
                          item.approved
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'text-gray-500'
                        }
                      >
                        {item.approved ? (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-2" />
                        )}
                        {item.approved ? 'Aprovado' : 'Pendente'}
                      </Button>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {format(new Date(item.created), 'dd/MM/yyyy')}
                    </td>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Depoimento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Paciente</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mensagem</label>
              <textarea
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
