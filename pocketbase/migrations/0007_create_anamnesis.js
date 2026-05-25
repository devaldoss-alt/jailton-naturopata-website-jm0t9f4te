migrate(
  (app) => {
    const collection = new Collection({
      name: 'anamnesis',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'nome_paciente', type: 'text', required: true },
        { name: 'data_atendimento', type: 'date', required: true },
        { name: 'motivo_consulta', type: 'text', required: true },
        { name: 'sintomas_principais', type: 'text' },
        { name: 'orgaos_afetados', type: 'text' },
        { name: 'ia_sugestoes_terapeuticas', type: 'editor' },
        { name: 'ia_suplementacao', type: 'editor' },
        { name: 'ia_referencias', type: 'editor' },
        { name: 'status', type: 'select', values: ['pending', 'completed', 'error'], maxSelect: 1 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_anamnesis_user ON anamnesis (user_id)'],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('anamnesis')
    app.delete(collection)
  },
)
