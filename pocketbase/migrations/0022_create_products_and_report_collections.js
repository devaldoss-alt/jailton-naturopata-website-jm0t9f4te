migrate(
  (app) => {
    const products = new Collection({
      name: 'products',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'type', type: 'select', values: ['cápsula', 'líquido', 'outro'], maxSelect: 1 },
        { name: 'description', type: 'editor' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_products_name ON products (name)'],
    })
    app.save(products)

    const anamnesisCol = app.findCollectionByNameOrId('anamnesis')
    if (!anamnesisCol.fields.getByName('suplementacao_outras_recomendacoes')) {
      anamnesisCol.fields.add(
        new EditorField({
          name: 'suplementacao_outras_recomendacoes',
          required: false,
          maxSize: 0,
          convertURLs: false,
        }),
      )
    }
    if (!anamnesisCol.fields.getByName('version_reason')) {
      anamnesisCol.fields.add(new TextField({ name: 'version_reason' }))
    }
    app.save(anamnesisCol)

    const productsCol = app.findCollectionByNameOrId('products')
    const reportSuplementos = new Collection({
      name: 'report_suplementos',
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
          name: 'product',
          type: 'relation',
          required: true,
          collectionId: productsCol.id,
          maxSelect: 1,
        },
        { name: 'posology', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_report_suplementos_anamnesis ON report_suplementos (anamnesis)'],
    })
    app.save(reportSuplementos)

    const reportRevisions = new Collection({
      name: 'report_revisions',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'anamnesis',
          type: 'relation',
          required: true,
          collectionId: anamnesisCol.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'version_number', type: 'number', required: true, onlyInt: true },
        { name: 'snapshot', type: 'text', required: true },
        { name: 'reason', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_report_revisions_anamnesis ON report_revisions (anamnesis, version_number)',
      ],
    })
    app.save(reportRevisions)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('report_revisions'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('report_suplementos'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('products'))
    } catch (_) {}
    const anamnesisCol = app.findCollectionByNameOrId('anamnesis')
    try {
      anamnesisCol.fields.removeByName('suplementacao_outras_recomendacoes')
    } catch (_) {}
    try {
      anamnesisCol.fields.removeByName('version_reason')
    } catch (_) {}
    app.save(anamnesisCol)
  },
)
