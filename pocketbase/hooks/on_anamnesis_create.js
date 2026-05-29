onRecordAfterCreateSuccess((e) => {
  const record = e.record
  if (record.getString('status') !== 'pending') return e.next()

  const aiUrl = $secrets.get('USER_AI_URL')
  const aiKey = $secrets.get('USER_AI_KEY')

  const updatedRecord = $app.findRecordById('anamnesis', record.id)

  if (!aiKey || !aiUrl) {
    updatedRecord.set('status', 'error')
    updatedRecord.set(
      'erro_detalhado',
      'Configuração ausente: Chave de API ou URL do Gateway de IA não configurados.',
    )
    $app.saveNoValidate(updatedRecord)
    return e.next()
  }

  updatedRecord.set('erro_detalhado', '')

  const nomePaciente = record.getString('nome_paciente') || 'Paciente'
  const motivo = record.getString('motivo_consulta') || 'Não informado'
  const sintomasPrincipais =
    record.getString('sintomas_principais') || 'Nenhum sintoma principal detalhado'
  const orgaosAfetados = record.getString('orgaos_afetados') || 'Nenhum'

  const orgaosSintomas = []
  if (record.getBool('sintomas_figado')) orgaosSintomas.push('Fígado')
  if (record.getBool('sintomas_coracao')) orgaosSintomas.push('Coração')
  if (record.getBool('sintomas_baco')) orgaosSintomas.push('Baço')
  if (record.getBool('sintomas_pulmao')) orgaosSintomas.push('Pulmão')
  if (record.getBool('sintomas_rins')) orgaosSintomas.push('Rins')

  const orgaosSintomasStr =
    orgaosSintomas.length > 0 ? orgaosSintomas.join(', ') : 'Nenhum órgão específico marcado'

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
Motivo da consulta: ${motivo}

ESTILO DE VIDA E HÁBITOS:
Qualidade do Sono: ${qualidadeSono || 'N/I'}
Ingestão de Água: ${ingestaoAgua || 'N/I'}
Hábitos Alimentares: ${habitosAlimentares || 'N/I'}

HISTÓRICO CLÍNICO E FAMILIAR:
Histórico Familiar: ${historicoFamiliar || 'N/I'}
Medicamentos em uso: ${medicamentosEmUso || 'N/I'}
Observações Gerais: ${observacoesGerais || 'N/I'}

SINTOMAS E DESEQUILÍBRIOS (ÓRGÃOS):
Sintomas Principais Relatados: ${sintomasPrincipais}
Órgãos Afetados Detalhados: ${orgaosAfetados}
Órgãos com Sintomas Assinalados (Desequilíbrio): ${orgaosSintomasStr}

INSTRUÇÕES ESTRITAS E PERSONALIZADAS:
- Elabore um diagnóstico naturopático e um plano de tratamento profissional, altamente personalizado, detalhado e sistemático.
- MODO IMPERATIVO OBRIGATÓRIO: Você DEVE usar instruções diretas no modo imperativo e linguagem profissional direta nas seções de sugestões e suplementação. NUNCA use expressões em primeira pessoa como "Eu sugiro", "Eu proponho", "Eu recomendo" ou frases como "Você deve evitar". Use imperativo direto.
  * Exemplo Incorreto: "Eu sugiro que você realize..." -> Correto: "Realize o consumo..."
  * Exemplo Incorreto: "Eu recomendo que você implemente..." -> Correto: "Implemente a rotina..."
  * Exemplo Incorreto: "Você deve evitar..." -> Correto: "Evite..."
- OBRIGATÓRIO: Aborde ESPECIFICAMENTE os sintomas, órgãos e patógenos marcados como presentes pelo paciente. Se órgãos específicos como ${orgaosSintomasStr} estiverem assinalados, o protocolo DEVE focar na desintoxicação/suporte destes órgãos.
- PROTOCOLOS OBRIGATÓRIOS (PRIORIZE ESTAS AVALIAÇÕES E TRATAMENTOS):
  * Disfunção Adrenal / Fadiga Crônica: Cromoterapia (Laranja-lombar/Azul-frontal), Florais (Olive, Oak, Elm), Homeopatia (Phosphoric acid, Kali phosphoricum).
  * Disbiose Intestinal: Cromoterapia (Verde-abdome/Amarelo-plexo), Florais (Crab Apple, Walnut), Homeopatia (Nux vomica, Lycopodium), Detox Iônico (Prog 12, Prog 4).
  * Processo Parasitário: Cromoterapia (Azul-abdome/Verde-abdome), Florais (Crab Apple, Centaury), Homeopatia (Cina, Spigelia), Detox Iônico (Prog 9, Prog 6).
  * Somatização Emocional: Cromoterapia (Verde-peito/Azul-garganta), Florais (Star of Bethlehem, Rock Rose, Agrimony), Homeopatia (Ignatia, Staphysagria), NeuroSpa (7.83 Hz, 0.5 Hz).
  * Permeabilidade Intestinal (Leaky Gut): Cromoterapia (Verde-abdome/Amarelo-plexo), Florais (Crab Apple, Hornbeam), Homeopatia (Arsenicum album, China), Detox Iônico (Prog 12, Prog 7).
  * Neuroinflamação: Cromoterapia (Índigo-frontal/Azul-cervical), Florais (White Chestnut, Cherry Plum), Homeopatia (Belladonna, Gelsemium), NeuroSpa (10 Hz, 1 Hz).
  * Desregulação Hormonal: Cromoterapia (Laranja-pélvica/Índigo-tireoide), Florais (Scleranthus, Walnut), Homeopatia (Sepia, Thyroidinum), NeuroSpa (7.83 Hz, 4 Hz).
  * Sobrecarga Tóxica: Cromoterapia (Violeta-fígado/Verde-abdome), Florais (Crab Apple, Hornbeam), Homeopatia (Chelidonium, Phosphorus), Hidrovitalis (Prog 1, 2, 5).
- Correlacione as informações e justifique suas escolhas terapêuticas baseadas no quadro real do paciente (ex: motivo da consulta: ${motivo}).

Retorne um JSON estrito com as seguintes chaves (forneça dados detalhados em linguagem profissional e imperativa direta, formatado em HTML limpo usando <ul>, <li>, <p>, <strong>, <br>):
- "ia_diagnostico": Diagnóstico naturopático profundo, explicando as correlações sistêmicas dos sintomas, estilo de vida e órgãos afetados, usando linguagem profissional para o paciente.
- "ia_sugestoes_terapeuticas": Passo a passo claro e estruturado, direcionado para as queixas mapeadas. Fale diretamente com o paciente usando o modo imperativo estrito.
- "ia_suplementacao": Protocolo de suplementação/fitoterapia/desparasitação (nome, dosagem, horário e finalidade). Modo imperativo estrito.
- "ia_referencias": Referências ou embasamento científico naturopático correlacionando os sintomas ao protocolo sugerido.`

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
      timeout: 60,
    })

    if (res.statusCode === 200) {
      const data = res.json
      const contentStr = data?.choices?.[0]?.message?.content
      if (contentStr) {
        const content = JSON.parse(contentStr)
        updatedRecord.set('ia_diagnostico', content.ia_diagnostico || '')
        updatedRecord.set('ia_sugestoes_terapeuticas', content.ia_sugestoes_terapeuticas || '')
        updatedRecord.set('ia_suplementacao', content.ia_suplementacao || '')
        updatedRecord.set('ia_referencias', content.ia_referencias || '')
        updatedRecord.set('status', 'completed')
        updatedRecord.set('erro_detalhado', '')
      } else {
        $app.logger().error('AI Empty Response', 'status', res.statusCode)
        updatedRecord.set('status', 'error')
        updatedRecord.set('erro_detalhado', 'Resposta vazia ou inválida da IA.')
      }
    } else {
      let bodyStr = ''
      if (res.json) {
        bodyStr = JSON.stringify(res.json)
      } else if (res.body) {
        try {
          bodyStr = new TextDecoder().decode(res.body)
        } catch (decodeErr) {
          bodyStr = 'Falha ao decodificar corpo da resposta'
        }
      }

      let errorMsg = `Erro HTTP ${res.statusCode}`
      if (res.statusCode === 401) errorMsg = 'Não autorizado: Chave de API inválida.'
      if (res.statusCode === 429) errorMsg = 'Muitas requisições: Limite de cota excedido.'

      if (res.json && res.json.error && res.json.error.message) {
        errorMsg += ` - ${res.json.error.message}`
      }

      $app.logger().error('AI Error', 'status', res.statusCode, 'body', bodyStr)
      updatedRecord.set('status', 'error')
      updatedRecord.set('erro_detalhado', `${errorMsg} | Detalhes: ${bodyStr}`.substring(0, 1000))
    }
  } catch (err) {
    $app.logger().error('AI Request Failed', 'error', err.message)
    updatedRecord.set('status', 'error')
    updatedRecord.set('erro_detalhado', `Erro de comunicação: ${err.message}`)
  }

  $app.saveNoValidate(updatedRecord)
  e.next()
}, 'anamnesis')
