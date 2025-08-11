"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  imageUrl?: string;
  contentHtml?: string; // contentHtml is not used in the grid, but kept for consistency
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
          className="block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white group"
        >
          {post.imageUrl && (
            <div className="relative w-full h-48">
              <Image
                src={post.imageUrl}
                alt={decodeHtmlEntities(post.title)}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 group-hover:scale-105"
                priority={true}
              />
            </div>
          )}
          <div className="p-6">
            <h3 className="text-xl font-lora font-semibold mb-2 text-gray-900 group-hover:text-[#861D1D] transition-colors duration-300">
              {decodeHtmlEntities(post.title)}
            </h3>
            <p className="text-sm font-roboto text-gray-700 mb-4">
              {decodeHtmlEntities(post.excerpt || '')}
            </p>
            <p className="text-xs font-roboto text-gray-500">
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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