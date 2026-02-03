// production_server.ts
// Exemplo de servidor robusto para produção com Health Checks, 
// Graceful Shutdown e Headers de Segurança.

// Configuração e Estado
const PORT = Number(Deno.env.get("PORT") || 8000);
let isReady = false;
let isShuttingDown = false;

// Simulação de conexão com Banco de Dados (ex: Postgres, KV, Mongo)
console.log("Iniciando conexão com DB...");
// Em um app real: await db.connect();
setTimeout(() => {
  isReady = true;
  console.log("DB Conectado. Aplicação pronta.");
}, 2000); // Simula 2s de delay para iniciar

// Servidor HTTP usando Deno.serve (Deno 2.x nativo)
const server = Deno.serve({ port: PORT }, async (req) => {
  const url = new URL(req.url);

  // 1. Middleware de Segurança (Security Headers)
  // Adiciona headers importantes para prevenir ataques XSS, Clickjacking, etc.
  const headers = new Headers({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy": "default-src 'self'",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  });

  // 2. Health Check (Liveness/Readiness Probes)
  // Usado por Load Balancers (AWS ALB, K8s, Nginx)
  if (url.pathname === "/health") {
    // Se estiver desligando, retorna 503 (Service Unavailable)
    // para que o LB pare de mandar tráfego novo.
    if (isShuttingDown) {
      return new Response("Shutting down", { status: 503, headers });
    }
    // Se ainda não conectou no DB, retorna 503.
    if (!isReady) {
      return new Response("Starting up", { status: 503, headers });
    }
    // Tudo OK
    return new Response("OK", { status: 200, headers });
  }

  // 3. Rotas da Aplicação
  if (url.pathname === "/") {
    return new Response("Hello Production! Deno 2.x is running.", { 
      status: 200, 
      headers 
    });
  }

  // 4. Tratamento de Erro (404)
  return new Response("Not Found", { status: 404, headers });
});

// 5. Graceful Shutdown
// Escuta sinais do Sistema Operacional
// SIGINT = Ctrl+C (Terminal)
// SIGTERM = docker stop (Orquestrador)
const shutdown = async () => {
  console.log("\nSinal de desligamento recebido...");
  
  // Marca flag para o Health Check começar a falhar
  isShuttingDown = true; 
  isReady = false; 

  console.log("Fechando servidor HTTP (esperando requisições ativas)...");
  await server.shutdown(); // Espera requisições pendentes terminarem

  console.log("Fechando conexões com Banco de Dados...");
  // await db.close();

  console.log("Aplicação encerrada com sucesso.");
  Deno.exit(0);
};

Deno.addSignalListener("SIGINT", shutdown);
Deno.addSignalListener("SIGTERM", shutdown);

// Tratamento global de erros não capturados
globalThis.addEventListener("unhandledrejection", (e) => {
  console.error("ERRO CRÍTICO NÃO TRATADO:", e.reason);
  // Em alguns casos, pode ser melhor crashar o processo para o Docker reiniciar
  // Deno.exit(1);
});

console.log(`Servidor rodando na porta ${PORT}`);
