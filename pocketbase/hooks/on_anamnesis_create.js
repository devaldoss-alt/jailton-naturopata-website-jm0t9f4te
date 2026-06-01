onRecordAfterCreateSuccess((e) => {
  const record = e.record
  if (record.getString('status') !== 'pending') return e.next()

  const updatedRecord = $app.findRecordById('anamnesis', record.id)

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

  const prompt = `Analise a seguinte anamnese detalhada do paciente:
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
- Elabore um diagnóstico naturopático, um plano de tratamento, suplementação e orientação de aparelhos altamente personalizado baseado nos seus protocolos e base de conhecimento.
- MODO IMPERATIVO OBRIGATÓRIO: Você DEVE usar instruções diretas no modo imperativo e linguagem profissional nas seções de sugestões, suplementação e aparelhos. NUNCA use expressões em primeira pessoa como "Eu sugiro".
- OBRIGATÓRIO: Aborde ESPECIFICAMENTE os sintomas, órgãos e patógenos mapeados.
- Correlacione as informações e justifique suas escolhas terapêuticas baseadas no quadro real do paciente.

Retorne APENAS um JSON estrito com as seguintes chaves (forneça dados detalhados em linguagem profissional e imperativa direta, formatado em HTML limpo usando <ul>, <li>, <p>, <strong>, <br>):
- "ia_diagnostico": Diagnóstico naturopático profundo, explicando as correlações sistêmicas dos sintomas e órgãos afetados.
- "ia_sugestoes_terapeuticas": Passo a passo claro e estruturado de tratamento, direcionado para as queixas mapeadas.
- "ia_suplementacao": Protocolo de suplementação, fitoterapia e/ou desparasitação (nome, dosagem, horário e finalidade).
- "ia_aparelhos": Orientação de equipamentos terapêuticos e aparelhos a serem utilizados, especificando frequências, programas e posições.
- "ia_referencias": Referências ou embasamento científico correlacionando os sintomas ao protocolo sugerido.
NÃO RETORNE MAIS NADA ALÉM DO JSON VÁLIDO.`

  const systemPrompt = `Você é um assistente clínico especialista em Naturopatia, Biofísica e Saúde Integrativa. Você DEVE encontrar correlações com órgãos afetados, nutrientes e aparelhos terapêuticos.

Use seu conhecimento indicando as melhores recomendações e protocolos. DEVE usar o modo imperativo direto nas instruções.

Retorne ESTRITAMENTE um JSON com as seguintes chaves (use HTML limpo: <ul>, <li>, <p>, <strong>, <br>):
- ia_diagnostico
- ia_sugestoes_terapeuticas
- ia_suplementacao
- ia_aparelhos
- ia_referencias

NÃO forneça textos adicionais fora do JSON.`

  try {
    const result = $ai.chat({
      model: 'fast',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    })

    let contentStr = result.choices[0].message.content.trim()
    if (contentStr.startsWith('```json')) {
      contentStr = contentStr
        .replace(/^```json\n?/, '')
        .replace(/\n?```$/, '')
        .trim()
    } else if (contentStr.startsWith('```')) {
      contentStr = contentStr
        .replace(/^```\n?/, '')
        .replace(/\n?```$/, '')
        .trim()
    }

    const content = JSON.parse(contentStr)

    updatedRecord.set('ia_diagnostico', content.ia_diagnostico || '')
    updatedRecord.set('ia_sugestoes_terapeuticas', content.ia_sugestoes_terapeuticas || '')
    updatedRecord.set('ia_suplementacao', content.ia_suplementacao || '')
    updatedRecord.set('ia_aparelhos', content.ia_aparelhos || '')
    updatedRecord.set('ia_referencias', content.ia_referencias || '')
    updatedRecord.set('status', 'completed')
    updatedRecord.set('erro_detalhado', '')
  } catch (err) {
    let errorMsg = err.message
    if (err instanceof SyntaxError) {
      errorMsg = 'A IA não retornou um JSON válido.'
    }
    $app.logger().error('AI Request Failed', 'error', err.message)
    updatedRecord.set('status', 'error')
    updatedRecord.set('erro_detalhado', `Erro no agente de IA: ${errorMsg}`.substring(0, 1000))
  }

  $app.saveNoValidate(updatedRecord)
  e.next()
}, 'anamnesis')
