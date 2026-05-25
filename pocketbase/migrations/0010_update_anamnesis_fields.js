migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('anamnesis')

    if (!col.fields.getByName('email_paciente'))
      col.fields.add(new EmailField({ name: 'email_paciente' }))
    if (!col.fields.getByName('telefone_paciente'))
      col.fields.add(new TextField({ name: 'telefone_paciente' }))
    if (!col.fields.getByName('data_nascimento'))
      col.fields.add(new DateField({ name: 'data_nascimento' }))
    if (!col.fields.getByName('endereco')) col.fields.add(new TextField({ name: 'endereco' }))
    if (!col.fields.getByName('profissao')) col.fields.add(new TextField({ name: 'profissao' }))
    if (!col.fields.getByName('historico_familiar'))
      col.fields.add(new TextField({ name: 'historico_familiar' }))
    if (!col.fields.getByName('habitos_alimentares'))
      col.fields.add(new TextField({ name: 'habitos_alimentares' }))
    if (!col.fields.getByName('qualidade_sono'))
      col.fields.add(
        new SelectField({
          name: 'qualidade_sono',
          values: ['ruim', 'regular', 'bom', 'excelente'],
        }),
      )
    if (!col.fields.getByName('ingestao_agua'))
      col.fields.add(new TextField({ name: 'ingestao_agua' }))
    if (!col.fields.getByName('medicamentos_em_uso'))
      col.fields.add(new TextField({ name: 'medicamentos_em_uso' }))
    if (!col.fields.getByName('observacoes_gerais'))
      col.fields.add(new TextField({ name: 'observacoes_gerais' }))

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('anamnesis')
    col.fields.removeByName('email_paciente')
    col.fields.removeByName('telefone_paciente')
    col.fields.removeByName('data_nascimento')
    col.fields.removeByName('endereco')
    col.fields.removeByName('profissao')
    col.fields.removeByName('historico_familiar')
    col.fields.removeByName('habitos_alimentares')
    col.fields.removeByName('qualidade_sono')
    col.fields.removeByName('ingestao_agua')
    col.fields.removeByName('medicamentos_em_uso')
    col.fields.removeByName('observacoes_gerais')
    app.save(col)
  },
)
