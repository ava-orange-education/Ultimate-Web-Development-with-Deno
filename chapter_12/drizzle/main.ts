import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { users, posts } from "./schema.ts";
import { eq } from "drizzle-orm";
import * as schema from "./schema.ts";
import "@std/dotenv/load";

// Connect to DB
const client = new pg.Client({ 
    connectionString: Deno.env.get("DATABASE_URL") || "postgres://postgres:postgres@localhost:5432/app_db" 
});

await client.connect();

// Initialize Drizzle with schema for query builder mode
const db = drizzle(client, { schema });

try {
    console.log("Creating user...");
    const [newUser] = await db.insert(users).values({
      name: "Alice Dev",
      role: "admin",
      email: `alice_${Date.now()}@example.com`
    }).returning();

    console.log("Created User:", newUser);

    console.log("Creating post...");
    await db.insert(posts).values({
        title: "Drizzle with Deno is cool",
        content: "This is a post content",
        authorId: newUser.id
    });

    // Query with Relations
    const usersWithPosts = await db.query.users.findMany({
        where: eq(users.id, newUser.id),
        with: {
            posts: true
        }
    });

    console.log("User with Posts:", JSON.stringify(usersWithPosts, null, 2));

} catch (e) {
    console.error(e);
} finally {
    await client.end();
}
