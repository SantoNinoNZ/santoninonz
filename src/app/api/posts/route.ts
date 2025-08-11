import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import yaml from 'js-yaml';
import { remark } from 'remark';
import html from 'remark-html';

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering for API route

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  imageUrl?: string;
}

async function getPostsIndex(): Promise<Post[]> {
  const indexPath = path.join(process.cwd(), 'public', 'posts-index.json');
  const fileContent = await fs.readFile(indexPath, 'utf8');
  return JSON.parse(fileContent);
}

async function getPostContent(slug: string): Promise<Post> {
  const filePath = path.join(process.cwd(), 'public', 'posts', `${slug}.md`);
  const fileContent = await fs.readFile(filePath, 'utf8');

  interface FrontMatter {
    title: string;
    date: string;
    [key: string]: unknown; // Allow other properties
  }

  const frontMatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---/);
  let frontMatter: FrontMatter = { title: '', date: '' }; // Initialize with default values
  let markdownContent = fileContent;

  if (frontMatterMatch && frontMatterMatch[1]) {
    frontMatter = yaml.load(frontMatterMatch[1]) as FrontMatter;
    markdownContent = fileContent.substring(frontMatterMatch[0].length);
  }

  const firstParagraphMatch = markdownContent.match(/^(.*?)\n\n/s);
  const rawExcerpt = firstParagraphMatch ? firstParagraphMatch[1].trim() : markdownContent.split('\n')[0].trim();

  const processedContent = await remark().use(html).process(markdownContent);
  const contentHtml = processedContent.toString();

  const imageUrlMatch = contentHtml.match(/<img[^>]+src="([^">]+)"/);
  const imageUrl = imageUrlMatch ? imageUrlMatch[1] : null;

  return {
    slug,
    title: frontMatter.title || slug,
    date: frontMatter.date || '',
    excerpt: rawExcerpt,
    imageUrl: imageUrl || undefined,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10); // Default limit to 12 posts per page

  try {
    const postsIndex = await getPostsIndex();

    // Sort posts by date in descending order
    const sortedPosts = postsIndex.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSlugs = sortedPosts.slice(startIndex, endIndex).map(post => post.slug);

    const postsPromises = paginatedSlugs.map(slug => getPostContent(slug));
    const posts = await Promise.all(postsPromises);

    const hasMore = endIndex < sortedPosts.length;

    return NextResponse.json({ posts, hasMore });
  } catch (error) {
    console.error('Error in API route /api/posts:', error);
    return NextResponse.json({ error: `Failed to fetch posts: ${(error as Error).message}` }, { status: 500 });
  }
}