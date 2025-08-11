import Image from "next/image";
import { promises as fs } from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import yaml from 'js-yaml';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  imageUrl?: string;
  contentHtml?: string;
}

async function getPostsIndex(): Promise<Post[]> {
  const indexPath = path.join(process.cwd(), 'public', 'posts-index.json');
  const fileContent = await fs.readFile(indexPath, 'utf8');
  return JSON.parse(fileContent);
}

async function getPostContent(slug: string): Promise<Post> {
  const filePath = path.join(process.cwd(), 'public', 'posts', `${slug}.md`);
  const fileContent = await fs.readFile(filePath, 'utf8');

  const frontMatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---/);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let frontMatter: Record<string, any> = {};
  let markdownContent = fileContent;

  if (frontMatterMatch && frontMatterMatch[1]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    frontMatter = yaml.load(frontMatterMatch[1]) as Record<string, any>;
    markdownContent = fileContent.substring(frontMatterMatch[0].length);
  }

  // Extract excerpt from raw markdown content (first paragraph)
  const firstParagraphMatch = markdownContent.match(/^(.*?)\n\n/s);
  const rawExcerpt = firstParagraphMatch ? firstParagraphMatch[1].trim() : markdownContent.split('\n')[0].trim();

  const processedContent = await remark().use(html).process(markdownContent);
  const contentHtml = processedContent.toString();

  // Extract first image as imageUrl from processed HTML
  const imageUrlMatch = contentHtml.match(/<img[^>]+src="([^">]+)"/);
  const imageUrl = imageUrlMatch ? imageUrlMatch[1] : null;

  return {
    slug,
    title: frontMatter.title || slug,
    date: frontMatter.date || '',
    excerpt: rawExcerpt, // Use rawExcerpt directly
    imageUrl: imageUrl || undefined,
    contentHtml,
  };
}

function decodeHtmlEntities(htmlString: string) {
  return htmlString
    .replace(/&#8211;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")
    .replace(/"/g, '"')
    .replace(/&hellip;/g, '...');
}

export default async function Home() {
  const postsIndex = await getPostsIndex();

  // Fetch full content for each post in the index
  const postsPromises = postsIndex.map(post => getPostContent(post.slug));
  const posts = await Promise.all(postsPromises);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: Post) => (
          <a
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="block border border-gray-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
          >
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={decodeHtmlEntities(post.title)}
                width={600} // Adjust based on your design needs
                height={400} // Adjust based on your design needs
                className="w-full h-48 object-cover"
                priority={true}
              />
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-900">
                {decodeHtmlEntities(post.title)}
              </h2>
              {/* Render excerpt as plain text to avoid hydration issues */}
              <p className="text-sm text-gray-700">
                {decodeHtmlEntities(post.excerpt || '')}
              </p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
