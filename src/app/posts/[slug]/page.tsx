import { notFound } from 'next/navigation';

async function fetchWithRetry<T>(url: string, retries = 5, delay = 2000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      } else {
        console.warn(`Fetch failed for ${url}, status: ${res.status}. Retrying...`);
      }
    } catch (error) {
      console.error(`Fetch error for ${url}: ${error}. Retrying...`);
    }
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries.`);
}

interface Post {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  date: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      media_details?: {
        sizes?: {
          medium?: {
            source_url: string;
          };
        };
      };
      source_url?: string;
    }>;
  };
  imageUrl?: string | null;
}

async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const posts: Post[] = await fetchWithRetry(`https://santonino-nz.org/wp-json/wp/v2/posts?slug=${slug}&_embed`);
    if (posts.length === 0) {
      return null;
    }

    const post = posts[0];
    const imageUrlMatch = post.content.rendered.match(/<img[^>]+src="([^">]+)"/);
    const imageUrl = imageUrlMatch ? imageUrlMatch[1].replace(/&#038;/g, '&') : null;

    return {
      ...post,
      imageUrl: imageUrl,
    };
  } catch (_error) { // Renamed to _error to suppress ESLint warning
    throw new Error('Failed to fetch post');
  }
}

async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  try {
    const posts: Post[] = await fetchWithRetry('https://santonino-nz.org/wp-json/wp/v2/posts?per_page=10'); // Reduced to 10 for build stability
    return posts.map(post => ({ slug: post.slug }));
  } catch (_error) { // Renamed to _error to suppress ESLint warning
    throw new Error('Failed to fetch post slugs');
  }
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs;
}

interface PageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: { slug: string } & Promise<any>;
}

export default async function PostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const decodeHtmlEntities = (html: string) => {
    return html
      .replace(/&#8211;/g, '–')
      .replace(/&/g, '&') // Corrected from & to &
      .replace(/&nbsp;/g, ' ')
      .replace(/&#8217;/g, "'")
      .replace(/"/g, '"') // Corrected from " to "
      .replace(/&hellip;/g, '...');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4 text-[#2B1E1A]">
        {decodeHtmlEntities(post.title.rendered)}
      </h1>
      <p className="text-gray-600 mb-6">Published on: {new Date(post.date).toLocaleDateString()}</p>
      {post.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.imageUrl}
          alt={decodeHtmlEntities(post.title.rendered)}
          className="w-full h-auto max-h-96 object-cover mb-8 rounded-lg shadow-md"
        />
      )}
      <div
        className="prose lg:prose-xl text-[#2B1E1A]"
        dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(post.content.rendered) }}
      />
    </div>
  );
}
