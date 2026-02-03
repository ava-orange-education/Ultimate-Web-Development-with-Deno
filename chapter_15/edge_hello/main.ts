// main.ts
/**
 * Simple Edge Function example for Deno Deploy
 * 
 * This function responds with a greeting and the region where the code is running.
 * In Deno Deploy, the 'deno-region' header tells us the location.
 */

Deno.serve((req: Request) => {
  const url = new URL(req.url);
  
  // Get the region from the environment variable (Deno Deploy specific)
  // or fallback to a default string.
  const region = Deno.env.get("DENO_REGION") || "Localhost";
  
  return new Response(`Hello from the Edge! You are connecting to region: ${region}`, {
    status: 200,
    headers: {
      "content-type": "text/plain",
      "x-served-by": region,
    },
  });
});
