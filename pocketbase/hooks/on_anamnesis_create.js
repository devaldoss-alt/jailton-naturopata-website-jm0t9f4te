onRecordCreateRequest((e) => {
  const body = e.requestInfo().body || {}
  if (!body.motivo_consulta) return e.next()

  if (e.auth) {
    body.user_id = e.auth.id
  }

  const aiUrl = $secrets.get('SKIP_AI_GATEWAY_URL')
  const aiKey = $secrets.get('SKIP_AI_GATEWAY_API_KEY')

  if (!aiKey || !aiUrl) {
    body.sintomas_principais = 'Fadiga crônica, dores de cabeça, má digestão (Mock).'
    body.orgaos_afetados = 'Fígado, Glândulas Suprarrenais, Intestino (Mock).'
    body.ia_sugestoes_terapeuticas =
      '<ul><li>Ajuste do ciclo circadiano.</li><li>Dieta anti-inflamatória focada na saúde intestinal.</li></ul>'
    body.ia_suplementacao =
      '<ul><li>Magnésio Inositol: 1 dose à noite.</li><li>Probiótico de 10 cepas pela manhã.</li></ul>'
    body.ia_referencias = '<ul><li>Protocolo Integrativo de Fadiga Adrenal.</li></ul>'
    body.status = 'completed'
    return e.next()
  }

  const prompt = `Atue como um especialista em Naturopatia e Saúde Integrativa.
Analise a seguinte anamnese:
Paciente: ${body.nome_paciente}
Motivo da consulta / Histórico: ${body.motivo_consulta}

Retorne um JSON estrito com as seguintes chaves (forneça dados detalhados em linguagem profissional e amigável):
- "sintomas_principais" (string - resumo dos sintomas)
- "orgaos_afetados" (string - órgãos e sistemas possivelmente afetados)
- "ia_sugestoes_terapeuticas" (texto em HTML estruturado com <ul> e <li>)
- "ia_suplementacao" (texto em HTML estruturado com <ul> e <li>)
- "ia_referencias" (texto em HTML estruturado ou texto simples)`

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
      body.sintomas_principais = content.sintomas_principais || ''
      body.orgaos_afetados = content.orgaos_afetados || ''
      body.ia_sugestoes_terapeuticas = content.ia_sugestoes_terapeuticas || ''
      body.ia_suplementacao = content.ia_suplementacao || ''
      body.ia_referencias = content.ia_referencias || ''
      body.status = 'completed'
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
      body.status = 'error'
    }
  } catch (err) {
    $app.logger().error('AI Request Failed', 'error', err.message)
    body.status = 'error'
  }

  e.next()
}, 'anamnesis')
