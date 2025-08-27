"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AboutTourSection: React.FC<{ description: string }> = ({
  description,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleText = () => setExpanded(!expanded);

  const words = description.trim().split(" ");
  const shortText = words.slice(0, 60).join(" ");
  const isLong = words.length > 60;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#C22A54]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary font-primary">
          About the Tour
        </h2>
      </div>

      <AnimatePresence initial={false}>
        <motion.p
          key={expanded ? "expanded" : "collapsed"}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm sm:text-base text-text-secondary leading-relaxed overflow-hidden"
        >
          {expanded || !isLong ? description : `${shortText}...`}
        </motion.p>
      </AnimatePresence>

      {isLong && (
        <button
          onClick={toggleText}
          className="flex items-center text-[#C22A54] text-xs sm:text-sm font-semibold hover:underline transition-colors"
        >
          {expanded ? (
            <>
              Show Less{" "}
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </>
          ) : (
            <>
              Show More{" "}
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default AboutTourSection;
