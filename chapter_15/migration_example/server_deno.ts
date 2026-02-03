Deno.serve({ port: 3000 }, async (req: Request) => {
  const url = new URL(req.url);

  if (req.method === "GET" && url.pathname === "/") {
    return new Response("Hello from Deno!");
  }

  return new Response("Not Found", { status: 404 });
});
