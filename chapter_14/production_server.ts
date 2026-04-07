// production_server.ts
// Example of a production-ready server with health checks,
// graceful shutdown, and security headers.

// Configuration and state
const PORT = Number(Deno.env.get("PORT") || 8000);
let isReady = false;
let isShuttingDown = false;

// Simulated database connection (e.g., Postgres, KV, MongoDB)
console.log("Connecting to the database...");
// In a real app: await db.connect();
setTimeout(() => {
  isReady = true;
  console.log("Database connected. Application is ready.");
}, 2000); // Simulates a 2s startup delay

// HTTP server using Deno.serve (native in Deno 2.x)
const server = Deno.serve({ port: PORT }, (req: Request) => {
  const url = new URL(req.url);

  // 1. Security middleware (security headers)
  // Adds headers to help prevent XSS, clickjacking, and related attacks.
  const headers = new Headers({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy": "default-src 'self'",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  });

  // 2. Health check (liveness/readiness probes)
  // Used by load balancers (AWS ALB, Kubernetes, Nginx)
  if (url.pathname === "/health") {
    // When shutting down, return 503 so the load balancer stops sending new traffic.
    if (isShuttingDown) {
      return new Response("Shutting down", { status: 503, headers });
    }
    // If the app is not ready yet, return 503.
    if (!isReady) {
      return new Response("Starting up", { status: 503, headers });
    }
    // All good
    return new Response("OK", { status: 200, headers });
  }

  // 3. Application routes
  if (url.pathname === "/") {
    return new Response("Hello Production! Deno 2.x is running.", {
      status: 200,
      headers,
    });
  }

  // 4. Error handling (404)
  return new Response("Not Found", { status: 404, headers });
});

// 5. Graceful shutdown
// Listen to OS signals
// SIGINT = Ctrl+C (terminal)
// SIGTERM = docker stop (orchestrator)
const shutdown = async () => {
  console.log("\nShutdown signal received...");

  // Make health checks fail immediately
  isShuttingDown = true;
  isReady = false;

  console.log("Shutting down HTTP server (waiting for in-flight requests)...");
  await server.shutdown(); // Wait for pending requests to complete

  console.log("Closing database connections...");
  // await db.close();

  console.log("Application shut down successfully.");
  Deno.exit(0);
};

Deno.addSignalListener("SIGINT", shutdown);
Deno.addSignalListener("SIGTERM", shutdown);

// Global handling for unhandled errors
globalThis.addEventListener("unhandledrejection", (e) => {
  console.error("UNHANDLED CRITICAL ERROR:", e.reason);
  // In some cases, it may be better to crash the process so Docker restarts it
  // Deno.exit(1);
});

console.log(`Server listening on port ${PORT}`);
