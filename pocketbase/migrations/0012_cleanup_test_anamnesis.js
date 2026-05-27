migrate(
  (app) => {
    // Delete all records from the anamnesis collection EXCEPT for the single most recent record where status is 'completed'
    app
      .db()
      .newQuery(`
    DELETE FROM anamnesis 
    WHERE id NOT IN (
      SELECT id FROM anamnesis 
      WHERE status = 'completed' 
      ORDER BY created DESC 
      LIMIT 1
    )
  `)
      .execute()
  },
  (app) => {
    // Data deletion cannot be cleanly reverted
  },
)
