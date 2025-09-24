// Note: This is a simple, in-memory data source.
// In a real application, this would be a database.
const books = [
  {
    id: "1",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
  },
  {
    id: "2",
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
  },
];

// Resolver map
export const resolvers = {
  Query: {
    allBooks: () => books,
    findBook: (_: unknown, { id }: { id: string }) => {
      return books.find((book) => book.id === id);
    },
  },
  Mutation: {
    addBook: (_: unknown, { title, author }: { title: string; author?: string }) => {
      const newBook = {
        id: String(Date.now()), // Use timestamp for unique ID generation
        title,
        author: author || "Unknown",
      };
      books.push(newBook);
      return newBook;
    },
  },
};
