"use client"; // Add "use client" directive

import React, { useState, useEffect, useRef } from 'react'; // Import React hooks
import type { Metadata } from "next";
import { Roboto, Lora } from "next/font/google";
import Link from "next/link"; // Import Link component
import "./globals.css";

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const lora = Lora({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const videoSlides = [
    { src: "/assets/moving-images/video00.mp4", duration: 8 },
    { src: "/assets/moving-images/video01.mp4", duration: 8 },
    { src: "/assets/moving-images/video02.mp4", duration: 92 },
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const previousVideoIndex = useRef<number | null>(null);

  useEffect(() => {
    // Initialize videoRefs array with nulls
    videoRefs.current = videoRefs.current.slice(0, videoSlides.length);
    for (let i = 0; i < videoSlides.length; i++) {
      if (!videoRefs.current[i]) {
        videoRefs.current[i] = null; // Placeholder for actual video elements
      }
    }
  }, [videoSlides.length]);

  useEffect(() => {
    const handleVideoEnd = () => {
      setCurrentVideoIndex((prevIndex: number) => (prevIndex + 1) % videoSlides.length);
    };

    const currentVideoElement = videoRefs.current[currentVideoIndex];

    if (previousVideoIndex.current !== null && previousVideoIndex.current !== currentVideoIndex) {
      const prevVideoElement = videoRefs.current[previousVideoIndex.current];
      if (prevVideoElement) {
        prevVideoElement.pause();
        prevVideoElement.currentTime = 0; // Reset previous video
        prevVideoElement.removeEventListener('ended', handleVideoEnd); // Use the defined handleVideoEnd
      }
    }

    if (currentVideoElement) {
      currentVideoElement.addEventListener('ended', handleVideoEnd);
      currentVideoElement.play().catch(error => console.error("Video play failed:", error));
    }

    previousVideoIndex.current = currentVideoIndex;

    return () => {
      if (currentVideoElement) {
        currentVideoElement.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, [currentVideoIndex, videoSlides.length]); // Depend on currentVideoIndex and videoSlides.length

  return (
    <html lang="en">
      <body className={`${roboto.variable} ${lora.variable}`}>
        <div className="fixed inset-0 z-0 overflow-hidden">
          {videoSlides.map((slide, index) => (
            <video
              key={index}
              ref={el => { videoRefs.current[index] = el; }}
              src={slide.src}
              autoPlay={index === currentVideoIndex} // Only autoplay the current video
              muted
              playsInline
              preload="auto"
              className={`absolute top-0 left-0 w-full h-full object-cover ${index === currentVideoIndex ? '' : 'hidden'}`}
            >
              Your browser does not support the video tag.
            </video>
          ))}
          <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark overlay for text readability */}
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
          <footer className="bg-[#861D1D] text-[#E8E2D1] p-6 text-center shadow-md mt-auto"> {/* Changed mt-12 to mt-auto to push footer to bottom */}
            <p className="text-lg">&copy; {new Date().getFullYear()} Santo Niño NZ. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
