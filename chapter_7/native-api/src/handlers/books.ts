import { z } from 'npm:zod@^3.22.0'

const CreateBookSchema = z.object({
  title: z.string().min(1).max(255),
  author: z.string().min(1).max(255),
  isbn: z.string().regex(/^978\d{10}$/, 'ISBN must be a 13-digit number starting with 978'),
  publishYear: z.number().int().min(1000).max(new Date().getFullYear()),
  pages: z.number().int().positive().optional()
})

export async function createBookHandler(req: Request): Promise<Response> {
  try {
    const body = await req.json()
    const validatedData = CreateBookSchema.parse(body)

    // Continue with validated data...
    // Placeholder for actual book creation logic
    return new Response(
      JSON.stringify({ message: "Book created successfully", data: validatedData }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: 'Invalid data',
          details: error.errors
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    // Generic error for other cases
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
