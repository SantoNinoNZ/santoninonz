import { promises as fs } from 'fs';
import path from 'path';
import PostGrid from "@/components/PostGrid";
import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header"; // Import the new Header component

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

export default async function Home() {
  const allPostsData = await getPostsIndex();

  // Sort all posts by date in descending order
  const sortedAllPosts = allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const latestPost = sortedAllPosts.length > 0 ? sortedAllPosts[0] : null;
  const otherPosts = sortedAllPosts; // All posts will be displayed in the grid below the carousel

  return (
    <main className="relative flex min-h-screen flex-col items-center">
      <Header />
      <HeroSection latestPost={latestPost} />

      {/* Other Articles Grid */}
      <section className="w-full max-w-screen-xl px-4 py-12">
        <h2 className="text-4xl font-lora font-bold text-[#2B1E1A] mb-8 text-center">Latest Articles</h2>
        <PostGrid initialPosts={otherPosts} />
      </section>
    </main>
  );
}
