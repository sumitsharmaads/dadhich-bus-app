"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PublicRoutes } from "@/constants/routes";
import Image from "next/image";
import SearchTourBar from "./SearchTourBar";

const HeroSection: React.FC = () => {
  const router = useRouter();

  return (
    <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center bg-cover bg-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/heroImage.png"
          alt="Travel Hero Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 md:px-8 max-w-5xl mx-auto">
        <h3 className="text-sm md:text-base font-semibold text-primary-400 tracking-wider uppercase font-primary mb-2">
          Best Destinations Around the World
        </h3>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mt-2 font-secondary leading-tight">
          The World Awaits: Travel with Us
        </h1>
        <p className="text-sm md:text-lg lg:text-xl mt-6 max-w-3xl mx-auto leading-relaxed">
          Manage the planning; focused on making memories. Our friendly team
          makes sure that everything is taken care of, helping you to have a
          hassle-free and delightful trip.
        </p>
        <button
          className="mt-8 px-8 py-3 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-all duration-300 font-medium text-lg hover:shadow-xl transform hover:-translate-y-0.5"
          onClick={() => router.push(PublicRoutes.ABOUT_US)}
        >
          Know More
        </button>
      </div>

      {/* Simplified Search Bar */}
      <div className="absolute -bottom-8 flex justify-center w-full px-4 md:px-8 z-20">
        <div className="bg-secondary-500 bg-opacity-95 backdrop-blur-sm p-6 rounded-2xl flex items-center w-full max-w-2xl shadow-2xl">
          <SearchTourBar />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
