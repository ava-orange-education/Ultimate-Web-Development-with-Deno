import { App, staticFiles } from "@fresh/core";

export const app = new App();

app.use(staticFiles());

// Carrega rotas do sistema de arquivos
await app.fsRoutes("./routes");

if (import.meta.main) {
  await app.listen();
}
