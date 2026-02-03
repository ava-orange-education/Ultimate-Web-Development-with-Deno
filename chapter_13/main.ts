import { trace, metrics, SpanStatusCode } from "@opentelemetry/api";

// Get a tracer and meter from the global provider (initialized by Deno runtime)
const tracer = trace.getTracer("deno-observability-demo");
const meter = metrics.getMeter("deno-observability-demo");

// Define custom metrics
const requestCounter = meter.createCounter("http_requests_total", {
  description: "Total number of HTTP requests processed",
});

const latencyHistogram = meter.createHistogram("http_request_duration_ms", {
  description: "Duration of HTTP requests in milliseconds",
  unit: "ms",
});

console.log("Starting server... Access http://localhost:8000");

Deno.serve({ port: 8000 }, async (req) => {
  const startTime = performance.now();
  const url = new URL(req.url);
  
  // Increment the request counter
  requestCounter.add(1, { method: req.method, route: url.pathname });

  // Start a custom span to track the request handling
  return await tracer.startActiveSpan("handle_request", async (span) => {
    // Add custom attributes to the span
    span.setAttribute("http.client_ip", req.headers.get("x-forwarded-for") || "unknown");
    span.setAttribute("custom.tag", "example-value");

    try {
      if (url.pathname === "/") {
        // Log information - Deno auto-instruments console.log to OTLP logs
        console.log("Handling request to root path");
        
        // Add an event to the span (like a timestamped log within the trace)
        span.addEvent("processing_start");
        
        await simulateDatabaseCall();
        await simulateExternalApiCall();
        
        span.addEvent("processing_end");
        
        return new Response("Hello, OpenTelemetry in Deno 2!", { status: 200 });
      } 
      
      if (url.pathname === "/error") {
        console.error("Simulating a server error");
        throw new Error("Something went terribly wrong!");
      }

      return new Response("Not Found", { status: 404 });

    } catch (error) {
      const err = error as Error;
      // Record the exception in the span
      span.recordException(err);
      // Set span status to error
      span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
      
      return new Response("Internal Server Error", { status: 500 });
    } finally {
      // Record latency
      const duration = performance.now() - startTime;
      latencyHistogram.record(duration, { route: url.pathname });
      
      // End the span
      span.end();
    }
  });
});

// Simulate a database operation with its own span
async function simulateDatabaseCall() {
  return await tracer.startActiveSpan("database_query", async (span) => {
    span.setAttribute("db.system", "postgres");
    span.setAttribute("db.statement", "SELECT * FROM users");
    
    const delay = Math.random() * 100 + 50; // 50-150ms
    await new Promise((resolve) => setTimeout(resolve, delay));
    
    span.end();
  });
}

// Simulate an external API call
async function simulateExternalApiCall() {
  return await tracer.startActiveSpan("external_api_fetch", async (span) => {
    span.setAttribute("url.full", "https://api.example.com/data");
    
    const delay = Math.random() * 200 + 100; // 100-300ms
    await new Promise((resolve) => setTimeout(resolve, delay));
    
    span.end();
  });
}
