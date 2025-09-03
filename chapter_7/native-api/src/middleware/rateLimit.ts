const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimitMiddleware(limit: number, windowMs: number) {
  return (req: Request): Response | null => {
    // WARNING: Using 'x-forwarded-for' is insecure unless you validate the proxy chain and trust the proxy.
    // Deno.ServeHandlerInfo contains the remote address, but we don't have it here.
    // A more robust solution would involve passing the remoteAddr to the middleware.
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
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
