const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimitMiddleware(limit: number, windowMs: number) {
  return (req: Request): Response | null => {
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const windowStart = now - windowMs

    const clientData = rateLimitMap.get(clientIp)

    if (!clientData || clientData.resetTime < windowStart) {
      rateLimitMap.set(clientIp, { count: 1, resetTime: now + windowMs })
      return null
    }

    if (clientData.count >= limit) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((clientData.resetTime - now) / 1000).toString()
          }
        }
      )
    }

    clientData.count++
    return null
  }
}
