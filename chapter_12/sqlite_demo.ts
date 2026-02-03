import { Database } from "@db/sqlite";

// Open (or create) the database file
const db = new Database("app_data.db");

// Create table
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE
  )
`).run();

// Insert data
const insert = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
try {
  insert.run("Laion", "laion@example.com");
  insert.run("Deno User", "user@deno.land");
} catch (e) {
  // Ignore unique constraint errors for multiple runs
  if (!(e instanceof Error) || !e.message.includes("UNIQUE constraint failed")) {
    throw e;
  }
}

// Query data
const users = db.prepare("SELECT * FROM users").all();
console.log("Users in SQLite:", users);

db.close();
