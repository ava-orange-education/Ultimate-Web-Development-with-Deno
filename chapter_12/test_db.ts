import { GenericContainer, Wait } from "npm:testcontainers";
import { Client } from "npm:pg";
import { assertEquals } from "jsr:@std/assert";

Deno.test({
    name: "Database Integration Test with Testcontainers",
    // Permissions needed: --allow-net --allow-read --allow-env --allow-run
    fn: async () => {
        console.log("Starting Postgres container...");
        
        const container = await new GenericContainer("postgres:16-alpine")
            .withEnvironment({ 
                POSTGRES_USER: "postgres", 
                POSTGRES_PASSWORD: "test",
                POSTGRES_DB: "test_db"
            })
            .withExposedPorts(5432)
            // Wait for log message that indicates readiness or just port check
            .withWaitStrategy(Wait.forLogMessage("database system is ready to accept connections"))
            .start();

        const port = container.getMappedPort(5432);
        const host = container.getHost();

        const client = new Client({
            connectionString: `postgres://postgres:test@${host}:${port}/test_db`
        });
        
        try {
            await client.connect();
            
            // Run simple query
            const res = await client.query("SELECT 1 as val");
            assertEquals(res.rows[0].val, 1);
            
            // Create table and insert
            await client.query("CREATE TABLE items (id SERIAL, name TEXT)");
            await client.query("INSERT INTO items (name) VALUES ($1)", ["test_item"]);
            const items = await client.query("SELECT * FROM items");
            assertEquals(items.rows.length, 1);
            assertEquals(items.rows[0].name, "test_item");

        } finally {
            await client.end();
            await container.stop();
        }
    }
});
