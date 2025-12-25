import React from "react";
import { Metadata } from "next";
import { generateServerMetadata } from "@/lib/seo/serverSEO";
import InqueryClient from "@/components/pages/InqueryClient";

export async function generateMetadata(): Promise<Metadata> {
  return generateServerMetadata("/inquery", {
    title: "Quick Inquiry | Dadhich Bus Services",
    description:
      "Have questions about our bus rental services? Send us a quick inquiry and get detailed information about pricing, availability, and tour packages.",
    keywords: [
      "bus rental inquiry",
      "tour inquiry",
      "bus service questions",
      "Dadhich Bus Service inquiry",
      "transportation inquiry",
      "bus booking inquiry",
      "tour package inquiry",
      "bus rental quote",
      "transportation quote",
      "bus service consultation",
      "travel inquiry",
      "group travel inquiry",
      "corporate transportation inquiry",
      "bus rental help",
    ],
    image: "/images/og-image.jpg",
  });
}

const InquiryPage = () => {
  return <InqueryClient />;
};

export default InquiryPage;
