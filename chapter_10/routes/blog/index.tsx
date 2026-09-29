import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  author: string;
  readTime: number;
}

interface BlogPageData {
  posts: BlogPost[];
  totalPosts: number;
}

// Mock data - in a real application, this would come from a database
const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "Introduction to Fresh Framework",
    excerpt: "Learn the fundamental concepts of Fresh and why it's different from other frameworks.",
    slug: "introduction-to-fresh-framework",
    publishedAt: "2024-01-15",
    author: "John Smith",
    readTime: 5,
  },
  {
    id: "2",
    title: "SSR vs CSR: Which to Choose?",
    excerpt: "A detailed comparison between Server-Side Rendering and Client-Side Rendering.",
    slug: "ssr-vs-csr-which-to-choose",
    publishedAt: "2024-01-10",
    author: "Maria Johnson",
    readTime: 8,
  },
  {
    id: "3",
    title: "Mastering Tailwind CSS",
    excerpt: "How to use Tailwind CSS to create modern and responsive interfaces.",
    slug: "mastering-tailwind-css",
    publishedAt: "2024-01-05",
    author: "Peter Wilson",
    readTime: 6,
  },
];


export const handler = define.handlers({
  GET(ctx) {
    const blogData: BlogPageData = {
      posts: mockPosts,
      totalPosts: mockPosts.length,
    };

    return { data: blogData };
  },
});

interface BlogPageProps {
  data: BlogPageData;
}

export default define.page<typeof handler>(function Blog(props: BlogPageProps) {

  const { data } = props;
  return (
    <>
      <Head>
        <title>Blog - Fresh Blog</title>
        <meta name="description" content="All posts from our blog about web development with Deno and Fresh." />
      </Head>

      <div class="min-h-screen bg-gray-50">
        {/* Shared header - in a real application, this would be a component */}
        <header class="bg-white shadow-sm">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-6">
              <div class="flex items-center">
                <a href="/" class="text-2xl font-bold text-gray-900">Fresh Blog</a>
              </div>
              <nav class="flex space-x-8">
                <a href="/" class="text-gray-500 hover:text-blue-600 font-medium">Home</a>
                <a href="/blog" class="text-gray-900 hover:text-blue-600 font-medium">Blog</a>
                <a href="/about" class="text-gray-500 hover:text-blue-600 font-medium">About</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Our Blog
            </h1>
            <p class="mt-4 text-xl text-gray-600">
              {data.totalPosts} articles about web development, Deno and Fresh
            </p>
          </div>

          {/* Posts grid */}
          <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.posts.map((post) => (
              <article key={post.id} class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div class="p-6">
                  <div class="flex justify-between items-start mb-4">
                    <h2 class="text-xl font-semibold text-gray-900">
                      <a
                        href={`/blog/${post.slug}`}
                        class="hover:text-blue-600 transition-colors"
                      >
                        {post.title}
                      </a>
                    </h2>
                  </div>

                  <p class="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div class="flex justify-between items-center text-sm text-gray-500">
                    <span>{post.author}</span>
                    <div class="flex items-center space-x-4">
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US')}
                      </time>
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>

                  <div class="mt-4">
                    <a
                      href={`/blog/${post.slug}`}
                      class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read full article
                      <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </>
  );
});
