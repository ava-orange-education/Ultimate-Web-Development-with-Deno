import { Controller, Get, UseGuards, Injectable } from "npm:@nestjs/common";
import { BookService } from "./book.service.ts";

// Placeholder for Book model
interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
}

// Placeholder for AuthGuard
@Injectable()
class AuthGuard {
    canActivate(): boolean {
        console.log('AuthGuard activated...');
        return true; // Allow access for demonstration
    }
}

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(): Promise<Book[]> {
    return this.bookService.findAll()
  }
}
