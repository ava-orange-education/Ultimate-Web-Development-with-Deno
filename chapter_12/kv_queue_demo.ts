const kv = await Deno.openKv();

// Listener for queue processing
kv.listenQueue(async (msg) => {
  console.log("Worker received message:", msg);
  
  // Simulate processing
  await new Promise(r => setTimeout(r, 1000));
  
  console.log("Worker finished processing:", msg);
});

// Enqueue messages
console.log("Enqueuing jobs...");
await kv.enqueue({ type: "email", to: "user1@example.com" });
await kv.enqueue({ type: "report", date: "2023-10-27" });

// Keep process alive to process queue
console.log("Waiting for jobs... (Press Ctrl+C to exit)");
// In a real app, listenQueue keeps the isolate alive.
