"use client";

import React from "react";
import Link from "next/link";
import FaqAndTerms from "@/components/FaqAndTerms";
import { useWebsite } from "@/contexts/WebsiteProvider";

const AboutUsClient = () => {
  const { websiteInfo } = useWebsite();

  return (
    <section>
      {/* Top border */}
      <div className="h-0.5 bg-primary-500 transition-all duration-300 ease-in-out" />

      <div className="bg-surface-tertiary pt-1 pb-12 px-4 md:px-10">
        {/* Header Section */}
        <div className="text-center py-20 bg-gradient-to-br from-surface-primary via-neutral-50 to-surface-primary rounded-lg mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 font-primary">
            About Dadhich Bus Service
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Experience reliable, luxurious, and safe journeys with
            Rajasthan&apos;s most trusted bus rental service.
          </p>
        </div>

        {/* About Content Section */}
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-10 items-center mb-16 px-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-4 font-primary">
              Who We Are
            </h2>
            <p className="text-text-secondary leading-relaxed text-base mb-4">
              Welcome to Dadhich tour and travels, your trusted travel partner
              for exploring the sacred and historical or religious sites or
              places Rajasthan&apos;s such as Khatu shyam, Ramdevra and other
              destinations. Our mission is to provide seamless travel
              experiences. Ensuring a memorable journey with great services,
              comfortable accommodations and hassle free transportations of our
              tour and travels.
            </p>
            <p className="text-text-secondary leading-relaxed text-base">
              If anyone wants to seek spiritual solace or an enriching cultural
              adventure, we are here to guide you through religious rich
              heritage. Join us and embark on a journey filled with devotion,
              history and unforgettable experiences.
            </p>
          </div>
          <div>
            <img
              src="/images/public/carosuel/dc86d586f2471430f899b6694f037b33.jpg"
              alt="Luxury Bus"
              className="rounded-2xl shadow-lg h-72 w-full object-cover"
            />
          </div>
        </div>

        {/* Vision Section */}
        <div className="container mx-auto max-w-5xl bg-gradient-to-br from-primary-50 to-surface-primary px-6 py-10 rounded-xl shadow-md mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-3 font-primary">
            Our Vision
          </h2>
          <p className="text-text-secondary leading-relaxed text-base">
            Our vision is to revolutionize road travel by making it premium,
            comfortable, and stress-free. We aim to be the most preferred bus
            travel partner for every group—large or small—providing reliable
            services, trained drivers, and a fleet that&apos;s built for both
            luxury and safety.
          </p>
        </div>

        {/* Why Choose Us Section */}
        <div className="container mx-auto max-w-5xl bg-surface-primary border border-neutral-200 rounded-xl p-6 shadow-md mb-12">
          <h2 className="text-xl font-bold text-text-primary mb-4 font-primary">
            Why Choose Us?
          </h2>
          <ul className="space-y-2 text-text-secondary">
            {[
              "Modern fleet with well-maintained buses",
              "Easy online booking and cancellation",
              "Experienced drivers and support staff",
              "Timely and safe journeys",
              "Affordable fares with no hidden charges",
              "24/7 customer support",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-success-500 text-xl">✔️</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Final CTA */}
        <div className="relative mt-24 bg-neutral-900 rounded-2xl text-white px-6 py-16 shadow-xl overflow-hidden">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-4xl font-bold mb-4 font-primary">
              Let&apos;s Get You Moving!
            </h2>
            <p className="text-lg text-neutral-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Whether you need a luxury bus for a family tour or a reliable
              rental for business travel, Dadhich Bus Services is just a click
              or call away. Book now or talk to our team!
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href={`tel:${websiteInfo?.contact?.phone || "+919511547154"}`}
                className="bg-primary-500 hover:bg-primary-600 transition-colors duration-300 text-white font-semibold px-6 py-3 rounded-full shadow-md"
              >
                📞 Call Us
              </a>
              <Link
                href="/"
                className="bg-white text-primary-500 hover:bg-neutral-100 transition-colors duration-300 font-semibold px-6 py-3 rounded-full shadow-md"
              >
                🧭 Book a Tour
              </Link>
              <Link
                href="/services"
                className="bg-white text-primary-500 hover:bg-neutral-100 transition-colors duration-300 font-semibold px-6 py-3 rounded-full shadow-md"
              >
                🚌 Rent a Bus
              </Link>
            </div>
          </div>

          {/* Subtle background gradient effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-primary-500/20 to-transparent rounded-2xl" />
        </div>

        {/* Internal Component - FaqAndTerms */}
        <FaqAndTerms />
      </div>
    </section>
  );
};

export default AboutUsClient;
