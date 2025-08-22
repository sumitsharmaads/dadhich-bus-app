"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const carouselImages = [
  {
    src: "/images/public/carosuel/4917fc749ad51cfdf08f86aa6fc0a0f9.jpg",
    alt: "Luxury Bus 1",
  },
  {
    src: "/images/public/carosuel/dc86d586f2471430f899b6694f037b33.jpg",
    alt: "Luxury Bus 2",
  },
];

const HomeCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  return (
    <section className="py-10 bg-white max-w-5xl mx-auto px-2 overflow-hidden">
      <h2 className="text-3xl font-bold font-secondary mb-8">
        Pick Your Comfort: AC and Non-AC Bus Rides
      </h2>

      <div className="relative">
        <div className="relative h-96 overflow-hidden rounded-lg">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
          aria-label="Next slide"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mt-6">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? "bg-primary-500 scale-110"
                  : "bg-neutral-300 hover:bg-neutral-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCarousel;
