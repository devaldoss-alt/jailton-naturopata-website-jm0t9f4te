onRecordAfterUpdateSuccess((e) => {
  try {
    const record = e.record
    const anamnesisId = record.id

    if (record.getString('status') !== 'completed') {
      return e.next()
    }

    const existing = $app.findRecordsByFilter(
      'report_revisions',
      `anamnesis = "${anamnesisId}"`,
      '-version_number',
      100,
      0,
    )

    const nextVersion = existing.length > 0 ? existing[0].getInt('version_number') + 1 : 1

    const sups = $app.findRecordsByFilter(
      'report_suplementos',
      `anamnesis = "${anamnesisId}"`,
      'created',
      100,
      0,
    )

    const suplementosList = sups.map((s) => ({
      product: s.getString('product'),
      posology: s.getString('posology'),
    }))

    const snapshotData = {
      ia_diagnostico: record.getString('ia_diagnostico'),
      ia_sugestoes_terapeuticas: record.getString('ia_sugestoes_terapeuticas'),
      ia_suplementacao: record.getString('ia_suplementacao'),
      ia_aparelhos: record.getString('ia_aparelhos'),
      ia_referencias: record.getString('ia_referencias'),
      suplementacao_outras_recomendacoes: record.getString('suplementacao_outras_recomendacoes'),
      suplementos: suplementosList,
    }

    const col = $app.findCollectionByNameOrId('report_revisions')
    const rev = new Record(col)
    rev.set('anamnesis', anamnesisId)
    rev.set('version_number', nextVersion)
    rev.set('snapshot', JSON.stringify(snapshotData))
    rev.set('reason', record.getString('version_reason') || '')
    $app.save(rev)

    const allRevs = $app.findRecordsByFilter(
      'report_revisions',
      `anamnesis = "${anamnesisId}"`,
      'version_number',
      100,
      0,
    )

    if (allRevs.length > 20) {
      const deleteCount = allRevs.length - 20
      for (let i = 0; i < deleteCount; i++) {
        $app.delete(allRevs[i])
      }
    }
  } catch (err) {
    $app.logger().error('Error creating revision', 'error', err.message)
  }

  return e.next()
}, 'anamnesis')
