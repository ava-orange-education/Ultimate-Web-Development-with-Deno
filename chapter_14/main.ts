Deno.serve((req) => {
  const url = new URL(req.url);
  console.log(`Received request: ${req.method} ${url.pathname}`);
  
  return new Response("Hello from Deno 2.x! Deployed with Docker and Deno Deploy.", {
    status: 200,
    headers: { "content-type": "text/plain" },
  });
});
