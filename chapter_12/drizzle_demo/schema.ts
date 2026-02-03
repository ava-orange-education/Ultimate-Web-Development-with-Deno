import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users_drizzle", {
  id: serial("id").primaryKey(),
  fullName: text("full_name"),
  age: integer("age"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
