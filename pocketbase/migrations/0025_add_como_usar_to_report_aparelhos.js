migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('report_aparelhos')

    if (!col.fields.getByName('como_usar')) {
      col.fields.add(new TextField({ name: 'como_usar', required: false }))
    }

    app.save(col)
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('report_aparelhos')
      if (col.fields.getByName('como_usar')) {
        col.fields.removeByName('como_usar')
      }
      app.save(col)
    } catch (_) {}
  },
)
