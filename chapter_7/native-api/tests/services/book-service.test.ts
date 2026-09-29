import { assertEquals, assertRejects } from '@std/assert'
import { BookService } from '../../src/services/book-service.ts'

Deno.test('BookService', async (t) => {
  await t.step('should create a new book', async () => {
    const bookService = new BookService()
    const bookData = {
      title: 'Test Book',
      author: 'Test Author',
      isbn: '978-0123456789'
    }

    const book = await bookService.create(bookData)

    assertEquals(book.title, bookData.title)
    assertEquals(book.author, bookData.author)
    assertEquals(book.isbn, bookData.isbn)
  })

  await t.step('should reject invalid ISBN', async () => {
    const bookService = new BookService()
    const bookData = {
      title: 'Test Book',
      author: 'Test Author',
      isbn: 'invalid-isbn'
    }

    await assertRejects(
      () => bookService.create(bookData),
      Error,
      'Invalid ISBN'
    )
  })
})
