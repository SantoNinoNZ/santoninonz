"use client";

import React, { useState, useEffect } from 'react';

const HeroSection: React.FC = () => {
  const imageSlides = [
    { src: "/assets/image-slides/timthumb1.png", alt: "Slide 1" },
    { src: "/assets/image-slides/timthumb2.png", alt: "Slide 2" },
    { src: "/assets/image-slides/timthumb3.png", alt: "Slide 3" },
    { src: "/assets/image-slides/timthumb4.png", alt: "Slide 4" },
    { src: "/assets/image-slides/timthumb5.png", alt: "Slide 5" },
    { src: "/assets/image-slides/timthumb6.png", alt: "Slide 6" },
    { src: "/assets/image-slides/timthumb7.png", alt: "Slide 7" },
    { src: "/assets/image-slides/timthumb8.png", alt: "Slide 8" },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % imageSlides.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [imageSlides.length]);

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center transition-all duration-1000 ease-in-out"
      style={{ backgroundImage: `url('${imageSlides[currentImageIndex].src}')` }}
    >
      {/* This div will serve as the background for the video later */}
    </div>
  );
};

export default HeroSection;
