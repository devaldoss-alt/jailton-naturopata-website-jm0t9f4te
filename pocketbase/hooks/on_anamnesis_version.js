onRecordUpdate((e) => {
  const record = e.record
  const original = record.original()

  const newStatus = record.getString('status')
  if (newStatus !== 'completed') {
    e.next()
    return
  }

  const reason = record.getString('version_reason') || ''
  record.set('version_reason', '')

  var trackedFields = [
    'ia_diagnostico',
    'ia_sugestoes_terapeuticas',
    'ia_suplementacao',
    'ia_aparelhos',
    'ia_referencias',
    'suplementacao_outras_recomendacoes',
  ]

  var snapshot = {}
  trackedFields.forEach(function (f) {
    snapshot[f] = record.getString(f)
  })

  try {
    var suplementos = $app.findRecordsByFilter(
      'report_suplementos',
      'anamnesis = {:anamId}',
      'created',
      100,
      0,
      { anamId: record.id },
    )
    snapshot.suplementos = suplementos.map(function (s) {
      return {
        product: s.getString('product'),
        posology: s.getString('posology'),
      }
    })
  } catch (err) {
    snapshot.suplementos = []
  }

  var maxVersion = 0
  try {
    var revisions = $app.findRecordsByFilter(
      'report_revisions',
      'anamnesis = {:anamId}',
      '-version_number',
      1,
      0,
      { anamId: record.id },
    )
    if (revisions.length > 0) {
      maxVersion = revisions[0].getInt('version_number')
    }
  } catch (err) {
    $app.logger().error('Version hook: failed to query revisions', 'error', err.message)
  }

  try {
    var revCol = $app.findCollectionByNameOrId('report_revisions')
    var revRecord = new Record(revCol)
    revRecord.set('anamnesis', record.id)
    revRecord.set('version_number', maxVersion + 1)
    revRecord.set('snapshot', JSON.stringify(snapshot))
    revRecord.set('reason', reason)
    $app.saveNoValidate(revRecord)

    var allRevisions = $app.findRecordsByFilter(
      'report_revisions',
      'anamnesis = {:anamId}',
      '-version_number',
      100,
      0,
      { anamId: record.id },
    )
    if (allRevisions.length > 20) {
      for (var i = 20; i < allRevisions.length; i++) {
        $app.delete(allRevisions[i])
      }
    }
  } catch (err) {
    $app.logger().error('Version hook: failed to create revision', 'error', err.message)
  }

  e.next()
}, 'anamnesis')
