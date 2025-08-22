"use client";

import React, { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import DummyFallback from "@/components/common/DummyFallback";

interface PlanTourSectionProps {
  onOpenTourForm: () => void;
}

const PlanTourSection: React.FC<PlanTourSectionProps> = ({
  onOpenTourForm,
}) => {
  return (
    <>
      <section className="py-16 px-4 bg-surface-primary">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl shadow-lg p-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-full shadow-md">
              <ArrowRightIcon className="h-8 w-8 text-primary-500" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-primary-600 mb-4 font-primary">
            Plan Your Own Tour
          </h2>
          <p className="text-text-secondary mb-8 text-lg max-w-2xl font-primary">
            Customize your trip according to your preferences. Our expert team
            will help you create the perfect itinerary.
          </p>
          <button
            className="bg-primary-500 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            onClick={onOpenTourForm}
          >
            Get Started
          </button>
        </div>
      </section>
    </>
  );
};

export default PlanTourSection;
