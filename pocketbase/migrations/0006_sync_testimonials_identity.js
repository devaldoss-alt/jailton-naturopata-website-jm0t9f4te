migrate(
  (app) => {
    const records = app.findRecordsByFilter('testimonials', '', '', 1000, 0)
    for (const record of records) {
      const name = record.getString('name').toLowerCase()

      // Determine gender based on common Brazilian/Portuguese male names
      let gender = 'female'
      const maleNames = [
        'mário',
        'mario',
        'joão',
        'joao',
        'carlos',
        'pedro',
        'josé',
        'jose',
        'antonio',
        'antônio',
        'marcos',
        'luiz',
        'fernando',
        'roberto',
        'jailton',
        'paulo',
        'lucas',
        'gabriel',
      ]

      if (maleNames.some((n) => name.includes(n))) {
        gender = 'male'
      }

      const firstName = record.getString('name').split(' ')[0]
      const seed = encodeURIComponent(firstName || record.id)
      const url = `https://img.usecurling.com/ppl/thumbnail?gender=${gender}&seed=${seed}`

      // Update via raw SQL to bypass the PocketBase file field validation since we are intentionally inserting an external URL string.
      app
        .db()
        .newQuery('UPDATE testimonials SET avatar = {:url} WHERE id = {:id}')
        .bind({ url: url, id: record.id })
        .execute()
    }
  },
  (app) => {
    // Revert not strictly required for data patches
  },
)
