onRecordAfterCreateSuccess((e) => {
  const record = e.record
  if (record.getString('status') !== 'pending') return e.next()

  const aiUrl = $secrets.get('SKIP_AI_GATEWAY_URL')
  const aiKey = $secrets.get('SKIP_AI_GATEWAY_API_KEY')

  const updatedRecord = $app.findRecordById('anamnesis', record.id)

  const orgaosAfetados = []
  if (record.getBool('sintomas_figado')) orgaosAfetados.push('Fígado')
  if (record.getBool('sintomas_coracao')) orgaosAfetados.push('Coração')
  if (record.getBool('sintomas_baco')) orgaosAfetados.push('Baço/Pâncreas')
  if (record.getBool('sintomas_pulmao')) orgaosAfetados.push('Pulmão')
  if (record.getBool('sintomas_rins')) orgaosAfetados.push('Rins')
  const textOrgaosCheckbox = orgaosAfetados.length > 0 ? orgaosAfetados.join(', ') : 'Nenhum'

  const nomePaciente = record.getString('nome_paciente') || 'Paciente'
  const sintomasPrincipais = record.getString('sintomas_principais') || 'sintomas inespecíficos'

  if (!aiKey || !aiUrl) {
    updatedRecord.set(
      'ia_sugestoes_terapeuticas',
      `<ul><li><strong>Passo 1: Ajuste do Ciclo Circadiano para ${nomePaciente}</strong><br>Para auxiliar no manejo de sintomas como ${sintomasPrincipais}, recomendamos exposição solar de 15 minutos pela manhã para regulação de cortisol e melatonina.</li><li><strong>Passo 2: Dieta Anti-inflamatória e Suporte aos Órgãos (${textOrgaosCheckbox})</strong><br>Foco na saúde intestinal, priorizando alimentos integrais, ricos em fibras e ômega-3. Evitar alimentos ultraprocessados, açúcar refinado e laticínios inflamatórios.</li><li><strong>Passo 3: Gestão do Estresse</strong><br>Prática diária de meditação ou respiração profunda por 10 minutos.</li></ul>`,
    )
    updatedRecord.set(
      'ia_suplementacao',
      `<ul><li><strong>Magnésio Inositol (500mg) - Recomendação para ${nomePaciente}:</strong> Tomar 1 dose à noite, 30 minutos antes de dormir, para relaxamento.</li><li><strong>Probiótico (10 cepas, 10 bilhões UFC):</strong> Tomar 1 cápsula pela manhã, em jejum, para modulação da microbiota intestinal.</li><li><strong>Ômega 3 (DHA/EPA alto):</strong> 1 cápsula após o almoço, para ação sistêmica anti-inflamatória.</li></ul>`,
    )
    updatedRecord.set(
      'ia_referencias',
      '<ul><li>Protocolo Integrativo de Modulação Intestinal e Manejo do Estresse (Green Life Biofísica).</li><li>Literatura científica baseada em naturopatia e medicina funcional aplicadas à individualidade bioquímica.</li></ul>',
    )
    updatedRecord.set('status', 'completed')
    $app.saveNoValidate(updatedRecord)
    return e.next()
  }

  const prompt = `Atue como um especialista em Naturopatia e Saúde Integrativa.
Analise a seguinte anamnese:
Paciente: ${nomePaciente}
Tipo de Atendimento: ${record.getString('tipo_atendimento') || 'consulta'}
Motivo da consulta / Histórico: ${record.getString('motivo_consulta')}
Sintomas Relatados: ${sintomasPrincipais}
Sistemas/Órgãos Afetados Identificados: ${record.getString('orgaos_afetados') || 'Não informados'}
Desequilíbrios em Órgãos (Checklist): ${textOrgaosCheckbox}

Por favor, elabore um plano de tratamento profissional, altamente detalhado e sistemático passo a passo, seguindo os princípios da Naturopatia e Biofísica.
Retorne um JSON estrito com as seguintes chaves (forneça dados detalhados em linguagem profissional e amigável, formatado em HTML limpo usando <ul>, <li>, <p>, <strong>, <br>):
- "ia_sugestoes_terapeuticas": Deve conter um passo a passo claro e estruturado (ex: "Passo 1:", "Passo 2:", etc.), mencionando o nome do paciente e seus sintomas específicos para personalizar o atendimento (ex: "Passo 1: Ajuste do Ciclo Circadiano para ${nomePaciente} para auxiliar no manejo de sintomas como a ansiedade e insônia..."). Inclua mudanças de estilo de vida, dieta anti-inflamatória e terapias.
- "ia_suplementacao": Deve conter um protocolo de suplementação robusto e sistemático. Para CADA suplemento, especifique claramente: nome, dosagem exata (ex: 500mg, 10 bilhões UFC), horário ideal de uso, e instruções claras do propósito (ex: "Tomar 1 cápsula à noite, 30 minutos antes de dormir, para relaxamento").
- "ia_referencias": Referências ou embasamento científico naturopático que suporte o protocolo.`

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
