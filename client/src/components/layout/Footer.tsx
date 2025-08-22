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
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.088" />
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
  socialLinks?: {
    phone?: string;
    facebook?: string;
    instagram?: string;
  };
}

export const Footer: React.FC = () => {
  const { websiteInfo } = useWebsite();

  return (
    <footer
      className="bg-secondary-500 text-white"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Website footer
      </h2>
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* About Us */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-primary-300 font-secondary">
            About Us
          </h4>
          <p className="text-sm leading-relaxed text-white/90 max-w-md font-primary">
            {websiteInfo?.brandname || "Dadhcih Bus Service"} offers comfortable
            bus rentals and curated tour experiences across India. Safe rides,
            friendly support, and memorable journeys.
          </p>
          <div className="flex space-x-4 mt-6" aria-label="Social links">
            <a
              href={`https://wa.me/${
                websiteInfo?.socialLinks?.phone || "your-phone-number"
              }`}
              className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 transition-colors"
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <a
              href={
                websiteInfo?.socialLinks?.facebook || "https://facebook.com"
              }
              className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 transition-colors"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href={
                websiteInfo?.socialLinks?.instagram || "https://instagram.com"
              }
              className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 transition-colors"
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
          <h4 className="text-lg font-semibold mb-4 text-primary-300 font-secondary">
            Services
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                href={PublicRoutes.TOURS}
                className="hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 rounded transition-colors"
              >
                Tour Packages
              </Link>
            </li>
            <li>
              <Link
                href={PublicRoutes.SERVICES}
                className="hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 rounded transition-colors"
              >
                Bus Rentals
              </Link>
            </li>
            <li>
              <Link
                href={PublicRoutes.HOME}
                className="hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 rounded transition-colors"
              >
                Guided Tours
              </Link>
            </li>
            <li>
              <Link
                href={PublicRoutes.HOME}
                className="hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 rounded transition-colors"
              >
                Group Travel
              </Link>
            </li>
            <li>
              <Link
                href={PublicRoutes.HOME}
                className="hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 rounded transition-colors"
              >
                Luxury Experiences
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div role="navigation" aria-label="Quick Links">
          <h4 className="text-lg font-semibold mb-4 text-primary-300 font-secondary">
            Quick Links
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                href={PublicRoutes.HOME}
                className="hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 rounded transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href={PublicRoutes.ABOUT_US}
                className="hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 rounded transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href={PublicRoutes.CONTACT}
                className="hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 rounded transition-colors"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href={`${PublicRoutes.ABOUT_US}#faq-section`}
                className="hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 rounded transition-colors"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href={`${PublicRoutes.ABOUT_US}#term-condition`}
                className="hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 rounded transition-colors"
              >
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-primary-300 font-secondary">
            Contact Us
          </h4>
          <div className="text-sm space-y-4 text-white/90 font-primary">
            <p className="font-medium">
              {websiteInfo?.brandname || "Dadhcih Bus Service"}
            </p>
            <div className="flex items-start space-x-2">
              <svg
                className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <p>
                {websiteInfo?.contactAddress?.address1 || "123 Travel Street"},{" "}
                {websiteInfo?.contactAddress?.city || "Tourism City"},{" "}
                {websiteInfo?.contactAddress?.state || "Travel State"} -{" "}
                {websiteInfo?.contactAddress?.pincode || "125050"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="w-5 h-5 text-primary-400" />
              <a
                href={`tel:${websiteInfo?.phone || "+919479600044"}`}
                className="hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 rounded transition-colors"
              >
                {websiteInfo?.phone || "+91 94796 00044"}
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <EnvelopeIcon className="w-5 h-5 text-primary-400" />
              <a
                href={`mailto:${
                  websiteInfo?.emails?.supportEmail || "info@traveltourism.com"
                }`}
                className="hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 rounded transition-colors"
              >
                {websiteInfo?.emails?.supportEmail || "info@traveltourism.com"}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-secondary-600 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12 text-sm text-white/80 font-primary">
          <p className="mb-2 md:mb-0">
            &copy; {new Date().getFullYear()}{" "}
            {websiteInfo?.brandname || "Dadhcih Bus Service"}. All rights
            reserved.
          </p>
          <div className="space-x-4">
            <Link
              href="/privacy"
              className="hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 rounded"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 rounded"
            >
              Terms
            </Link>
            <a
              href="/sitemap.xml"
              className="hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 rounded"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
