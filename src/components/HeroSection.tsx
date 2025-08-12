"use client";

import React, { useState, useEffect, useRef } from 'react';

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
              <p className="text-gray-200 text-sm mb-2">{new Date(latestPost.date).toLocaleDateString()}</p>
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
            "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." (John 3:16)
          </p>
          <h3 className="text-2xl font-lora font-bold mb-4">Today's Catholic Season</h3>
          <p>
            Ordinary Time
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
