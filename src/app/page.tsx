import { getSortedPostsData, Post } from '@/lib/posts';
import HomePageClient from '@/components/HomePageClient';
import { getSortedEventsData, Event } from '@/lib/events'; // Import Event type

export default async function Home() {
  const allPostsData = await getSortedPostsData();
  const allEventsData = await getSortedEventsData(); // Fetch events

  return (
    <HomePageClient initialPosts={allPostsData} upcomingEvents={allEventsData} />
  );
}
