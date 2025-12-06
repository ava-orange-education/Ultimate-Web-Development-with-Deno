import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";
import CommentForm from "../../islands/CommentForm.tsx";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  author: string;
  readTime: number;
  tags: string[];
}

interface PostPageData {
  post: BlogPost;
  notFound?: boolean;
}
// Mock data - in a real application, this would come from a database
const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "Introduction to Fresh Framework",
    content: `
      <h2>What is Fresh?</h2>
      <p>Fresh is a modern web framework developed specifically for Deno. Unlike other frameworks that were adapted to work with Deno, Fresh was built from the ground up to take full advantage of the runtime's unique capabilities.</p>

      <h2>Key Features</h2>
      <ul>
        <li><strong>Zero JavaScript on client by default</strong>: Pages are completely rendered on the server</li>
        <li><strong>Islands Architecture</strong>: Interactive components are loaded only when needed</li>
        <li><strong>Edge Ready</strong>: Designed to run on the edge with Deno Deploy</li>
        <li><strong>TypeScript First</strong>: Native TypeScript support from the beginning</li>
      </ul>

      <h2>Why Choose Fresh?</h2>
      <p>Fresh is ideal for applications where performance is critical and you want the minimum JavaScript possible on the client. Its "zero JavaScript by default" approach results in extremely fast loading times and better SEO.</p>
    `,
    excerpt: "Learn the fundamental concepts of Fresh and why it's different from other frameworks.",
    slug: "introduction-to-fresh-framework",
    publishedAt: "2024-01-15",
    author: "John Smith",
    readTime: 5,
    tags: ["fresh", "deno", "ssr", "web-development"],
  },
  {
    id: "2",
    title: "SSR vs CSR: Which to Choose?",
    content: `
      <h2>Understanding Rendering Approaches</h2>
      <p>In modern web development, we have two main approaches for rendering content: Server-Side Rendering (SSR) and Client-Side Rendering (CSR). Each has its advantages and disadvantages, and the choice depends on the specific project requirements.</p>

      <h3>Server-Side Rendering (SSR)</h3>
      <p>In SSR, the complete HTML is generated on the server before being sent to the client. This means the browser receives content ready for display.</p>

      <h4>SSR Advantages:</h4>
      <ul>
        <li>Better SEO - search engines index content more easily</li>
        <li>Perceived performance - content visible immediately</li>
        <li>Works without JavaScript</li>
        <li>Better for static or semi-static content</li>
      </ul>

      <h3>Client-Side Rendering (CSR)</h3>
      <p>In CSR, the browser receives minimal HTML and uses JavaScript to build the interface. Frameworks like React, Vue and Angular follow this approach.</p>

      <h4>CSR Advantages:</h4>
      <ul>
        <li>Rich interactivity after initial loading</li>
        <li>Better user experience for complex applications</li>
        <li>Lower server load after initial loading</li>
        <li>Ideal for dashboards and highly interactive applications</li>
      </ul>
    `,
    excerpt: "A detailed comparison between Server-Side Rendering and Client-Side Rendering.",
    slug: "ssr-vs-csr-which-to-choose",
    publishedAt: "2024-01-10",
    author: "Maria Johnson",
    readTime: 8,
    tags: ["ssr", "csr", "rendering", "performance", "seo"],
  },
];


export const handler = define.handlers({
  GET(ctx) {
    const { slug } = ctx.params;
    const post = mockPosts.find(p => p.slug === slug);

    if (!post) {
      return { data: { post: {} as BlogPost, notFound: true } };
    }
    return { data: { post } };
  },
});

interface PostPageProps {
  data: PostPageData;
  url: URL
}

export default define.page<typeof handler>(function Post(props: PostPageProps) {

  const { data, url } = props;

  if (data.notFound) {
    return (
      <div class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p class="text-gray-600 mb-8">The post you are looking for does not exist.</p>
          <a href="/blog" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Back to Blog
          </a>
        </div>
      </div>
    );
  }

  const canonicalUrl = `${url.origin}${url.pathname}`;
  const { post } = data;
  return (
    <>
      <Head>
        <title>{post.title} - Fresh Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph tags for social media */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:author" content={post.author} />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
      </Head>

      <div class="min-h-screen bg-gray-50">
        {/* Header */}
        <header class="bg-white shadow-sm">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-6">
              <div class="flex items-center">
                <a href="/" class="text-2xl font-bold text-gray-900">Fresh Blog</a>
              </div>
              <nav class="flex space-x-8">
                <a href="/" class="text-gray-500 hover:text-blue-600 font-medium">Home</a>
                <a href="/blog" class="text-gray-500 hover:text-blue-600 font-medium">Blog</a>
                <a href="/about" class="text-gray-500 hover:text-blue-600 font-medium">About</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <article class="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Article header */}
            <header class="px-8 py-12 border-b border-gray-200">
              <div class="text-center">
                <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                  {post.title}
                </h1>
                <div class="mt-6 flex flex-wrap justify-center items-center gap-4 text-gray-600">
                  <span class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {post.author}
                  </span>
                  <time class="flex items-center" dateTime={post.publishedAt}>
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(post.publishedAt).toLocaleDateString('en-US')}
                  </time>
                  <span class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {post.readTime} min read
                  </span>
                </div>
                <div class="mt-4 flex flex-wrap justify-center gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            {/* Article content */}
            <div class="px-8 py-12 prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </article>
          <CommentForm postId={post.id} />
        </main>
      </div>
    </>
  );
});
