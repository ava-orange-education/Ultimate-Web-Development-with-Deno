// main.ts
/**
 * Deno KV Example: Global Counter
 * 
 * This example demonstrates how to use Deno KV (Key-Value store) 
 * to maintain state at the Edge. Deno KV is built into the runtime
 * and works seamlessly in Deno Deploy.
 */

// Open the default KV store
const kv = await Deno.openKv();

Deno.serve(async (req: Request) => {
  // Use an atomic transaction to ensure consistency
  // even with concurrent requests from all over the world.
  const key = ["visits"];
  
  // Increment the counter
  // sum() is a specialized atomic operation for bigints
  await kv.atomic()
    .sum(key, 1n)
    .commit();

  // Retrieve the current value
  const result = await kv.get<Deno.KvU64>(key);
  const count = result.value ? result.value.value : 0n;

  return new Response(`Global Visits: ${count}`, {
    status: 200,
  });
});
