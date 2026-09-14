// Minimal AWS Lambda handler for the Deno 2.x runtime.
// Package it as a container image (see the chapter's Dockerfile) and point the
// Lambda function at the exported `handler`.

interface LambdaEvent {
  name?: string;
}

function parseEvent(value: unknown): LambdaEvent {
  if (typeof value !== "object" || value === null) return {};
  const { name } = value as Record<string, unknown>;
  return typeof name === "string" ? { name } : {};
}

export async function handler(event: unknown): Promise<{
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}> {
  const { name = "World" } = parseEvent(event);

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message: `Hello, ${name}!` }),
  };
}

// Local smoke test: `deno run lambda_handler.ts`
if (import.meta.main) {
  const response = await handler({ name: "Deno" });
  console.log(response.statusCode, response.body);
}
