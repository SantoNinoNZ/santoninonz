"use client";

import { useState, useEffect, useCallback } from 'react';

interface ImageSlide {
  src: string;
  alt: string;
  text: string;
}

interface ImageCarouselProps {
  slides: ImageSlide[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isHovered) {
      interval = setInterval(goToNext, 5000); // Change slide every 5 seconds
    }
    return () => clearInterval(interval);
  }, [currentIndex, isHovered, goToNext]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];

  return (
    <section
      className="relative w-full overflow-hidden mb-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ height: '500px' }} // Fixed height for the carousel
    >
      <div
        className="relative w-full h-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('${currentSlide.src}')` }}
      >
        <div className="bg-black bg-opacity-50 flex items-center justify-center text-center p-8 w-full h-full">
          <div className="max-w-3xl text-white">
            {currentSlide.text && (
              <p className="text-xl font-roboto mb-6 opacity-90">
                {currentSlide.text}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-opacity duration-300"
      >
        &#10094;
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-opacity duration-300"
      >
        &#10095;
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? 'bg-white' : 'bg-gray-500'
            } hover:bg-white transition-colors duration-300`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default ImageCarousel;
