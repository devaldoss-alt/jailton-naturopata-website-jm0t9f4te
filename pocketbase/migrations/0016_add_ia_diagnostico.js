migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('anamnesis')
    col.fields.add(new EditorField({ name: 'ia_diagnostico' }))
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('anamnesis')
    col.fields.removeByName('ia_diagnostico')
    app.save(col)
  },
)
