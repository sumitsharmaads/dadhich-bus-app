import FaqAndTerms from "@/components/FaqAndTerms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ & Terms | Dadhich Bus Service",
  description:
    "Find answers to frequently asked questions about our bus rental services, tours, and travel policies. Read our terms and conditions.",
  keywords:
    "FAQ, frequently asked questions, bus rental FAQ, tour FAQ, travel terms, bus service terms",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-surface-primary">
      <div className="py-12 px-4 text-center bg-gradient-to-r from-blue-200 via-yellow-100 to-green-200 rounded-b-3xl shadow-lg mb-8 relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <circle cx="60" cy="40" r="30" fill="#93c5fd" fillOpacity="0.25" />
            <circle cx="340" cy="60" r="24" fill="#bbf7d0" fillOpacity="0.25" />
            <circle cx="200" cy="80" r="18" fill="#fde68a" fillOpacity="0.25" />
          </svg>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Your journey matters! Find answers about our bus rentals, tours, and
            travel policies.
          </p>
          <img
            src="/bus-illustration.svg"
            alt="Bus Tour Illustration"
            className="mx-auto h-32 w-auto mb-2"
          />
        </div>
      </div>
      <div>
        <FaqAndTerms />
      </div>
    </div>
  );
}
