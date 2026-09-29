import { Head } from "fresh/runtime";
import { define } from "../utils.ts";

export default define.page(function About() {
  return (
    <>
      <Head>
        <title>About - Fresh Blog</title>
        <meta
          name="description"
          content="About the Fresh Blog, a sample application built with Deno and Fresh."
        />
      </Head>

      <div class="min-h-screen bg-gray-50">
        {/* Shared header */}
        <header class="bg-white shadow-sm">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-6">
              <div class="flex items-center">
                <a href="/" class="text-2xl font-bold text-gray-900">
                  Fresh Blog
                </a>
              </div>
              <nav class="flex space-x-8">
                <a
                  href="/"
                  class="text-gray-500 hover:text-blue-600 font-medium"
                >
                  Home
                </a>
                <a
                  href="/blog"
                  class="text-gray-500 hover:text-blue-600 font-medium"
                >
                  Blog
                </a>
                <a
                  href="/about"
                  class="text-gray-900 hover:text-blue-600 font-medium"
                >
                  About
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main class="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <article class="bg-white rounded-lg shadow-md p-8">
            <h1 class="text-4xl font-extrabold text-gray-900 mb-6">
              About this blog
            </h1>
            <p class="text-gray-700 mb-4">
              Fresh Blog is the sample application used throughout this chapter.
              It is built with Deno, Fresh and Tailwind CSS to demonstrate
              server-side rendering with islands.
            </p>
            <p class="text-gray-700">
              Every route is rendered on the server, and only the interactive
              parts, such as the comment form, ship JavaScript to the browser.
            </p>
          </article>
        </main>
      </div>
    </>
  );
});
