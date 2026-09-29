import { App, staticFiles } from "@fresh/core";

export const app = new App();

app.use(staticFiles());

// Load routes from the file system
await app.fsRoutes("./routes");

if (import.meta.main) {
  await app.listen();
}
