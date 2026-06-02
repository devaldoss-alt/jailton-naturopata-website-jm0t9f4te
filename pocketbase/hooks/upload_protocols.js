routerAdd(
  'POST',
  '/backend/v1/upload-protocols',
  (e) => {
    try {
      const files = e.findUploadedFiles('file')
      if (!files || files.length === 0) {
        return e.badRequestError('Arquivo não fornecido ou vazio')
      }

      const file = files[0]

      // Store the file permanently in pocketbase to be able to fetch its content via URL
      const protocolsCol = $app.findCollectionByNameOrId('protocols')
      const record = new Record(protocolsCol)
      record.set('file', file)
      $app.save(record)

      // Compute the public URL for the newly stored document
      const fileUrl =
        'https://' +
        e.request.host +
        '/api/files/' +
        protocolsCol.id +
        '/' +
        record.id +
        '/' +
        record.getString('file')

      // Agent memory functionality removed to comply with plan limits
      return e.json(200, { success: true, fileUrl })
    } catch (err) {
      $app.logger().error('Upload protocol error', 'error', err.message)
      return e.badRequestError('Falha ao processar arquivo: ' + err.message)
    }
  },
  $apis.requireAuth(),
)
