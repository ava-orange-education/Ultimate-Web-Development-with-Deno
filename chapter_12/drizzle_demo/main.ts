import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { users } from "./schema.ts";
import { eq } from "drizzle-orm";

const { Client } = pg;

// Connection setup
const client = new Client({
  connectionString: Deno.env.get("DATABASE_URL") || "postgres://postgres:postgres@localhost:5432/postgres",
});

await client.connect();

const db = drizzle(client);

async function main() {
  console.log("Migrating... (skipping actual migration for demo, assuming table exists)");
  // In a real app, you'd run migrations here or via CLI
  // For this demo, let's just ensure the table exists via raw SQL if needed, 
  // but typically Drizzle Kit handles this.
  
  await client.query(`
    CREATE TABLE IF NOT EXISTS users_drizzle (
      id SERIAL PRIMARY KEY,
      full_name TEXT,
      age INTEGER
    )
  `);

  // Insert
  console.log("Inserting user...");
  await db.insert(users).values({
    fullName: "John Doe",
    age: 30,
  });

  // Select
  console.log("Selecting users...");
  const allUsers = await db.select().from(users);
  console.log("Users:", allUsers);

  // Update
  console.log("Updating user...");
  await db.update(users)
    .set({ age: 31 })
    .where(eq(users.fullName, "John Doe"));

  // Verify Update
  const updated = await db.select().from(users).where(eq(users.fullName, "John Doe"));
  console.log("Updated User:", updated);

  await client.end();
}

main().catch((err) => {
  console.error(err);
  client.end();
});
