import React from "react";
import { Metadata } from "next";
import { generateServerMetadata } from "@/lib/seo/serverSEO";
import LocalBusRental from "@/components/pages/LocalBusRental";

export async function generateMetadata(): Promise<Metadata> {
  return generateServerMetadata("/local-bus-rental", {
    title: "Local Bus Rental Services | Dadhich Bus Services",
    description:
      "Professional local bus rental services for corporate events, weddings, city tours, and local transportation. Hourly and daily rates with professional drivers.",
    keywords: [
      "local bus rental",
      "city bus service",
      "corporate transportation",
      "wedding bus rental",
      "local tour bus",
      "Dadhich Bus Service local rental",
      "intra-city bus rental",
      "local transportation",
      "event bus rental",
      "city tour bus",
      "local bus hire",
      "urban transportation",
      "local group travel",
      "city bus charter",
    ],
    image: "/images/og-image.jpg",
  });
}

const LocalBusRentalPage = () => {
  return <LocalBusRental />;
};

export default LocalBusRentalPage;
