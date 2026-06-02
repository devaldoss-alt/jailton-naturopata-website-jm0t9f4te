routerAdd(
  'POST',
  '/backend/v1/upload-protocols',
  (e) => {
    const body = e.requestInfo().body || {}
    const filename = body.filename || ''
    const textContent = body.text || ''

    if (!textContent || !filename) {
      return e.badRequestError('O arquivo selecionado não contém conteúdo ou está ausente.')
    }

    const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase()
    const supported = ['.txt', '.csv', '.md']
    if (!supported.includes(ext)) {
      return e.badRequestError('Formato não suportado. Use arquivos .txt, .csv ou .md.')
    }

    if (!textContent.trim()) {
      return e.badRequestError('O arquivo não contém texto legível ou está vazio.')
    }

    try {
      $ai.agents.putMemories($app, 'naturopata-expert', [
        {
          type: 'text',
          payload: { text: `--- Documento: ${filename} ---\n${textContent.substring(0, 80000)}` },
        },
      ])

      return e.json(200, { success: true, message: 'Protocolo processado e injetado com sucesso.' })
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('not found')) {
        return e.badRequestError('Agente naturopata-expert não encontrado.')
      }
      return e.badRequestError('Falha ao processar arquivo: ' + msg)
    }
  },
  $apis.requireAuth(),
)
