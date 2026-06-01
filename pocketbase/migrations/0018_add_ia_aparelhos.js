/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('anamnesis')
    if (!col.fields.getByName('ia_aparelhos')) {
      col.fields.add(
        new EditorField({
          name: 'ia_aparelhos',
          required: false,
          presentable: false,
          hidden: false,
          maxSize: 0,
          convertURLs: false,
        }),
      )
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('anamnesis')
    if (col.fields.getByName('ia_aparelhos')) {
      col.fields.removeByName('ia_aparelhos')
      app.save(col)
    }
  },
)
