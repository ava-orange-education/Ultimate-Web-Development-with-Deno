import { verify } from 'jsr:@std/jwt'
import { type Payload } from 'jsr:@std/jwt'

// Ideally, load from environment variables
const JWT_SECRET = Deno.env.get('JWT_SECRET') || 'your-secret-key'

export interface AuthPayload extends Payload {
  sub: string
  email: string
  roles: string[]
  exp: number
}

export async function authMiddleware(
  req: Request,
  info: Deno.ServeHandlerInfo
): Promise<Response | null> {
  const authHeader = req.headers.get('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'Access token required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const token = authHeader.slice(7)

  try {
    const payload = await verify(token, JWT_SECRET)

    // Check expiration (verify already does this, but a double check is not bad)
    if (!payload || (payload.exp && payload.exp < Date.now() / 1000)) {
      return new Response(
        JSON.stringify({ error: 'Token expired' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Add payload to request context
    (req as any).user = payload
    return null // Continue processing

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
