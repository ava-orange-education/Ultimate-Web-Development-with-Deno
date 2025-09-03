import { Injectable } from "npm:@nestjs/common";

// Placeholder for Book model
interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
}

// Placeholder for BookRepository
@Injectable()
class BookRepository {
    findAll(): Promise<Book[]> {
        console.log('Fetching all books from repository...');
        return Promise.resolve([]);
    }
}

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async findAll(): Promise<Book[]> {
    return this.bookRepository.findAll()
  }
}
