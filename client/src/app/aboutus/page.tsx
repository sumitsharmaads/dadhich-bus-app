import React from "react";
import { Metadata } from "next";
import { generatePageSEO, seoEntryToMetadata } from "@/lib/seo/seoUtils";
import { seoService } from "@/lib/api/services/seo.service";
import AboutUsClient from "@/components/pages/AboutUsClient";
import { generateServerMetadata } from "@/lib/seo/serverSEO";

export async function generateMetadata(): Promise<Metadata> {
  return generateServerMetadata("/aboutus", {
    title: "About Us | Dadhich Bus Services",
    description:
      "Experience reliable, luxurious, and safe journeys with Rajasthan's most trusted bus rental service. Learn about our vision, services, and commitment to excellence.",
    keywords: [
      "Dadhich Bus Service",
      "bus rental Rajasthan",
      "luxury bus service",
      "tour bus rental",
      "religious tour bus",
      "Khatu shyam bus service",
      "Ramdevra bus service",
      "about Dadhich Bus",
      "company history",
      "bus service team",
      "transportation company",
      "Rajasthan bus rental",
      "trusted bus service",
      "reliable transportation",
    ],
    image: "/images/og-image.jpg",
  });
}

const AboutUsPage = () => {
  return <AboutUsClient />;
};

export default AboutUsPage;
