import { Hono } from '@hono/hono'
import { logger } from '@hono/hono/logger'
import { cors } from '@hono/hono/cors'
import { booksRouter } from './src/routes/books.ts'
import { authRouter } from './src/routes/auth.ts'

const app = new Hono()

// Global Middleware
app.use('*', logger())
app.use('*', cors())

// Routes
app.route('/api/books', booksRouter)
app.route('/api/auth', authRouter)

// Health check route
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

export default app

if (import.meta.main) {
  Deno.serve(app.fetch)
}
