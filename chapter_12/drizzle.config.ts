import { defineConfig } from "drizzle-kit";
import "@std/dotenv/load";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: Deno.env.get("DATABASE_URL") || "postgres://postgres:postgres@localhost:5432/app_db",
  },
  verbose: true,
  strict: true,
});
