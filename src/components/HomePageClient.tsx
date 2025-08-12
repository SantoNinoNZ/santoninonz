"use client";

import { useState } from 'react';
import PostGrid from "@/components/PostGrid";
import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";
import { Post } from '@/lib/posts';

interface HomePageClientProps {
  initialPosts: Post[];
}

const HomePageClient: React.FC<HomePageClientProps> = ({ initialPosts }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const latestPost = initialPosts.length > 0 ? initialPosts[0] : null;

  const filteredPosts = searchQuery
    ? initialPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : initialPosts;

  return (
    <main className="relative flex min-h-screen flex-col items-center pt-24">
      <Header onSearchChange={handleSearchChange} searchQuery={searchQuery} />

      {!searchQuery && <HeroSection latestPost={latestPost} />}

      <section className="w-full max-w-screen-xl px-4 py-12">
        <h2 className="text-4xl font-lora font-bold text-white mb-8 text-center">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Latest Articles"}
        </h2>
        <PostGrid initialPosts={filteredPosts} />
        {filteredPosts.length === 0 && searchQuery && (
          <p className="text-center text-white text-lg">No posts found matching your search.</p>
        )}
      </section>
    </main>
  );
};

export default HomePageClient;
