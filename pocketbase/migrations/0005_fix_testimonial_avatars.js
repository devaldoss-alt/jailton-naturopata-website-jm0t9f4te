migrate(
  (app) => {
    const testimonials = app.findRecordsByFilter('testimonials', '1=1', '', 100, 0)

    const maleNames = [
      'mário',
      'mario',
      'joão',
      'joao',
      'pedro',
      'diogo',
      'tiago',
      'tomás',
      'tomas',
      'afonso',
      'vasco',
      'miguel',
      'carlos',
      'rui',
      'josé',
      'jose',
      'antónio',
      'antonio',
      'manuel',
      'paulo',
      'francisco',
      'luís',
      'luis',
      'ricardo',
      'hugo',
      'bruno',
      'filipe',
      'nuno',
      'jorge',
      'fernando',
      'ruben',
      'gonçalo',
      'henrique',
    ]

    for (let i = 0; i < testimonials.length; i++) {
      const record = testimonials[i]
      const fullName = record.getString('name').toLowerCase().trim()
      const firstName = fullName.split(' ')[0]

      let gender = 'female'
      if (maleNames.includes(firstName) || fullName.includes('mário')) {
        gender = 'male'
      }

      // Generate a consistent seed based on the record's ID
      let seed = 0
      for (let j = 0; j < record.id.length; j++) {
        seed += record.id.charCodeAt(j)
      }

      const avatarUrl = `https://img.usecurling.com/ppl/large?gender=${gender}&seed=${seed}`

      // We use a raw SQL query to set the external avatar URL string directly on the field
      // bypassing file constraints, ensuring the frontend receives the correct placeholder.
      app
        .db()
        .newQuery('UPDATE testimonials SET avatar = {:avatar} WHERE id = {:id}')
        .bind({ avatar: avatarUrl, id: record.id })
        .execute()
    }
  },
  (app) => {
    // Irreversible migration — leaving avatars as they were updated
  },
)
