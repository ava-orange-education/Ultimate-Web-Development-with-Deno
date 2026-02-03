import pg from "pg";
import "@std/dotenv/load";

// Ensure DATABASE_URL is set in .env
// Example: postgres://postgres:postgres@localhost:5432/app_db
const connectionString = Deno.env.get("DATABASE_URL") || "postgres://postgres:postgres@localhost:5432/app_db";

const pool = new pg.Pool({
  connectionString,
  max: 20, // Max connections in the pool
  idleTimeoutMillis: 30000,
});

async function getUsers() {
  const client = await pool.connect();
  try {
    // Ensure table exists for this demo
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        active BOOLEAN DEFAULT true
      )
    `);

    // Insert a dummy user if empty
    const countRes = await client.query("SELECT count(*) FROM users");
    if (parseInt(countRes.rows[0].count) === 0) {
        await client.query("INSERT INTO users (name, active) VALUES ($1, $2)", ["Postgres User", true]);
    }

    const res = await client.query("SELECT * FROM users WHERE active = $1", [true]);
    return res.rows;
  } finally {
    // Release client back to the pool
    client.release();
  }
}

// Transaction example
async function transferFunds(senderId: number, receiverId: number, amount: number) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // This is just a simulation, assuming table accounts exists
        // const { rows: sender } = await client.query('SELECT balance FROM accounts WHERE id = $1 FOR UPDATE', [senderId]);
        // ... logic ...
        // await client.query('UPDATE accounts ...');
        
        console.log(`Simulating transfer of ${amount} from ${senderId} to ${receiverId}`);
        
        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

try {
  const users = await getUsers();
  console.log("Active users in Postgres:", users);
  await transferFunds(1, 2, 100);
} catch (err) {
  console.error("Database error:", err);
} finally {
  await pool.end();
}
