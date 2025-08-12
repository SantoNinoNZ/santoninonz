import { getSortedPostsData, Post } from '@/lib/posts';
import HomePageClient from '@/components/HomePageClient'; // New client component

export default async function Home() {
  const allPostsData = await getSortedPostsData();

  return (
    <HomePageClient initialPosts={allPostsData} />
  );
}
