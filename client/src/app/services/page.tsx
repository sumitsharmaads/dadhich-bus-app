import React from "react";
import { Metadata } from "next";
import { generatePageSEO, seoEntryToMetadata } from "@/lib/seo/seoUtils";
import { seoService } from "@/lib/api/services/seo.service";
import ServicesClient from "@/components/pages/ServicesClient";
import { generateServerMetadata } from "@/lib/seo/serverSEO";

export async function generateMetadata(): Promise<Metadata> {
  return generateServerMetadata("/services", {
    title: "Bus Rental Services | Dadhich Bus Services",
    description:
      "Comprehensive bus rental services including local and outstation transportation. Professional drivers, luxury coaches, and competitive pricing for all your travel needs.",
    keywords: [
      "bus rental services",
      "local bus rental",
      "outstation bus rental",
      "tour bus service",
      "corporate transportation",
      "Dadhich Bus Service",
      "bus hire India",
      "group transportation",
      "luxury bus rental",
      "bus charter service",
      "event transportation",
      "wedding bus service",
      "airport transfer",
      "business travel",
      "bus booking online",
    ],
    image: "/images/og-image.jpg",
  });
}

const ServicesPage = () => {
  return <ServicesClient />;
};

export default ServicesPage;
