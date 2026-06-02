import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import pb from '@/lib/pocketbase/client'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { Upload, FileSpreadsheet, Loader2, File, FileText } from 'lucide-react'

export default function UploadProtocolos() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const supportedExts = ['.txt', '.csv', '.md']

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0]
      const ext = selected.name.slice(selected.name.lastIndexOf('.')).toLowerCase()
      if (supportedExts.includes(ext)) {
        setFile(selected)
      } else {
        setFile(null)
        toast.error('Formato não suportado. Use arquivos .txt, .csv ou .md.')
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    try {
      const textContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve(e.target?.result as string)
        }
        reader.onerror = reject
        reader.readAsText(file)
      })

      await pb.send('/backend/v1/upload-protocols', {
        method: 'POST',
        body: JSON.stringify({ text: textContent, filename: file.name }),
        headers: { 'Content-Type': 'application/json' },
      })

      toast.success('Protocolo enviado e injetado com sucesso!')
      setFile(null)
      const fileInput = document.getElementById('protocol-upload') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (err: unknown) {
      console.error(err)
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = () => {
    if (!file) return <Upload className="w-8 h-8 text-primary" />
    const name = file.name.toLowerCase()
    if (name.endsWith('.csv')) return <FileSpreadsheet className="w-8 h-8 text-primary" />
    return <FileText className="w-8 h-8 text-primary" />
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Upload de Protocolos</h1>
        <p className="text-muted-foreground mt-2">
          Faça o upload de textos e protocolos técnicos para alimentar a base de conhecimento do
          agente especialista.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload de Documento</CardTitle>
          <CardDescription>
            Envie arquivos nos formatos .txt, .csv ou .md para atualizar as referências da IA.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 bg-gray-50/50 transition-colors hover:bg-gray-50">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              {getFileIcon()}
            </div>

            <Input
              id="protocol-upload"
              type="file"
              accept=".txt,.csv,.md"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="protocol-upload"
              className="cursor-pointer bg-white border shadow-sm hover:bg-gray-50 font-medium text-sm px-4 py-2 rounded-md transition-colors"
            >
              Selecionar arquivo
            </label>

            {file && (
              <p className="mt-4 text-sm font-medium text-primary flex items-center gap-2">
                {file.name}
              </p>
            )}
            {!file && (
              <p className="mt-4 text-xs text-muted-foreground text-center">
                Suportado: .txt, .csv e .md.
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={!file || loading} className="min-w-[150px]">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload de Arquivo
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
