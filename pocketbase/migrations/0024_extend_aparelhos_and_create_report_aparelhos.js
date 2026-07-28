migrate(
  (app) => {
    const aparelhosCol = app.findCollectionByNameOrId('aparelhos')

    if (!aparelhosCol.fields.getByName('order')) {
      aparelhosCol.fields.add(
        new NumberField({ name: 'order', required: false, min: 0, onlyInt: true }),
      )
    }
    if (!aparelhosCol.fields.getByName('como_usar')) {
      aparelhosCol.fields.add(
        new EditorField({ name: 'como_usar', required: false, maxSize: 0, convertURLs: false }),
      )
    }
    if (!aparelhosCol.fields.getByName('contraindicacoes')) {
      aparelhosCol.fields.add(
        new EditorField({
          name: 'contraindicacoes',
          required: false,
          maxSize: 0,
          convertURLs: false,
        }),
      )
    }

    aparelhosCol.addIndex('idx_aparelhos_order', false, 'order', '')
    app.save(aparelhosCol)

    const anamnesisCol = app.findCollectionByNameOrId('anamnesis')

    const reportAparelhos = new Collection({
      name: 'report_aparelhos',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'anamnesis',
          type: 'relation',
          required: true,
          collectionId: anamnesisCol.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'aparelho',
          type: 'relation',
          required: true,
          collectionId: aparelhosCol.id,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_report_aparelhos_anamnesis ON report_aparelhos (anamnesis)',
        'CREATE INDEX idx_report_aparelhos_aparelho ON report_aparelhos (aparelho)',
      ],
    })
    app.save(reportAparelhos)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('report_aparelhos'))
    } catch (_) {}

    try {
      const col = app.findCollectionByNameOrId('aparelhos')
      col.removeIndex('idx_aparelhos_order')
      try {
        col.fields.removeByName('order')
      } catch (_) {}
      try {
        col.fields.removeByName('como_usar')
      } catch (_) {}
      try {
        col.fields.removeByName('contraindicacoes')
      } catch (_) {}
      app.save(col)
    } catch (_) {}
  },
)
