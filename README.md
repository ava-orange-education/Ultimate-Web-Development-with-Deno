# Ultimate Web Development with Deno

Companion source code for the book **Ultimate Web Development with Deno — Building Modern Web Applications with Deno**, published by [Orange AVA](https://orangeava.com/).

This repository holds the runnable code that accompanies the chapters of the book. Each chapter has its own directory (`chapter_6` to `chapter_16`) containing a self-contained Deno 2.x project or set of examples.

## About the Book

> Develop fast and secure apps with Deno, TypeScript and web technologies that scale.

The book is a practical tour of modern web development on the Deno runtime. It covers the runtime and its tooling, test automation, REST and GraphQL APIs, WebSockets, server-side rendering with Fresh, full-stack applications with Next.js, database integration, observability, deployment, and production case studies.

## Repository Structure

| Directory | Chapter |
| --- | --- |
| [`chapter_6`](chapter_6) | Test Automation |
| [`chapter_7`](chapter_7) | Building a RESTful API with Deno, NestJS and Hono |
| [`chapter_8`](chapter_8) | Building a GraphQL Server with Apollo Server |
| [`chapter_9`](chapter_9) | Building a WebSocket Server with Socket.io |
| [`chapter_10`](chapter_10) | Building a Server-Side Rendered (SSR) Web App with Fresh |
| [`chapter_11`](chapter_11) | Building a Full-Stack Web App with Next.js |
| [`chapter_12`](chapter_12) | Integrating with Databases |
| [`chapter_13`](chapter_13) | Observability and OpenTelemetry Integration |
| [`chapter_14`](chapter_14) | Deploying with Docker and Deno Deploy |
| [`chapter_15`](chapter_15) | The Post-Unix Era and Deno's Future |
| [`chapter_16`](chapter_16) | Deno in Production |

## Requirements

- [Deno](https://deno.com/) 2.x

Each chapter directory declares its own dependencies. Packages are resolved from [JSR](https://jsr.io/) where possible, falling back to NPM when a stable JSR release is not available.

## Running the Examples

Every runnable chapter ships a `deno.json` that declares the available tasks and the permissions they require. For example:

```bash
cd chapter_7/hono-api
deno task dev
```

Consult the `deno.json` of each chapter and the corresponding chapter text for the exact commands, environment variables and required permissions.

## Licence

Released under the MIT Licence. See [LICENSE](LICENSE).

## Links

- Publisher: [Orange AVA](https://orangeava.com/)
- Runtime: [Deno](https://deno.com/)
