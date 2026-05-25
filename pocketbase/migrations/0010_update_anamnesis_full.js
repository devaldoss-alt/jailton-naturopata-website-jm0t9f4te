migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('anamnesis')

    const addField = (f) => {
      if (!col.fields.getByName(f.name)) {
        col.fields.add(f)
      }
    }

    // Demographics
    addField(new TextField({ name: 'endereco' }))
    addField(new TextField({ name: 'telefone' }))
    addField(new TextField({ name: 'rg' }))
    addField(new TextField({ name: 'cpf' }))
    addField(new BoolField({ name: 'tem_filhos' }))
    addField(new NumberField({ name: 'peso' }))
    addField(new NumberField({ name: 'altura' }))
    addField(new TextField({ name: 'regiao_atendimento' }))

    // History
    addField(new BoolField({ name: 'hiv_status' }))
    addField(new BoolField({ name: 'hipertenso' }))
    addField(new BoolField({ name: 'hipotenso' }))
    addField(new BoolField({ name: 'atividade_fisica' }))
    addField(new BoolField({ name: 'marcapasso' }))
    addField(new BoolField({ name: 'alergia' }))
    addField(new BoolField({ name: 'histerectomia' }))
    addField(
      new SelectField({
        name: 'habito_intestinal',
        values: ['1', '2', '3', 'Mais de 3'],
        maxSelect: 1,
      }),
    )
    addField(new TextField({ name: 'remedio_verme_tempo' }))
    addField(new BoolField({ name: 'animais_casa' }))
    addField(new TextField({ name: 'remedios_continuos' }))

    // Misc Checkboxes
    addField(new BoolField({ name: 'renite' }))
    addField(new BoolField({ name: 'platina' }))
    addField(new BoolField({ name: 'tireoide_removida' }))
    addField(new BoolField({ name: 'arritmia' }))
    addField(new BoolField({ name: 'cancer' }))
    addField(new BoolField({ name: 'vesicula_removida' }))
    addField(new BoolField({ name: 'bebida_alcoolica' }))
    addField(new BoolField({ name: 'amalgama_preta' }))

    // Organs: Rins
    addField(new BoolField({ name: 'pressao_alta' }))
    addField(new BoolField({ name: 'urina_espumosa' }))
    addField(new BoolField({ name: 'dores_nuca' }))
    addField(new BoolField({ name: 'tremores_maos' }))
    addField(new BoolField({ name: 'gosto_metalico' }))

    // Organs: Pulmão
    addField(new BoolField({ name: 'asma' }))
    addField(new BoolField({ name: 'pele_ressecada' }))
    addField(new BoolField({ name: 'tristeza' }))
    addField(new BoolField({ name: 'gripes_frequentes' }))
    addField(new NumberField({ name: 'cansaco_grau' }))

    // Organs: Baço
    addField(new BoolField({ name: 'refluxo' }))
    addField(new BoolField({ name: 'cansaco_fraqueza' }))
    addField(new BoolField({ name: 'fadiga_palidez' }))
    addField(new BoolField({ name: 'dores_costela' }))
    addField(new BoolField({ name: 'removeu_utero_baco' }))

    // Organs: Iodo
    addField(new BoolField({ name: 'dores_corpo' }))
    addField(new BoolField({ name: 'excesso_gases' }))
    addField(new BoolField({ name: 'maos_pes_gelados' }))
    addField(new BoolField({ name: 'mucosa_fezes' }))

    // Organs: Fígado
    addField(new BoolField({ name: 'visao_turva' }))
    addField(new BoolField({ name: 'barriga_inchada' }))
    addField(new BoolField({ name: 'fezes_esbranquicadas' }))
    addField(new BoolField({ name: 'manchas_pele' }))
    addField(new BoolField({ name: 'urina_escura' }))

    // Organs: Pressão Arterial
    addField(new BoolField({ name: 'dor_cabeca' }))
    addField(new BoolField({ name: 'enxaqueca' }))
    addField(new BoolField({ name: 'pressao_nuca_art' }))
    addField(new BoolField({ name: 'tontura' }))
    addField(new BoolField({ name: 'zumbido' }))

    // Pathogens
    addField(new BoolField({ name: 'gases_candida' }))
    addField(new BoolField({ name: 'cansaco_ascaris' }))
    addField(new BoolField({ name: 'dores_cabeca_toxoplasma' }))
    addField(new BoolField({ name: 'acne_candida' }))
    addField(new BoolField({ name: 'nervoso_mental' }))

    addField(new BoolField({ name: 'diarreia_etamoeba' }))
    addField(new BoolField({ name: 'constipacao_ascaris' }))
    addField(new BoolField({ name: 'inchaco_candida' }))
    addField(new BoolField({ name: 'falta_foco' }))
    addField(new BoolField({ name: 'insonia_toxoplasma' }))

    addField(new BoolField({ name: 'ansiedade_toxoplasma' }))
    addField(new BoolField({ name: 'irritabilidade_giardia' }))
    addField(new BoolField({ name: 'depressao_candida' }))
    addField(new BoolField({ name: 'compulsao_doces' }))
    addField(new BoolField({ name: 'dores_migram' }))

    addField(new BoolField({ name: 'resfriado_frequente' }))
    addField(new BoolField({ name: 'palpitacao_toxoplasma' }))
    addField(new BoolField({ name: 'ma_digestao_giardia' }))
    addField(new BoolField({ name: 'azia_etamoeba' }))
    addField(new BoolField({ name: 'coceira_corpo' }))

    app.save(col)
  },
  (app) => {
    // Revert logic omitted due to the large number of fields.
  },
)
