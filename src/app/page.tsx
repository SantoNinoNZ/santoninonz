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
}

function decodeHtmlEntities(htmlString: string) {
  return htmlString
    .replace(/&#8211;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")
    .replace(/"/g, '"')
    .replace(/&hellip;/g, '...');
}

const POSTS_PER_PAGE = 12; // Define how many posts to load per page

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  const fetchPosts = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts?page=${pageNumber}&limit=${POSTS_PER_PAGE}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Assuming the first post is always the featured one and should not be duplicated in the grid
      // This logic needs to be refined if the API doesn't guarantee the first post is always the featured one.
      // For now, we'll filter out the first post if it's already in the `posts` state (as the featured post).
      const newPosts = data.posts.filter((newPost: Post) => !posts.some(existingPost => existingPost.slug === newPost.slug));
      
      setPosts((prevPosts) => {
        // If it's the first page, set the posts directly. Otherwise, append.
        if (pageNumber === 1) {
          return data.posts;
        }
        return [...prevPosts, ...newPosts];
      });
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setHasMore(false); // Stop trying to load more if there's an error
    } finally {
      setLoading(false);
    }
  }, [posts]); // Dependency on `posts` to filter out duplicates

  useEffect(() => {
    fetchPosts(1); // Fetch initial posts on component mount
  }, [fetchPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1);
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
  }, [hasMore, loading]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page, fetchPosts]);

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const otherPosts = posts.slice(1);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {otherPosts.map((post: Post) => (
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
                  {new Date(post.date).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {loading && <p className="text-center text-gray-600 mt-8">Loading more posts...</p>}
        {!hasMore && !loading && posts.length > 0 && <p className="text-center text-gray-600 mt-8">You've reached the end of the posts!</p>}
        <div ref={loader} className="h-1"></div> {/* Invisible element to trigger IntersectionObserver */}
      </section>
    </main>
  );
}
