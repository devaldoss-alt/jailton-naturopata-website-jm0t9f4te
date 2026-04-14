migrate(
  (app) => {
    // 1. Create admin user
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'devaldoss@gmail.com')
    } catch (_) {
      const users = app.findCollectionByNameOrId('_pb_users_auth_')
      const record = new Record(users)
      record.setEmail('devaldoss@gmail.com')
      record.setPassword('Skip@Pass')
      record.setVerified(true)
      record.set('name', 'Admin')
      app.save(record)
    }

    // 2. Seed Testimonials
    const tCol = app.findCollectionByNameOrId('testimonials')
    const seedTestimonials = [
      {
        name: 'Maria Fernanda Silva',
        message:
          'A naturopatia mudou minha vida. As dores crônicas que me acompanhavam há anos desapareceram com o tratamento integrativo. O cuidado e a atenção do Jailton foram fundamentais nesse processo de cura profunda.',
        rating: 5,
        approved: true,
      },
      {
        name: 'Carlos Eduardo Souza',
        message:
          'Excelente profissional. As sessões de acupuntura ajudaram significativamente a reduzir minha ansiedade e melhorar a qualidade do meu sono. Recomendo muito!',
        rating: 5,
        approved: true,
      },
      {
        name: 'Ana Luísa Costa',
        message:
          'Incrível como os tratamentos naturais me trouxeram mais energia e disposição para o dia a dia. O Jailton é muito atencioso e explica tudo em detalhes.',
        rating: 5,
        approved: true,
      },
    ]

    for (const t of seedTestimonials) {
      try {
        app.findFirstRecordByData('testimonials', 'name', t.name)
      } catch (_) {
        const record = new Record(tCol)
        record.set('name', t.name)
        record.set('message', t.message)
        record.set('rating', t.rating)
        record.set('approved', t.approved)
        app.save(record)
      }
    }

    // 3. Seed Blog Posts
    const bpCol = app.findCollectionByNameOrId('blog_posts')
    const seedPosts = [
      {
        title: 'Os Benefícios da Fitoterapia no Combate à Ansiedade',
        slug: 'beneficios-fitoterapia-ansiedade',
        content:
          '<p>A fitoterapia é uma prática milenar e muito eficiente para o controle de diversos distúrbios emocionais.</p><h2>Como funciona?</h2><p>As plantas medicinais possuem princípios ativos e propriedades sedativas e calmantes que atuam diretamente no sistema nervoso. Entre as mais conhecidas estão a passiflora (maracujá), a valeriana, a erva-cidreira e a camomila.</p><p>Sempre consulte um profissional antes de iniciar qualquer tratamento com fitoterapia para garantir que não haja interações com outras medicações.</p>',
        excerpt:
          'Descubra como o uso de plantas medicinais pode ser um aliado natural e eficaz no tratamento e controle da ansiedade no dia a dia.',
        published: true,
      },
      {
        title: 'Desintoxicação Natural: Por onde começar?',
        slug: 'desintoxicacao-natural-por-onde-comecar',
        content:
          '<p>O nosso corpo acumula toxinas diariamente através da alimentação, poluição e estresse. Uma desintoxicação eficiente melhora a energia, imunidade e saúde da pele.</p><h2>Passos para desintoxicar</h2><ul><li>Beba mais água pura e chás diuréticos ao longo do dia.</li><li>Aumente o consumo de fibras orgânicas, frutas e vegetais.</li><li>Evite produtos ultraprocessados, açúcares e farinhas brancas.</li><li>Pratique atividades físicas regularmente.</li></ul><p>O acompanhamento de um naturopata é essencial para um protocolo seguro e personalizado.</p>',
        excerpt:
          'Aprenda passos simples e naturais para ajudar seu corpo a eliminar toxinas e recuperar a vitalidade e bem-estar geral.',
        published: true,
      },
    ]

    for (const bp of seedPosts) {
      try {
        app.findFirstRecordByData('blog_posts', 'slug', bp.slug)
      } catch (_) {
        const record = new Record(bpCol)
        record.set('title', bp.title)
        record.set('slug', bp.slug)
        record.set('content', bp.content)
        record.set('excerpt', bp.excerpt)
        record.set('published', bp.published)
        app.save(record)
      }
    }
  },
  (app) => {
    // Empty down
  },
)
