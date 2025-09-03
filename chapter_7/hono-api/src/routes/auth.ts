import { Hono } from '@hono/hono'

const authRouter = new Hono()

// Placeholder routes
authRouter.post('/login', (c) => c.json({ message: 'Login successful' }))
authRouter.post('/register', (c) => c.json({ message: 'User registered' }, 201))

export { authRouter }
