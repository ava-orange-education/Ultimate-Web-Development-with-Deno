// Schema definition using SDL
export const typeDefs = `#graphql
  type Book {
    id: ID!
    title: String!
    author: String
  }

  type Query {
    allBooks: [Book]
    findBook(id: ID!): Book
  }

  type Mutation {
    addBook(title: String!, author: String): Book
  }
`;
