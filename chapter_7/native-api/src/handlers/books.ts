import { z } from 'npm:zod@^3.22.0'

// Helper function to validate ISBN-10 and ISBN-13 (978/979)
function isValidIsbn(isbn: string): boolean {
  // Remove hyphens and spaces
  const clean = isbn.replace(/[\s-]+/g, '');
  // ISBN-10: 10 digits, last digit can be X
  if (/^\d{9}[\dX]$/.test(clean)) {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += (i + 1) * parseInt(clean[i], 10);
    }
    const check = clean[9] === 'X' ? 10 : parseInt(clean[9], 10);
    return (sum + check) % 11 === 0;
  }
  // ISBN-13: 13 digits, starts with 978 or 979
  if (/^(978|979)\d{10}$/.test(clean)) {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(clean[i], 10) * (i % 2 === 0 ? 1 : 3);
    }
    const check = (10 - (sum % 10)) % 10;
    return check === parseInt(clean[12], 10);
  }
  return false;
}

const CreateBookSchema = z.object({
  title: z.string().min(1).max(255),
  author: z.string().min(1).max(255),
  isbn: z.string().refine(isValidIsbn, { message: 'ISBN must be a valid ISBN-10 or ISBN-13' }),
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
