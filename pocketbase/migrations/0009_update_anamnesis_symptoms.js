migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('anamnesis')
    col.fields.add(new BoolField({ name: 'sintomas_figado' }))
    col.fields.add(new BoolField({ name: 'sintomas_coracao' }))
    col.fields.add(new BoolField({ name: 'sintomas_baco' }))
    col.fields.add(new BoolField({ name: 'sintomas_pulmao' }))
    col.fields.add(new BoolField({ name: 'sintomas_rins' }))
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('anamnesis')
    col.fields.removeByName('sintomas_figado')
    col.fields.removeByName('sintomas_coracao')
    col.fields.removeByName('sintomas_baco')
    col.fields.removeByName('sintomas_pulmao')
    col.fields.removeByName('sintomas_rins')
    app.save(col)
  },
)
