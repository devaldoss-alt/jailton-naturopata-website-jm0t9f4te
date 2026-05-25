onRecordAfterCreateSuccess((e) => {
  const record = e.record
  if (record.getString('status') !== 'pending') return e.next()

  const aiUrl = $secrets.get('SKIP_AI_GATEWAY_URL')
  const aiKey = $secrets.get('SKIP_AI_GATEWAY_API_KEY')

  const updatedRecord = $app.findRecordById('anamnesis', record.id)

  const nomePaciente = record.getString('nome_paciente') || 'Paciente'

  const getTrueFields = (fieldsMap) => {
    return Object.entries(fieldsMap)
      .filter(([k, label]) => record.getBool(k))
      .map(([k, label]) => label)
      .join(', ')
  }

  const historicoMap = {
    hiv_status: 'HIV Positivo',
    hipertenso: 'Hipertenso',
    hipotenso: 'Hipotenso',
    atividade_fisica: 'Pratica Atividade Física',
    marcapasso: 'Usa Marcapasso',
    alergia: 'Tem Alergia',
    histerectomia: 'Removeu Útero/Histerectomia',
    animais_casa: 'Tem animais em casa',
    renite: 'Renite',
    platina: 'Tem Platina',
    tireoide_removida: 'Removeu Tireóide',
    arritmia: 'Arritmia Cardíaca',
    cancer: 'Histórico Oncológico/Câncer',
    vesicula_removida: 'Removeu a Vesícula',
    bebida_alcoolica: 'Toma Bebida Alcoólica',
    amalgama_preta: 'Dentes obturados com amálgamas preta',
  }

  const sintomasMap = {
    pressao_alta: 'Pressão alta (Rins)',
    urina_espumosa: 'Urina sai espumosa (Rins)',
    dores_nuca: 'Sente dores na nuca (Rins)',
    tremores_maos: 'Sente tremores nas mãos (Rins)',
    gosto_metalico: 'Sente um gosto metálico na boca (Rins)',
    asma: 'Tem asma (Pulmão)',
    pele_ressecada: 'Pele ressecada (Pulmão)',
    tristeza: 'Sensação de tristeza (Pulmão)',
    gripes_frequentes: 'Gripes frequentes (Pulmão)',
    refluxo: 'Sente refluxo (Baço)',
    cansaco_fraqueza: 'Cansaço/Fraqueza (Baço)',
    fadiga_palidez: 'Fadiga/Palidez (Baço)',
    dores_costela: 'Dores do lado esquerdo embaixo da última costela (Baço)',
    removeu_utero_baco: 'Removeu Útero (Baço)',
    dores_corpo: 'Dores constantes pelo corpo (Iodo)',
    excesso_gases: 'Excesso de gases (Iodo)',
    maos_pes_gelados: 'Mão e pés gelados (Iodo)',
    mucosa_fezes: 'Presença de mucosa nas fezes (Iodo)',
    visao_turva: 'Visão Turva (Fígado)',
    barriga_inchada: 'Barriga inchada (Fígado)',
    fezes_esbranquicadas: 'Fezes Esbranquiçadas (Fígado)',
    manchas_pele: 'Aparece mancha na pele (Fígado)',
    urina_escura: 'Urina sai escura (Fígado)',
    dor_cabeca: 'Dores de cabeça (Pressão arterial)',
    enxaqueca: 'Enxaquecas (Pressão arterial)',
    pressao_nuca_art: 'Pressão na nuca (Pressão arterial)',
    tontura: 'Tontura (Pressão arterial)',
    zumbido: 'Zumbido no ouvido (Pressão arterial)',
  }

  const patogenosMap = {
    gases_candida: 'Gases e dores abdominais (Cândida, Giárdia, Strongilóide)',
    cansaco_ascaris: 'Cansaço Extremo (Áscaris Lumbricóide, Toxoplasma, Giárdia)',
    dores_cabeca_toxoplasma: 'Dores de Cabeça (Toxoplasma, Tênia Solium)',
    acne_candida: 'Acne, Rosácea, Psoríase (Cândida Albicans, Giárdia)',
    nervoso_mental: 'Névoa Mental, falta de foco (Cândida Albicans, Toxoplasma Gondii)',
    diarreia_etamoeba: 'Diarréia e Dores Abdominais (Etamoeba Histolística, Giárdia Lambia)',
    constipacao_ascaris: 'Constipação (Áscaris Lumbricóide, Tênia)',
    inchaco_candida: 'Inchaço (Cândida Albicans, Giárdia)',
    falta_foco: 'Falta de Foco (Toxoplasma Gondii, Cândida Albicans)',
    insonia_toxoplasma: 'Insônia (Toxoplasma Gondii, Cândida Albicans)',
    ansiedade_toxoplasma: 'Ansiedade (Toxoplasma Gondii, Cândida Glabata)',
    irritabilidade_giardia: 'Irritabilidade (Giárdia, Strongilóides)',
    depressao_candida: 'Depressão (Cândida Glabata, Toxoplasma Gondii)',
    compulsao_doces: 'Compulsão por doces (Cândida Albicans, Giárdia Lambia)',
    dores_migram: 'Dores que migram (Strongilóides, Trichinella Spiralís)',
    resfriado_frequente: 'Resfriado freqüente (Áscaris Lumbricóides, Etamoeba Histólistica)',
    palpitacao_toxoplasma: 'Palpitação (Toxoplasma Gondii, Áscaris Lumbricóide)',
    ma_digestao_giardia: 'Má Digestão (Giárdia Lambia, Etamoeba Histolística)',
    azia_etamoeba: 'Azia / Má Digestão (Etamoeba Histolística, Giárdia Lambia)',
    coceira_corpo: 'Coceira pelo corpo todo / Acúmulo de toxinas',
  }

  const historicoContext = getTrueFields(historicoMap) || 'Sem histórico prévio relevante'
  const sintomasContext = getTrueFields(sintomasMap) || 'Nenhum sintoma sistêmico marcado'
  const patogenosContext = getTrueFields(patogenosMap) || 'Nenhum indicador de patógeno marcado'

  const remediosContinuos = record.getString('remedios_continuos')
  const remedioVerme = record.getString('remedio_verme_tempo')
  const motivo = record.getString('motivo_consulta')
  const peso = record.getFloat('peso')
  const altura = record.getFloat('altura')
  const habitoIntestinal = record.getString('habito_intestinal')
  const grauCansaco = record.getFloat('cansaco_grau')

  if (!aiKey || !aiUrl) {
    updatedRecord.set(
      'ia_sugestoes_terapeuticas',
      '<p>A IA não está configurada neste ambiente.</p>',
    )
    updatedRecord.set('ia_suplementacao', '<p>A IA não está configurada neste ambiente.</p>')
    updatedRecord.set('ia_referencias', '<p>A IA não está configurada neste ambiente.</p>')
    updatedRecord.set('status', 'completed')
    $app.saveNoValidate(updatedRecord)
    return e.next()
  }

  const prompt = `Atue como um especialista em Naturopatia, Biofísica e Saúde Integrativa.
Analise a seguinte anamnese detalhada do paciente:
Nome: ${nomePaciente}
Motivo da consulta: ${motivo}
Peso: ${peso || 'N/I'} kg, Altura: ${altura || 'N/I'} m
Hábito Intestinal: ${habitoIntestinal || 'N/I'}
Cansaço (0 a 10): ${grauCansaco || 'N/I'}
Remédio de verme (última vez): ${remedioVerme || 'N/I'}
Remédios contínuos: ${remediosContinuos || 'N/I'}

Histórico Médico e Hábitos: ${historicoContext}
Sintomas Físicos e Desequilíbrios de Órgãos: ${sintomasContext}
Indicadores Clínicos de Patógenos (Parasitas, Fungos, Bactérias): ${patogenosContext}

Por favor, elabore um plano de tratamento profissional, altamente personalizado, detalhado e sistemático passo a passo, seguindo os princípios da Naturopatia, Desparasitação e Biofísica.
Evite textos genéricos ou fictícios. Analise e correlacione as informações e sintomas reais marcados para sugerir protocolos terapêuticos factíveis.
Retorne um JSON estrito com as seguintes chaves (forneça dados detalhados em linguagem profissional e amigável, formatado em HTML limpo usando <ul>, <li>, <p>, <strong>, <br>):
- "ia_sugestoes_terapeuticas": Deve conter um passo a passo claro e estruturado (ex: "Passo 1:", "Passo 2:", etc.), direcionado especificamente para as queixas e patógenos suspeitos, incluindo mudanças de estilo de vida e terapias naturopáticas. Mencione o nome do paciente.
- "ia_suplementacao": Protocolo de suplementação/fitoterapia/desparasitação (nome, dosagem, horário e finalidade). Específico para as indicações (ex: se marcou candidíase, inclua antifúngicos naturais; se parasitas, vermífugos ou tinturas).
- "ia_referencias": Referências ou embasamento científico naturopático correlacionando os sintomas aos desequilíbrios apontados e ao protocolo sugerido.`

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
