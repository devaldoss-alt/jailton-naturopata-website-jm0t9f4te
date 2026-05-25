onRecordAfterCreateSuccess((e) => {
  const record = e.record
  if (record.getString('status') !== 'pending') return e.next()

  const aiUrl = $secrets.get('SKIP_AI_GATEWAY_URL')
  const aiKey = $secrets.get('SKIP_AI_GATEWAY_API_KEY')

  const updatedRecord = $app.findRecordById('anamnesis', record.id)

  if (!aiKey || !aiUrl) {
    updatedRecord.set(
      'ia_sugestoes_terapeuticas',
      '<ul><li>Ajuste do ciclo circadiano. (Mock)</li><li>Dieta anti-inflamatória focada na saúde intestinal. (Mock)</li></ul>',
    )
    updatedRecord.set(
      'ia_suplementacao',
      '<ul><li>Magnésio Inositol: 1 dose à noite. (Mock)</li><li>Probiótico de 10 cepas pela manhã. (Mock)</li></ul>',
    )
    updatedRecord.set(
      'ia_referencias',
      '<ul><li>Protocolo Integrativo de Fadiga Adrenal. (Mock)</li></ul>',
    )
    updatedRecord.set('status', 'completed')
    $app.saveNoValidate(updatedRecord)
    return e.next()
  }

  const prompt = `Atue como um especialista em Naturopatia e Saúde Integrativa.
Analise a seguinte anamnese:
Paciente: ${record.getString('nome_paciente')}
Tipo de Atendimento: ${record.getString('tipo_atendimento') || 'consulta'}
Motivo da consulta / Histórico: ${record.getString('motivo_consulta')}
Sintomas Relatados: ${record.getString('sintomas_principais') || 'Não informados'}
Órgãos Afetados Identificados: ${record.getString('orgaos_afetados') || 'Não informados'}

Retorne um JSON estrito com as seguintes chaves (forneça dados detalhados em linguagem profissional e amigável em HTML com tags <ul> e <li>):
- "ia_sugestoes_terapeuticas"
- "ia_suplementacao"
- "ia_referencias"`

  try {
    const res = $http.send({
      url: aiUrl + '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + aiKey,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      }),
      timeout: 45,
    })

    if (res.statusCode === 200) {
      const data = res.json
      const content = JSON.parse(data.choices[0].message.content)
      updatedRecord.set('ia_sugestoes_terapeuticas', content.ia_sugestoes_terapeuticas || '')
      updatedRecord.set('ia_suplementacao', content.ia_suplementacao || '')
      updatedRecord.set('ia_referencias', content.ia_referencias || '')
      updatedRecord.set('status', 'completed')
    } else {
      $app
        .logger()
        .error(
          'AI Error',
          'status',
          res.statusCode,
          'body',
          res.body ? new TextDecoder().decode(res.body) : '',
        )
      updatedRecord.set('status', 'error')
    }
  } catch (err) {
    $app.logger().error('AI Request Failed', 'error', err.message)
    updatedRecord.set('status', 'error')
  }

  $app.saveNoValidate(updatedRecord)
  e.next()
}, 'anamnesis')
