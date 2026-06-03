migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('testimonials')
    collection.updateRule = "@request.auth.id != ''"
    collection.deleteRule = "@request.auth.id != ''"
    collection.listRule = "approved = true || @request.auth.id != ''"
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('testimonials')
    collection.updateRule = null
    collection.deleteRule = null
    collection.listRule = 'approved = true'
    app.save(collection)
  },
)
