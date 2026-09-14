import { createClient } from "@supabase/supabase-js";

// Note: You need a running Supabase project.
// Set the connection values in your environment (or in a .env file loaded
// with @std/dotenv):
//   SUPABASE_URL=https://<project-ref>.supabase.co
//   SUPABASE_ANON_KEY=<your-anon-key>

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.",
  );
  Deno.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Insert a row. The `todos` table must exist and have Row Level Security
// enabled, with a policy that allows the `anon` role to insert and select.
const { error: insertError } = await supabase
  .from("todos")
  .insert({ task: "Learn Deno with Supabase" });

if (insertError) {
  console.error("Insert failed:", insertError.message);
} else {
  console.log("Inserted a new todo.");
}

// Read the rows back.
const { data, error } = await supabase
  .from("todos")
  .select("id, task, done");

if (error) {
  console.error("Select failed:", error.message);
} else {
  console.log("Todos:", data);
}
