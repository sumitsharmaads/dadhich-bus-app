import React from "react";
import { Metadata } from "next";
import { generatePageSEO, seoEntryToMetadata } from "@/lib/seo/seoUtils";
import { seoService } from "@/lib/api/services/seo.service";
import OutstationRentalClient from "@/components/pages/OutstationRentalClient";
import { generateServerMetadata } from "@/lib/seo/serverSEO";

export async function generateMetadata(): Promise<Metadata> {
  return generateServerMetadata("/outstation-bus-rental", {
    title: "Outstation Bus Rental Services | Dadhich Bus Services",
    description:
      "Premium outstation bus rental services for long-distance travel, tours, and corporate events. Luxury coaches with professional drivers across India.",
    keywords: [
      "outstation bus rental",
      "long distance bus service",
      "tour bus rental",
      "luxury coach rental",
      "intercity bus service",
      "Dadhich Bus Service outstation",
      "interstate bus rental",
      "long distance transportation",
      "luxury bus hire",
      "outstation travel",
      "intercity transportation",
      "long distance tours",
      "outstation group travel",
      "interstate bus charter",
    ],
    image: "/images/og-image.jpg",
  });
}

const OutstationBusRentalPage = () => {
  return <OutstationRentalClient />;
};

export default OutstationBusRentalPage;
