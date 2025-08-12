"use client";

import React, { useState, useEffect } from 'react';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  imageUrl?: string;
  contentHtml?: string;
}

interface HeroSectionProps {
  latestPost: Post | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ latestPost }) => {
  const [gospelReading, setGospelReading] = useState<string>("");
  const [liturgicalSeason, setLiturgicalSeason] = useState<string>("");

  useEffect(() => {
    const fetchLiturgyData = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        // Fetch liturgical season
        const seasonResponse = await fetch(`https://liturgy.day/api/day/${formattedDate}`);
        const seasonData = await seasonResponse.json();
        if (seasonData && seasonData.season) {
          setLiturgicalSeason(seasonData.season);
        }

        // Placeholder for gospel reading - will need to find a suitable API or scraping method
        setGospelReading("Loading gospel reading...");

      } catch (error) {
        console.error("Failed to fetch liturgy data:", error);
        setLiturgicalSeason("N/A");
        setGospelReading("Failed to load gospel reading.");
      }
    };

    fetchLiturgyData();
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-screen-xl px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
        {/* Left Column: Latest Post */}
        <div className="relative group bg-white/10 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-2xl font-lora font-bold mb-4">Latest Post</h3>
          {latestPost && (
            <a href={`/posts/${latestPost.slug}`} className="block">
              <h4 className="text-xl font-bold group-hover:text-gray-300 transition-colors duration-300">{latestPost.title}</h4>
              <p className="text-gray-200 text-sm mb-2">{new Date(latestPost.date.split('/').reverse().join('-')).toLocaleString('en-NZ', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-gray-100">{latestPost.excerpt || 'Click to read more...'}</p>
              {/* Transparent overlay on hover */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></div>
            </a>
          )}
        </div>

        {/* Right Column: Today's Gospel Reading and Catholic Season */}
        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-lora font-bold mb-4">Today's Gospel Reading</h3>
          <p className="mb-4">
            {gospelReading}
          </p>
          <h3 className="text-2xl font-lora font-bold mb-4">Today's Catholic Season</h3>
          <p>
            {liturgicalSeason}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
