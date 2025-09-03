import { Hono } from '@hono/hono'

const booksRouter = new Hono()

// Placeholder routes
booksRouter.get('/', (c) => c.json({ message: 'List of all books' }))
booksRouter.get('/:id', (c) => c.json({ message: `Details for book ${c.req.param('id')}` }))
booksRouter.post('/', (c) => c.json({ message: 'Create a new book' }, 201))

export { booksRouter }
