"use client";

import React from "react";
import dayjs from "dayjs";
import { useWebsite } from "@/contexts/WebsiteProvider";
import { Tour } from "@/lib/api/types/tour.types";

interface BookingSidebarProps extends Tour {
  onQueryClick?: () => void;
}

const BookingSidebar = (params: BookingSidebarProps) => {
  const { websiteInfo } = useWebsite();

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 space-y-6 w-full sticky top-24 z-10">
      {/* Tour Info */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-text-primary font-primary">
          Tour Information
        </h3>
        <div className="space-y-3">
          <p className="flex items-center gap-3 text-sm text-text-secondary">
            <svg
              className="w-4 h-4 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <strong className="text-text-primary">From:</strong>{" "}
            {params?.sources
              ?.map((data) => data.cityName || "City")
              .join(" & ")}
          </p>
          <p className="flex items-center gap-3 text-sm text-text-secondary">
            <svg
              className="w-4 h-4 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <strong className="text-text-primary">To:</strong>{" "}
            {params?.places?.map((data) => data.name).join(" & ")}
          </p>
          <p className="flex items-center gap-3 text-sm text-text-secondary">
            <svg
              className="w-4 h-4 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">
              {dayjs(params.startDate).format("DD MMM YYYY, hh:mm A")}
            </span>{" "}
            -
            <svg
              className="w-4 h-4 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">
              {dayjs(params.endDate).format("DD MMM YYYY, hh:mm A")}
            </span>
          </p>
          <div className="flex items-center gap-3">
            <svg
              className="w-4 h-4 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-text-secondary">
              <strong className="text-text-primary">Duration:</strong>{" "}
              {params.days} Days / {params.nights} Nights
            </span>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="rounded-2xl bg-gradient-to-br from-[#FF6B6B] via-[#FC466B] to-[#C22A54] text-white px-6 py-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="text-base">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="font-medium">5 Travelers</span>
            </div>
            <p className="line-through text-sm opacity-70 mb-2">
              ₹ {5 * Number(params?.pricing?.minFare || 0)}
            </p>
            <p className="bg-white text-[#C22A54] rounded-full text-sm font-bold px-3 py-1 w-max">
              Save 3%
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold leading-none">
              ₹ {params.pricing?.minFare}
            </p>
            <p className="text-sm text-white/80 font-medium">
              + taxes per person
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <a
            className="bg-white text-[#C22A54] hover:text-[#691930]/10 font-semibold text-base rounded-xl py-3 flex justify-center items-center gap-2 transition-all duration-300"
            href={`tel:${
              (typeof params.captainUserId === "object"
                ? params.captainUserId._id
                : params.captainUserId) || websiteInfo?.phone
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Call
          </a>
          <button
            onClick={params.onQueryClick}
            className="bg-white text-[#C22A54] hover:text-[#691930]/10 font-semibold text-base rounded-xl py-3 flex justify-center items-center gap-2 transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Query
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
        <h4 className="font-semibold text-text-primary">Contact Information</h4>
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-sm text-text-secondary">
            <svg
              className="w-4 h-4 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="font-medium">Tour Guide</span>
          </p>
          <a
            href={`tel:${websiteInfo?.phone}`}
            className="flex items-center gap-2 text-sm text-primary-500 hover:text-primary-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {websiteInfo?.phone || "Contact us"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookingSidebar;
