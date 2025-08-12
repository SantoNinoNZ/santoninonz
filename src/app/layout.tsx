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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleVideoEnd = () => {
      setCurrentVideoIndex((prevIndex: number) => (prevIndex + 1) % videoSlides.length);
    };

    videoElement.addEventListener('ended', handleVideoEnd);

    videoElement.load();
    videoElement.play().catch(error => console.error("Video play failed:", error));

    return () => {
      videoElement.removeEventListener('ended', handleVideoEnd);
    };
  }, [currentVideoIndex, videoSlides.length]);

  return (
    <html lang="en">
      <body className={`${roboto.variable} ${lora.variable}`}>
        <div className="fixed inset-0 z-0 overflow-hidden">
          <video
            ref={videoRef}
            src={videoSlides[currentVideoIndex].src}
            autoPlay
            muted
            playsInline
            preload="auto"
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
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
