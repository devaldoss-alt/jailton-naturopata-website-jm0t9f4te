routerAdd(
  'POST',
  '/backend/v1/anamnesis/{id}/retry',
  (e) => {
    const id = e.request.pathValue('id')
    try {
      const record = $app.findRecordById('anamnesis', id)
      if (record.getString('user_id') !== e.auth?.id) {
        return e.forbiddenError('Não autorizado')
      }
      record.set('status', 'pending')
      $app.save(record)
      return e.json(200, { success: true })
    } catch (err) {
      return e.internalServerError(err.message)
    }
  },
  $apis.requireAuth(),
)
