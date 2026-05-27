migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('anamnesis')
    col.fields.add(new TextField({ name: 'cpf' }))
    col.fields.add(new TextField({ name: 'rg' }))
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('anamnesis')
    col.fields.removeByName('cpf')
    col.fields.removeByName('rg')
    app.save(col)
  },
)
