onRecordDelete((e) => {
  const productId = e.record.id
  const productName = e.record.getString('name')

  try {
    const reports = $app.findRecordsByFilter(
      'report_suplementos',
      'product = "' + productId + '"',
      '',
      10000,
      0,
    )

    for (const report of reports) {
      report.set('product_name', productName)
      report.set('product', '')
      $app.saveNoValidate(report)
    }
  } catch (err) {
    $app
      .logger()
      .error('Failed to unlink product references', 'error', String(err), 'productId', productId)
  }

  e.next()
}, 'products')
