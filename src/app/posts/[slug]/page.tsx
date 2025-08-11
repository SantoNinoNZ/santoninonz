import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import yaml from 'js-yaml';
import Image from 'next/image';
import Link from 'next/link';

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
    interface FrontMatter {
      title: string;
      date: string;
      imageUrl?: string; // Add imageUrl to FrontMatter interface
      [key: string]: unknown;
    }

    let frontMatter: FrontMatter = { title: '', date: '' };
    let markdownContent = fileContent;

    if (frontMatterMatch && frontMatterMatch[1]) {
      frontMatter = yaml.load(frontMatterMatch[1]) as FrontMatter;
      markdownContent = fileContent.substring(frontMatterMatch[0].length);
    }

    const processedContent = await remark().use(html).process(markdownContent);
    const contentHtml = processedContent.toString();

    let imageUrl = (frontMatter.imageUrl as string) || undefined;

    // Ensure local image URLs are correctly prefixed for static assets
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
      imageUrl = `/posts/${imageUrl}`;
    }

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
  const slug = params.slug as string;
  const post = await getPostContent(slug);

  if (!post) {
    notFound();
  }

  const allSlugs = await getAllPostSlugs();
  const sortedSlugs = allSlugs.sort((a, b) => {
    // Assuming slugs are sortable by date or some inherent order for next/prev
    // For now, a simple string comparison or index-based sorting
    return a.slug.localeCompare(b.slug);
  });

  const currentIndex = sortedSlugs.findIndex(s => s.slug === slug);
  const previousPost = currentIndex > 0 ? sortedSlugs[currentIndex - 1] : null;
  const nextPost = currentIndex < sortedSlugs.length - 1 ? sortedSlugs[currentIndex + 1] : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-md">
      <h1 className="text-4xl md:text-5xl font-lora font-bold mb-4 text-[#2B1E1A] leading-tight">
        {post.title}
      </h1>
      <p className="text-gray-600 text-sm mb-6 font-roboto">Published on: {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      {post.imageUrl && (
        <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg shadow-md mb-8">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div
        className="prose prose-lg max-w-none text-[#2B1E1A] font-roboto"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      {/* Next/Previous Post Navigation */}
      <nav className="flex justify-between mt-12 pt-8 border-t border-gray-200">
        {previousPost && (
          <Link href={`/posts/${previousPost.slug}`} className="text-[#861D1D] hover:text-[#F4B34C] transition-colors duration-300 font-semibold">
            &larr; Previous Post
          </Link>
        )}
        {nextPost && (
          <Link href={`/posts/${nextPost.slug}`} className="text-[#861D1D] hover:text-[#F4B34C] transition-colors duration-300 font-semibold ml-auto">
            Next Post &rarr;
          </Link>
        )}
      </nav>
    </div>
  );
}
