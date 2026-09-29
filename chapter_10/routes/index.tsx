import { Head } from "fresh/runtime";
import { define } from "../utils.ts";

// Interface for home page data
interface HomeData {
  title: string;
  description: string;
  featuredPosts: Array<{
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    publishedAt: string;
  }>;
}
// Handler to fetch data (executed on server)
// It works like a middleware, but it's executed only once per request and it is used to enrich
// the data before passing it to the component
export const handler = define.handlers({
  GET(ctx) {
    const homeData: HomeData = {
      title: "My Fresh Blog",
      description: "A modern blog built with Deno Fresh and Tailwind CSS",
      featuredPosts: [
        {
          id: "1",
          title: "Introduction to Fresh Framework",
          excerpt: "Learn the fundamental concepts of Fresh and why it's different from other frameworks.",
          slug: "introduction-to-fresh-framework",
          publishedAt: "2024-01-15",
        },
        {
          id: "2",
          title: "SSR vs CSR: Which to Choose?",
          excerpt: "A detailed comparison between Server-Side Rendering and Client-Side Rendering.",
          slug: "ssr-vs-csr-which-to-choose",
          publishedAt: "2024-01-10",
        },
      ],
    };

    // This data will be passed to the Home component as props
    return { data: homeData };
  },
});

// This data will be passed to the Home component as props
interface HomeProps {
  data: HomeData;
}

// This page wrapper uses data coming from the handler function
// and passes it to the Home component as props
// and returns the rendered component
export default define.page<typeof handler>(function Home(props: HomeProps) {

  // Here we extract the data from the props
  const { data } = props;
  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
      </Head>

      <div class="min-h-screen bg-gray-50">
        {/* Header */}
        <header class="bg-white shadow-sm">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-6">
              <div class="flex items-center">
                <h1 class="text-2xl font-bold text-gray-900">Fresh Blog</h1>
              </div>
              <nav class="flex space-x-8">
                <a href="/" class="text-gray-900 hover:text-blue-600 font-medium">Home</a>
                <a href="/blog" class="text-gray-500 hover:text-blue-600 font-medium">Blog</a>
                <a href="/about" class="text-gray-500 hover:text-blue-600 font-medium">About</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section class="bg-white">
          <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <div class="text-center">
              <h2 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                {data.title}
              </h2>
              <p class="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                {data.description}
              </p>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-8">Featured Posts</h3>
          <div class="grid gap-8 md:grid-cols-2">
            {data.featuredPosts.map((post) => (
              <article key={post.id} class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div class="p-6">
                  <h4 class="text-xl font-semibold text-gray-900 mb-2">
                    <a href={`/blog/${post.slug}`} class="hover:text-blue-600">
                      {post.title}
                    </a>
                  </h4>
                  <p class="text-gray-600 mb-4">{post.excerpt}</p>
                  <div class="flex justify-between items-center">
                    <time class="text-sm text-gray-500" dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString('en-US')}
                    </time>
                    <a href={`/blog/${post.slug}`} class="text-blue-600 hover:text-blue-800 font-medium">
                      Read more →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
});
