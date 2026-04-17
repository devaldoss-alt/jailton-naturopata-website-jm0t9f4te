migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData('testimonials', 'name', 'Maria Fernanda Silva')
      record.set('name', 'Mário Fernades Silva')
      app.save(record)
    } catch (_) {
      // Ignore if not found
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('testimonials', 'name', 'Mário Fernades Silva')
      record.set('name', 'Maria Fernanda Silva')
      app.save(record)
    } catch (_) {
      // Ignore if not found
    }
  },
)
