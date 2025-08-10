import { notFound } from 'next/navigation';

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
  const res = await fetch(`https://santonino-nz.org/wp-json/wp/v2/posts?slug=${slug}&_embed`);
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch post');
  }
  const posts: Post[] = await res.json();
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
}

async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  const res = await fetch('https://santonino-nz.org/wp-json/wp/v2/posts?per_page=100'); // Fetch enough posts to get slugs
  if (!res.ok) {
    throw new Error('Failed to fetch post slugs');
  }
  const posts: Post[] = await res.json();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs;
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const decodeHtmlEntities = (html: string) => {
    return html
      .replace(/&#8211;/g, '–')
      .replace(/&/g, '&')
      .replace(/&nbsp;/g, ' ')
      .replace(/&#8217;/g, "'")
      .replace(/"/g, '"')
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
