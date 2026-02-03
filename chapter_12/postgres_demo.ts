import pg from "pg";

// Note: You need a running Postgres instance. 
// Set the connection string in DATABASE_URL environment variable or modify below.
// Example: postgres://user:password@localhost:5432/dbname

const client = new pg.Client({
  connectionString: Deno.env.get("DATABASE_URL") || "postgres://postgres:postgres@localhost:5432/postgres",
});

try {
  await client.connect();
  console.log("Connected to PostgreSQL");

  // Create table
  await client.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      task TEXT NOT NULL,
      done BOOLEAN DEFAULT FALSE
    )
  `);

  // Insert
  await client.query("INSERT INTO todos (task) VALUES ($1)", ["Learn Deno"]);
  
  // Select
  const res = await client.query("SELECT * FROM todos");
  console.log("Todos:", res.rows);

} catch (err) {
  console.error("Error executing query", err);
} finally {
  await client.end();
}
