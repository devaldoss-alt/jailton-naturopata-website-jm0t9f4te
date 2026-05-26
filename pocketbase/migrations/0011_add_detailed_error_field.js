migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('anamnesis')
    col.fields.add(new TextField({ name: 'erro_detalhado' }))
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('anamnesis')
    col.fields.removeByName('erro_detalhado')
    app.save(col)
  },
)
