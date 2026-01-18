import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Deno Next.js Dinosaurs",
  description: "A simple full stack app built with Next.js and Deno 2.x",
};

export default function RootLayout(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <h1 className="text-lg font-semibold tracking-tight">
              Deno + Next.js Dinosaurs
            </h1>
            <span className="text-xs text-slate-400">
              Full stack app with Deno 2.x
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8">
          {children}
        </main>

        <footer className="border-t border-slate-800 bg-slate-900/80 mt-12">
          <div className="mx-auto max-w-5xl px-4 py-4 text-xs text-slate-500 flex justify-between">
            <span>Built with Next.js and Deno 2.x</span>
            <span>Example project for a web development with Deno book</span>
          </div>
        </footer>
      </body>
    </html>
  );
}

