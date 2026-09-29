// main.ts
/**
 * Simple Edge Function example for Deno Deploy
 *
 * This function responds with a greeting and the region where the code is running.
 * In Deno Deploy, the region is available via the DENO_REGION environment variable.
 */

Deno.serve((_req: Request) => {
  // Get the region from the environment variable (Deno Deploy specific)
  // or fallback to a default string.
  const region = Deno.env.get("DENO_REGION") || "Localhost";

  return new Response(
    `Hello from the Edge! You are connecting to region: ${region}`,
    {
      status: 200,
      headers: {
        "content-type": "text/plain",
        "x-served-by": region,
      },
    },
  );
});
