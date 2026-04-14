migrate(
  (app) => {
    // Testimonials Collection
    const testimonials = new Collection({
      name: 'testimonials',
      type: 'base',
      listRule: 'approved = true',
      viewRule: 'approved = true',
      createRule: '',
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'message', type: 'text', required: true },
        { name: 'rating', type: 'number', min: 1, max: 5 },
        {
          name: 'avatar',
          type: 'file',
          maxSelect: 1,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
        { name: 'approved', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_testimonials_approved ON testimonials (approved)'],
    })
    app.save(testimonials)

    // Blog Posts Collection
    const blogPosts = new Collection({
      name: 'blog_posts',
      type: 'base',
      listRule: 'published = true',
      viewRule: 'published = true',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'content', type: 'editor', required: true },
        { name: 'excerpt', type: 'text' },
        {
          name: 'cover_image',
          type: 'file',
          maxSelect: 1,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
        { name: 'published', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_blog_posts_slug ON blog_posts (slug)'],
    })
    app.save(blogPosts)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('blog_posts'))
    app.delete(app.findCollectionByNameOrId('testimonials'))
  },
)
