import { AuthPayload } from "./auth.ts";

export function requireRoles(...requiredRoles: string[]) {
  return async (req: Request): Promise<Response | null> => {
    const user = (req as any).user as AuthPayload

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not authenticated' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const hasRequiredRole = requiredRoles.some(role =>
      user.roles.includes(role)
    )

    if (!hasRequiredRole) {
      return new Response(
        JSON.stringify({
          error: 'Access denied',
          required_roles: requiredRoles
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return null // Authorized
  }
}
