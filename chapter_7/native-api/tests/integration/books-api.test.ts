import { assertEquals } from '@std/assert'

Deno.test('Books API Integration', async (t) => {
  const baseUrl = 'http://localhost:8000'

  await t.step('should create and retrieve a book', async () => {
    // Create a book
    const createResponse = await fetch(`${baseUrl}/api/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify({
        title: 'Integration Test Book',
        author: 'Test Author',
        isbn: '978-0123456789'
      })
    })

    assertEquals(createResponse.status, 201)
    const createdBook = await createResponse.json()

    // Retrieve the created book
    const getResponse = await fetch(`${baseUrl}/api/books/${createdBook.id}`)
    assertEquals(getResponse.status, 200)

    const retrievedBook = await getResponse.json()
    assertEquals(retrievedBook.title, 'Integration Test Book')
  })
})
