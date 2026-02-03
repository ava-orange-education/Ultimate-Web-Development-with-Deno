// Supabase Edge Function
// Follows Deno 2.x conventions using Deno.serve

console.log("Hello from Supabase Edge Functions!");

Deno.serve(async (req: Request) => {
  const { name } = await req.json().catch(() => ({ name: "World" }));

  const data = {
    message: `Hello ${name}!`,
    timestamp: new Date().toISOString(),
    runtime: "Deno",
  };

  return new Response(
    JSON.stringify(data),
    { 
      headers: { "Content-Type": "application/json" } 
    },
  );
});
