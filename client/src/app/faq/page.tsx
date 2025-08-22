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
      <div className="pt-20">
        <FaqAndTerms />
      </div>
    </div>
  );
}
