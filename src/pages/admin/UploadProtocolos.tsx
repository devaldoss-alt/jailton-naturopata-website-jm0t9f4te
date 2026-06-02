import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import pb from '@/lib/pocketbase/client'

const schema = z.object({
  file: z
    .any()
    .refine((files) => files?.length === 1, 'Selecione um arquivo.')
    .refine((files) => {
      const file = files?.[0]
      if (!file) return false
      const ext = file.name.split('.').pop()?.toLowerCase()
      return ['xlsx', 'pdf', 'doc', 'docx'].includes(ext || '')
    }, 'Formato inválido. Use .xlsx, .pdf, .doc ou .docx'),
})

export default function UploadProtocolos() {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const file = data.file[0]
      const reader = new FileReader()

      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1]

          await pb.send('/backend/v1/upload-protocols', {
            method: 'POST',
            body: JSON.stringify({
              filename: file.name,
              content: base64,
            }),
            headers: { 'Content-Type': 'application/json' },
          })

          toast.success('Protocolo adicionado à memória do agente com sucesso!')
          reset()
        } catch (err: any) {
          toast.error(err.message || 'Erro ao enviar arquivo para a IA')
        } finally {
          setLoading(false)
        }
      }

      reader.onerror = () => {
        toast.error('Erro ao processar o arquivo localmente')
        setLoading(false)
      }

      reader.readAsDataURL(file)
    } catch (error: any) {
      toast.error(error.message || 'Erro inesperado')
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Upload de Protocolos</CardTitle>
        <CardDescription>
          Envie documentos para atualizar a base de conhecimento do agente de IA.
          <br />
          Formatos suportados: .xlsx, .pdf, .doc, .docx
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input type="file" accept=".xlsx, .pdf, .doc, .docx" {...register('file')} />
            {errors.file && (
              <p className="text-red-500 text-sm mt-1">{errors.file.message as string}</p>
            )}
          </div>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? 'Processando Ingestão...' : 'Atualizar Base de Conhecimento'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
