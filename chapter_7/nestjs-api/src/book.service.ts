import { Injectable } from "npm:@nestjs/common";
import { Book } from "./book.types.ts";

// Placeholder for BookRepository
@Injectable()
export class BookRepository {
    findAll(): Promise<Book[]> {
        console.log('Fetching all books from repository...');
        return Promise.resolve([]);
    }
}

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async findAll(): Promise<Book[]> {
    return this.bookRepository.findAll();
  }
}
