/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    // 1. Create protocols collection to store uploaded documents
    try {
      app.findCollectionByNameOrId('protocols')
    } catch (_) {
      const protocols = new Collection({
        name: 'protocols',
        type: 'base',
        listRule: '',
        viewRule: '',
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'file', type: 'file', required: true, maxSelect: 1, maxSize: 5242880 },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      })
      app.save(protocols)
    }
  },
  (app) => {
    try {
      const protocols = app.findCollectionByNameOrId('protocols')
      app.delete(protocols)
    } catch (_) {}
  },
)
