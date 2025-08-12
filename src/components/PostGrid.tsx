"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

import { Post } from '@/lib/posts'; // Import Post interface from lib/posts

// Helper function to safely format dates
function formatPostDate(dateString: string): string {
  try {
    // Attempt to parse dd/mm/yyyy format
    const parts = dateString.split('/');
    let date: Date;
    if (parts.length === 3) {
      // Reassemble to YYYY-MM-DD for consistent parsing
      const isoDateString = `${parts[2]}-${parts[1]}-${parts[0]}`;
      date = new Date(isoDateString);
    } else {
      // Fallback for other formats or if it's already YYYY-MM-DD
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) {
      return 'N/A'; // Return 'N/A' for invalid dates
    }
    return date.toLocaleString('en-NZ', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'N/A';
  }
}

function decodeHtmlEntities(htmlString: string) {
  return htmlString
    .replace(/&#8211;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")
    .replace(/"/g, '"')
    .replace(/&hellip;/g, '...');
}

interface PostGridProps {
  initialPosts: Post[];
}

const POSTS_PER_LOAD = 12;

export default function PostGrid({ initialPosts }: PostGridProps) {
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>(initialPosts.slice(0, POSTS_PER_LOAD));
  const [nextPageIndex, setNextPageIndex] = useState(POSTS_PER_LOAD);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length > POSTS_PER_LOAD);
  const loader = useRef(null);

  useEffect(() => {
    setDisplayedPosts(initialPosts.slice(0, POSTS_PER_LOAD));
    setNextPageIndex(POSTS_PER_LOAD);
    setHasMore(initialPosts.length > POSTS_PER_LOAD);
  }, [initialPosts]);

  const loadMorePosts = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    const newPosts = initialPosts.slice(nextPageIndex, nextPageIndex + POSTS_PER_LOAD);
    setDisplayedPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setNextPageIndex((prevIndex) => prevIndex + POSTS_PER_LOAD);
    setHasMore(nextPageIndex + POSTS_PER_LOAD < initialPosts.length);
    setLoading(false);
  }, [loading, hasMore, nextPageIndex, initialPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          loadMorePosts();
        }
      },
      {
        root: null,
        rootMargin: "20px",
        threshold: 1.0,
      }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [hasMore, loading, loadMorePosts]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {displayedPosts.map((post: Post) => (
        <Link
          key={post.slug}
          href={`/posts/${post.slug}`}
          className="block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/10 group"
        >
          {post.imageUrl && (
            <div className="relative w-full h-48">
              <img
                src={post.imageUrl}
                alt={decodeHtmlEntities(post.title)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          <div className="p-6">
            <h3 className="text-xl font-lora font-semibold mb-2 text-white group-hover:text-gray-300 transition-colors duration-300">
              {decodeHtmlEntities(post.title)}
            </h3>
            <p className="text-sm font-roboto text-gray-100 mb-4">
              {decodeHtmlEntities(post.excerpt || '')}
            </p>
            <p className="text-xs font-roboto text-gray-200">
              {formatPostDate(post.date)}
            </p>
          </div>
        </Link>
      ))}
      {loading && <p className="text-center text-gray-600 mt-8 col-span-full">Loading more posts...</p>}
      {!hasMore && !loading && displayedPosts.length > 0 && <p className="text-center text-gray-600 mt-8 col-span-full">You've reached the end of the posts!</p>}
      <div ref={loader} className="h-1 col-span-full"></div> {/* Invisible element to trigger IntersectionObserver */}
    </div>
  );
}
