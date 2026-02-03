// server_deno.ts
/**
 * Modern Deno equivalent using Standard Web APIs
 * No external dependencies required (like 'express')
 */

Deno.serve({ port: 3000 }, async (req: Request) => {
  const url = new URL(req.url);
  const method = req.method;

  // Logger (Middleware equivalent)
  console.log(`${new Date().toISOString()} - ${method} ${url.pathname}`);

  try {
    // Router logic
    if (method === "GET" && url.pathname === "/") {
      return new Response("Hello from Deno!");
    }

    if (method === "POST" && url.pathname === "/api/data") {
      // Parse JSON body directly from the Request object
      const data = await req.json();
      return Response.json({ message: "Data received", received: data });
    }

    // 404 Not Found
    return new Response("Not Found", { status: 404 });

  } catch (error) {
    // Error handling
    console.error(error);
    return new Response("Something broke!", { status: 500 });
  }
});

console.log("Deno server running on http://localhost:3000");
