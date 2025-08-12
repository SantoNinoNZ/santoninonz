"use client";

import React, { useState, useEffect, useRef } from 'react';

const HeroSection: React.FC = () => {
  const videoSlides = [
    { src: "/assets/moving-images/video00.mp4", duration: 8 }, // Assuming video00.mp4 exists
    { src: "/assets/moving-images/video01.mp4", duration: 8 },
    { src: "/assets/moving-images/video02.mp4", duration: 92 }, // 1 min 32 seconds = 92 seconds
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleVideoEnd = () => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoSlides.length);
    };

    videoElement.addEventListener('ended', handleVideoEnd);

    // Play the video when the index changes
    videoElement.load(); // Reload video to ensure it plays from start
    videoElement.play().catch(error => console.error("Video play failed:", error));

    return () => {
      videoElement.removeEventListener('ended', handleVideoEnd);
    };
  }, [currentVideoIndex, videoSlides.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        ref={videoRef}
        src={videoSlides[currentVideoIndex].src}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
      >
        Your browser does not support the video tag.
      </video>
      {/* Optional: Add an overlay for text readability if needed */}
      {/* <div className="absolute inset-0 bg-black opacity-30"></div> */}
    </div>
  );
};

export default HeroSection;
