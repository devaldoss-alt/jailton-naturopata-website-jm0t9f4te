migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('anamnesis')

    if (!col.fields.getByName('tipo_atendimento')) {
      col.fields.add(
        new SelectField({
          name: 'tipo_atendimento',
          values: ['consulta', 'revisão'],
          maxSelect: 1,
          required: false,
        }),
      )
    }

    col.addIndex('idx_anamnesis_nome', false, 'nome_paciente', '')
    col.addIndex('idx_anamnesis_data', false, 'data_atendimento', '')

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('anamnesis')
    if (col.fields.getByName('tipo_atendimento')) {
      col.fields.removeByName('tipo_atendimento')
    }
    col.removeIndex('idx_anamnesis_nome')
    col.removeIndex('idx_anamnesis_data')
    app.save(col)
  },
)
