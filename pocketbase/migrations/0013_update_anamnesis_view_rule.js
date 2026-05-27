migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('anamnesis')
    collection.viewRule = ''
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('anamnesis')
    collection.viewRule = "@request.auth.id != '' && user_id = @request.auth.id"
    app.save(collection)
  },
)
