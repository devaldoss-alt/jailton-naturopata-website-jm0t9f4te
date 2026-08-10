migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('report_suplementos')

    if (!col.fields.getByName('product_name')) {
      col.fields.add(new TextField({ name: 'product_name', required: false }))
    }

    const productField = col.fields.getByName('product')
    if (productField) {
      productField.required = false
    }

    col.addIndex('idx_report_suplementos_product', false, 'product', '')

    app.save(col)

    const records = app.findRecordsByFilter('report_suplementos', "id != ''", '', 10000, 0)
    for (const record of records) {
      const productId = record.getString('product')
      if (productId && !record.getString('product_name')) {
        try {
          const product = app.findRecordById('products', productId)
          record.set('product_name', product.getString('name'))
          app.saveNoValidate(record)
        } catch (_) {}
      }
    }
  },
  (app) => {
    const col = app.findCollectionByNameOrId('report_suplementos')
    try {
      col.removeIndex('idx_report_suplementos_product')
    } catch (_) {}
    try {
      col.fields.removeByName('product_name')
    } catch (_) {}
    const productField = col.fields.getByName('product')
    if (productField) {
      productField.required = true
    }
    app.save(col)
  },
)
