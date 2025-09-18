"use client";

import React from "react";
import Link from "next/link";
import { PublicRoutes } from "@/constants/routes";
import { useWebsite } from "@/contexts/WebsiteProvider";
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

// SVG Icons (you may want to move these to a separate icons folder)
const FacebookIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.316-1.296-.314-.292-.569-.634-.761-1.013-.307-.605-.459-1.268-.459-1.959 0-.69.152-1.354.459-1.959.192-.379.447-.721.761-1.013.868-.806 2.019-1.296 3.316-1.296.691 0 1.354.152 1.959.459.379.192.721.447 1.013.761.806.868 1.296 2.019 1.296 3.316 0 1.297-.49 2.448-1.296 3.316-.292.314-.634.569-1.013.761-.605.307-1.268.459-1.959.459zm7.424-9.306c-.785 0-1.59-.314-2.233-.936-.643-.622-.957-1.426-.957-2.211 0-.785.314-1.589.957-2.211.643-.622 1.448-.936 2.233-.936.785 0 1.59.314 2.233.936.643.622.957 1.426.957 2.211 0 .785-.314 1.589-.957 2.211-.643.622-1.448.936-2.233.936z" />
  </svg>
);

const WhatsAppIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.39 1.27 4.83L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm4.74 13.83c-.2.57-1.17 1.05-1.61 1.12-.44.07-.99.08-1.46-.1-.25-.1-.57-.25-.99-.49-.35-.2-.78-.5-1.25-.49-.52.01-1.01.15-1.44.29-.43.14-.84.32-1.21.31-.37 0-.91-.15-1.36-.29-.45-.14-.85-.29-1.22-.49-.37-.2-.66-.45-.9-.74-.24-.29-.51-.65-.69-1.04-.18-.39-.38-.82-.38-1.25 0-.43.2-.82.38-1.21.18-.39.45-.74.69-1.04.24-.29.53-.54.9-.74.37-.2.77-.35 1.22-.49.45-.14.99-.29 1.36-.29.37 0 .78.17 1.21.31.43.14.92.28 1.44.29.47 0 .9-.29 1.25-.49.42-.24.74-.39.99-.49.47-.18.99-.17 1.46-.1.44.07 1.41.55 1.61 1.12.2.57.2 1.05 0 1.62z" />
  </svg>
);

interface WebsiteInfo {
  brandname?: string;
  phone?: string;
  contactAddress?: {
    address1?: string;
    city?: string;
    state?: string;
    pincode?: string | number;
  };
  emails?: {
    supportEmail?: string;
  };
  socials?: {
    phone?: string;
    facebook?: string;
    instagram?: string;
  };
}

export const Footer: React.FC = () => {
  const { websiteInfo } = useWebsite();

  return (
    <footer
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Website footer
      </h2>

      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* About Us */}
        <div>
          <h4 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#C22A54] to-[#A82046]">
            About Us
          </h4>
          <p className="text-gray-300 leading-relaxed max-w-md mb-6">
            {websiteInfo?.branding?.brandName || "Dadhich Bus Service"} offers
            comfortable bus rentals and curated tour experiences across India.
            Safe rides, friendly support, and memorable journeys.
          </p>
          <div className="flex space-x-4" aria-label="Social links">
            <a
              href={`https://wa.me/${
                websiteInfo?.contact?.phone || "your-phone-number"
              }`}
              className="p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <a
              href={websiteInfo?.socials?.facebook || "https://facebook.com"}
              className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href={websiteInfo?.socials?.instagram || "https://instagram.com"}
              className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Services */}
        <div role="navigation" aria-label="Services">
          <h4 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#C22A54] to-[#A82046]">
            Services
          </h4>
          <ul className="space-y-4">
            <li>
              <Link
                href={PublicRoutes.TOURS}
                className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
              >
                <span className="w-2 h-2 bg-[#C22A54] rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                Tour Packages
              </Link>
            </li>
            <li>
              <Link
                href={PublicRoutes.SERVICES}
                className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
              >
                <span className="w-2 h-2 bg-[#C22A54] rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                Bus Rentals
              </Link>
            </li>
            <li>
              <Link
                href={PublicRoutes.HOME}
                className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
              >
                <span className="w-2 h-2 bg-[#C22A54] rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                Guided Tours
              </Link>
            </li>
            <li>
              <Link
                href={PublicRoutes.HOME}
                className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
              >
                <span className="w-2 h-2 bg-[#C22A54] rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                Group Travel
              </Link>
            </li>
            <li>
              <Link
                href={PublicRoutes.HOME}
                className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
              >
                <span className="w-2 h-2 bg-[#C22A54] rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                Luxury Experiences
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div role="navigation" aria-label="Quick Links">
          <h4 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#C22A54] to-[#A82046]">
            Quick Links
          </h4>
          <ul className="space-y-4">
            <li>
              <Link
                href={PublicRoutes.HOME}
                className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
              >
                <span className="w-2 h-2 bg-[#C22A54] rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                Home
              </Link>
            </li>
            <li>
              <Link
                href={PublicRoutes.ABOUT_US}
                className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
              >
                <span className="w-2 h-2 bg-[#C22A54] rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                About Us
              </Link>
            </li>
            <li>
              <Link
                href={PublicRoutes.CONTACT}
                className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
              >
                <span className="w-2 h-2 bg-[#C22A54] rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href={`${PublicRoutes.ABOUT_US}#faq-section`}
                className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
              >
                <span className="w-2 h-2 bg-[#C22A54] rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href={`${PublicRoutes.ABOUT_US}#term-condition`}
                className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
              >
                <span className="w-2 h-2 bg-[#C22A54] rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#C22A54] to-[#A82046]">
            Contact Us
          </h4>
          <div className="space-y-4">
            <p className="font-semibold text-white text-lg">
              {websiteInfo?.branding?.brandName || "Dadhich Bus Service"}
            </p>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#C22A54] to-[#A82046] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-gray-300">
                {websiteInfo?.contact?.address?.address1 || "123 Travel Street"}
                , {websiteInfo?.contact?.address?.city || "Tourism City"},{" "}
                {websiteInfo?.contact?.address?.state || "Travel State"} -{" "}
                {websiteInfo?.contact?.address?.pincode || "125050"}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#C22A54] to-[#A82046] rounded-lg flex items-center justify-center flex-shrink-0">
                <PhoneIcon className="w-4 h-4 text-white" />
              </div>
              <a
                href={`tel:${websiteInfo?.contact?.phone || "+919479600044"}`}
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                {websiteInfo?.contact?.phone || "+91 94796 00044"}
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#C22A54] to-[#A82046] rounded-lg flex items-center justify-center flex-shrink-0">
                <EnvelopeIcon className="w-4 h-4 text-white" />
              </div>
              <a
                href={`mailto:${
                  websiteInfo?.contact?.emails?.supportEmail ||
                  "info@traveltourism.com"
                }`}
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                {websiteInfo?.contact?.emails?.supportEmail ||
                  "info@traveltourism.com"}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-10 h-10 bg-gradient-to-r from-[#C22A54] to-[#A82046] rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()}{" "}
              {websiteInfo?.branding?.brandName || "Dadhich Bus Service"}. All
              rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              Terms
            </Link>
            <a
              href="/sitemap.xml"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
