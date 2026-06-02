// @deps xlsx@0.18.5, pdf-parse@1.1.1, mammoth@1.6.0, buffer@6.0.3
routerAdd(
  'POST',
  '/backend/v1/upload-protocols',
  async (e) => {
    const body = e.requestInfo().body || {}
    const filename = body.filename || ''
    const b64 = body.content || ''

    if (!filename || !b64) {
      return e.badRequestError('Arquivo não fornecido')
    }

    let buf
    try {
      const { Buffer } = require('buffer')
      buf = Buffer.from(b64, 'base64')
    } catch (err) {
      return e.internalServerError('Falha interna ao carregar buffer do arquivo')
    }

    const ext = filename.split('.').pop().toLowerCase()
    let text = ''

    try {
      if (ext === 'xlsx') {
        const xlsx = require('xlsx')
        const workbook = xlsx.read(buf, { type: 'buffer' })
        workbook.SheetNames.forEach((sheetName) => {
          text += `\n--- Aba: ${sheetName} ---\n`
          const sheet = workbook.Sheets[sheetName]
          text += xlsx.utils.sheet_to_csv(sheet)
        })
      } else if (ext === 'pdf') {
        const pdfParse = require('pdf-parse')
        const data = await pdfParse(buf)
        text = data.text
      } else if (ext === 'doc' || ext === 'docx') {
        const mammoth = require('mammoth')
        const data = await mammoth.extractRawText({ buffer: buf })
        text = data.value
      } else {
        return e.badRequestError('Formato não suportado')
      }

      if (!text || !text.trim()) {
        return e.badRequestError('O arquivo está vazio ou não pôde ser lido.')
      }

      const slug = 'especialista-naturopata'

      $ai.agents.putMemories($app, slug, [
        { type: 'text', payload: { text: `Fonte: ${filename}\n\n${text}` } },
      ])

      return e.json(200, { success: true })
    } catch (err) {
      $app.logger().error('Upload protocol error', 'error', err.message)
      if (err.message && err.message.includes('not found')) {
        return e.badRequestError(
          `Agente ${slug} não encontrado. Certifique-se de que a migração foi aplicada.`,
        )
      }
      return e.badRequestError('Falha ao processar arquivo: ' + err.message)
    }
  },
  $apis.requireAuth(),
)
