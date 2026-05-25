routerAdd(
  'POST',
  '/backend/v1/anamnesis/{id}/retry',
  (e) => {
    const id = e.request.pathValue('id')
    const record = $app.findRecordById('anamnesis', id)

    if (record.getString('status') !== 'error') {
      return e.badRequestError('Apenas anamneses com erro podem ser processadas novamente.')
    }

    // Define temporariamente como pending para feedback no frontend
    record.set('status', 'pending')
    $app.saveNoValidate(record)

    const aiUrl = $secrets.get('SKIP_AI_GATEWAY_URL')
    const aiKey = $secrets.get('SKIP_AI_GATEWAY_API_KEY')

    if (!aiKey || !aiUrl) {
      record.set('status', 'error')
      $app.saveNoValidate(record)
      return e.internalServerError('A IA não está configurada no ambiente.')
    }

    const nomePaciente = record.getString('nome_paciente') || 'Paciente'
    const motivo = record.getString('motivo_consulta')
    const sintomasPrincipais = record.getString('sintomas_principais')
    const orgaosAfetados = record.getString('orgaos_afetados')

    const sintomasOrgaos = []
    if (record.getBool('sintomas_figado')) sintomasOrgaos.push('Fígado')
    if (record.getBool('sintomas_coracao')) sintomasOrgaos.push('Coração')
    if (record.getBool('sintomas_baco')) sintomasOrgaos.push('Baço')
    if (record.getBool('sintomas_pulmao')) sintomasOrgaos.push('Pulmão')
    if (record.getBool('sintomas_rins')) sintomasOrgaos.push('Rins')

    const sintomasContext =
      sintomasOrgaos.length > 0
        ? sintomasOrgaos.join(', ')
        : 'Nenhum sintoma de órgão específico marcado'

    const dataNascimento = record.getString('data_nascimento')
    const profissao = record.getString('profissao')
    const historicoFamiliar = record.getString('historico_familiar')
    const habitosAlimentares = record.getString('habitos_alimentares')
    const qualidadeSono = record.getString('qualidade_sono')
    const ingestaoAgua = record.getString('ingestao_agua')
    const medicamentosEmUso = record.getString('medicamentos_em_uso')
    const observacoesGerais = record.getString('observacoes_gerais')

    const prompt = `Atue como um especialista em Naturopatia, Biofísica e Saúde Integrativa.
Analise a seguinte anamnese detalhada do paciente:
Nome: ${nomePaciente}
Nascimento: ${dataNascimento || 'N/I'} | Profissão: ${profissao || 'N/I'}
Motivo da consulta / Queixa Principal: ${motivo}
Sintomas Principais: ${sintomasPrincipais || 'N/I'}
Órgãos Afetados: ${orgaosAfetados || 'N/I'}

ESTILO DE VIDA E HÁBITOS:
Qualidade do Sono: ${qualidadeSono || 'N/I'}
Ingestão de Água: ${ingestaoAgua || 'N/I'}
Hábitos Alimentares: ${habitosAlimentares || 'N/I'}

HISTÓRICO CLÍNICO E FAMILIAR:
Histórico Familiar: ${historicoFamiliar || 'N/I'}
Medicamentos em uso: ${medicamentosEmUso || 'N/I'}
Observações Gerais: ${observacoesGerais || 'N/I'}

SINTOMAS E DESEQUILÍBRIOS (ÓRGÃOS ESPECÍFICOS):
${sintomasContext}

INSTRUÇÕES ESTRITAS E PERSONALIZADAS:
- Elabore um plano de tratamento profissional, altamente personalizado, detalhado e sistemático passo a passo, seguindo os princípios da Naturopatia e Biofísica.
- OBRIGATÓRIO: Aborde ESPECIFICAMENTE os sintomas descritos, a queixa principal, os hábitos alimentares, o histórico familiar e os órgãos afetados marcados como presentes.
- EVITE COMPLETAMENTE conselhos genéricos e respostas enlatadas que não se relacionam com o quadro acima.
- Correlacione as informações e justifique suas escolhas terapêuticas baseadas no quadro real do paciente.

Retorne um JSON estrito com as seguintes chaves (forneça dados detalhados em linguagem profissional e amigável, formatado em HTML limpo usando <ul>, <li>, <p>, <strong>, <br>):
- "ia_sugestoes_terapeuticas": Deve conter um plano de ação e sugestões terapêuticas claro e estruturado (ex: "Passo 1: Desintoxicação", "Passo 2: Reparação do Terreno Biológico", etc.), direcionado ESPECIFICAMENTE para as queixas, sintomas dos órgãos e histórico, incluindo mudanças de estilo de vida e terapias naturopáticas adaptadas para a realidade do paciente. NÃO deixe este campo vazio.
- "ia_suplementacao": Protocolo de suplementação/fitoterapia (nome, dosagem, horário e finalidade). Extremamente focado nas necessidades individuais reveladas nos sintomas e queixas. NÃO deixe este campo vazio.
- "ia_referencias": Referências ou embasamento científico naturopático correlacionando os sintomas específicos aos desequilíbrios apontados e ao protocolo sugerido.`

    try {
      const res = $http.send({
        url: aiUrl + '/v1/chat/completions',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + aiKey },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        }),
        timeout: 120,
      })

      if (res.statusCode === 200) {
        const data = res.json
        const content = JSON.parse(data.choices[0].message.content)
        record.set(
          'ia_sugestoes_terapeuticas',
          content.ia_sugestoes_terapeuticas || '<p>Plano não gerado.</p>',
        )
        record.set('ia_suplementacao', content.ia_suplementacao || '<p>Protocolo não gerado.</p>')
        record.set('ia_referencias', content.ia_referencias || '<p>Referências não geradas.</p>')
        record.set('status', 'completed')
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
        record.set('status', 'error')
      }
    } catch (err) {
      $app.logger().error('AI Request Failed', 'error', err.message)
      record.set('status', 'error')
    }

    $app.saveNoValidate(record)

    if (record.getString('status') === 'error') {
      return e.internalServerError('Falha na geração após tentar novamente.')
    }

    return e.json(200, { message: 'Geração concluída com sucesso.' })
  },
  $apis.requireAuth(),
)
