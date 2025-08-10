import Image from "next/image";

async function getPosts() {
  const postsRes = await fetch('https://santonino-nz.org/wp-json/wp/v2/posts?_embed');
  if (!postsRes.ok) {
    throw new Error('Failed to fetch posts');
  }
  const posts = await postsRes.json();

  // Map over posts to include featured image URL if available
  const postsWithImages = posts.map((post: any) => {
    const imageUrlMatch = post.content.rendered.match(/<img[^>]+src="([^">]+)"/);
    const imageUrl = imageUrlMatch ? imageUrlMatch[1].replace(/&#038;/g, '&') : null;
    return {
      ...post,
      imageUrl: imageUrl,
    };
  });

  return postsWithImages;
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: any) => (
          <a
            key={post.id}
            href={post.link}
            className="block border border-gray-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 dark:border-neutral-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={post.title.rendered}
                width={600} // Adjust based on your design needs
                height={400} // Adjust based on your design needs
                className="w-full h-48 object-cover"
                priority={true}
              />
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">
              {post.title.rendered.replace(/&#8211;/g, '–').replace(/&/g, '&').replace(/&nbsp;/g, ' ').replace(/&#8217;/g, "'").replace(/"/g, '"')}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {post.excerpt.rendered.replace(/<[^>]*>/g, '').replace(/&#8211;/g, '–').replace(/&/g, '&').replace(/&hellip;/g, '...').replace(/&nbsp;/g, ' ').replace(/&#8217;/g, "'").replace(/"/g, '"')}
            </p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
