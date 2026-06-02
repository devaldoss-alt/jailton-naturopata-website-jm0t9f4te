import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import pb from '@/lib/pocketbase/client'
import { getErrorMessage } from '@/lib/pocketbase/errors'

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
      const formData = new FormData()
      formData.append('file', file)

      await pb.send('/backend/v1/upload-protocols', {
        method: 'POST',
        body: formData,
      })

      toast.success('Protocolo enviado com sucesso!')
      reset()
    } catch (err: unknown) {
      const msg = getErrorMessage(err)
      toast.error(msg || 'Erro ao enviar arquivo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Upload de Protocolos</CardTitle>
        <CardDescription>
          Envie arquivos nos formatos suportados para armazenar na base de protocolos.
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
            {loading ? 'Enviando...' : 'Enviar Protocolo'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
