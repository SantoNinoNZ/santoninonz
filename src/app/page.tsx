import Image from "next/image";
import Link from "next/link";
import { promises as fs } from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import yaml from 'js-yaml';
import PostGrid from "@/components/PostGrid";

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

  interface FrontMatter {
    title: string;
    date: string;
    [key: string]: unknown;
  }

  const frontMatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---/);
  let frontMatter: FrontMatter = { title: '', date: '' };
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
  const allPostsData = await getPostsIndex();

  // Sort all posts by date in descending order
  const sortedAllPosts = allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Fetch full content for all posts at build time
  const postsWithContentPromises = sortedAllPosts.map(post => getPostContent(post.slug));
  const allPosts = await Promise.all(postsWithContentPromises);

  const featuredPost = allPosts.length > 0 ? allPosts[0] : null;
  const otherPosts = allPosts.slice(1);

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      {featuredPost && (
        <section className="relative w-full h-[500px] overflow-hidden mb-12">
          {featuredPost.imageUrl && (
            <Image
              src={featuredPost.imageUrl}
              alt={decodeHtmlEntities(featuredPost.title)}
              fill
              style={{ objectFit: 'cover' }}
              className="z-0"
              priority={true}
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-center p-8 z-10">
            <div className="max-w-3xl text-white">
              <h2 className="text-5xl font-lora font-bold mb-4 leading-tight">
                {decodeHtmlEntities(featuredPost.title)}
              </h2>
              <p className="text-xl font-roboto mb-6 opacity-90">
                {decodeHtmlEntities(featuredPost.excerpt || '')}
              </p>
              <Link href={`/posts/${featuredPost.slug}`} className="inline-block bg-[#F4B34C] text-[#2B1E1A] font-bold py-3 px-8 rounded-full hover:bg-[#E8E2D1] transition-colors duration-300">
                Read More
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Other Articles Grid */}
      <section className="w-full max-w-screen-xl px-4">
        <h2 className="text-4xl font-lora font-bold text-[#2B1E1A] mb-8 text-center">Latest Articles</h2>
        <PostGrid initialPosts={otherPosts} />
      </section>
    </main>
  );
}
