// Run with: deno run --allow-net --allow-read --unstable-kv kv_watch_demo.ts

const kv = await Deno.openKv();

// Route handler
async function handler(req: Request): Promise<Response> {
    const url = new URL(req.url);

    if (url.pathname === "/events") {
        const stream = kv.watch([["stats", "visitors"]]);
        
        const body = new ReadableStream({
            async start(controller) {
                console.log("Client connected to stream");
                try {
                    for await (const [entry] of stream) {
                        const data = JSON.stringify({ visitors: entry.value });
                        controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
                    }
                } catch (e) {
                    console.log("Stream closed");
                }
            },
            cancel() {
                console.log("Client disconnected");
            }
        });

        return new Response(body, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    }

    if (url.pathname === "/visit" && req.method === "POST") {
        const key = ["stats", "visitors"];
        await kv.atomic()
            .mutate({ type: "sum", key, value: new Deno.KvU64(1n) })
            .commit();
        return new Response("Visitor counted");
    }

    return new Response(`
        <html>
        <body>
            <h1>Live Visitors: <span id="count">0</span></h1>
            <button onclick="fetch('/visit', {method: 'POST'})">Add Visitor</button>
            <script>
                const evtSource = new EventSource("/events");
                evtSource.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    document.getElementById("count").innerText = data.visitors || 0;
                };
            </script>
        </body>
        </html>
    `, { headers: { "Content-Type": "text/html" } });
}

console.log("Server running on http://localhost:8000");
Deno.serve(handler);
