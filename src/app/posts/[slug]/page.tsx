import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import yaml from 'js-yaml';
import Image from 'next/image'; // Import Image component

interface Post {
  slug: string;
  title: string;
  date: string;
  contentHtml: string;
  imageUrl?: string;
}

async function getPostContent(slug: string): Promise<Post | null> {
  const filePath = path.join(process.cwd(), 'public', 'posts', `${slug}.md`);
  
  try {
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

    const processedContent = await remark().use(html).process(markdownContent);
    const contentHtml = processedContent.toString();

    // Extract first image as imageUrl
    const imageUrlMatch = contentHtml.match(/<img[^>]+src="([^">]+)"/);
    const imageUrl = imageUrlMatch ? imageUrlMatch[1] : null;

    return {
      slug,
      title: frontMatter.title || slug,
      date: frontMatter.date || '',
      contentHtml,
      imageUrl: imageUrl || undefined,
    };
  } catch (error) {
    console.error(`Error reading or parsing post ${slug}:`, error);
    return null;
  }
}

async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  const indexPath = path.join(process.cwd(), 'public', 'posts-index.json');
  try {
    const fileContent = await fs.readFile(indexPath, 'utf8');
    const postsIndex: { slug: string; title: string; date: string }[] = JSON.parse(fileContent);
    return postsIndex.map(post => ({ slug: post.slug }));
  } catch (error) {
    console.error('Error reading posts-index.json:', error);
    return [];
  }
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getAllPostSlugs();
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  // Explicitly cast params.slug to string to satisfy TypeScript if needed
  const slug = params.slug as string;
  const post = await getPostContent(slug);

  if (!post) {
    notFound();
  }

  // Removed decodeHtmlEntities function and its usage for title and alt text
  // Assuming remark-html handles most entities, or titles are clean.
  // If entities still appear, a different decoding strategy will be needed.

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4 text-[#2B1E1A]">
        {post.title}
      </h1>
      <p className="text-gray-600 mb-6">Published on: {new Date(post.date).toLocaleDateString()}</p>
      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={900} // Adjust based on your design needs
          height={600} // Adjust based on your design needs
          className="w-full h-auto max-h-96 object-cover mb-8 rounded-lg shadow-md"
          priority={true}
        />
      )}
      <div
        className="prose lg:prose-xl text-[#2B1E1A]"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </div>
  );
}
