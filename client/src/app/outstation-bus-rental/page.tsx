import React from "react";
import { Metadata } from "next";
import OutstationRentalClient from "@/components/pages/OutstationRentalClient";

export const metadata: Metadata = {
  title: "Outstation Bus Rental Services | Dadhich Bus Services",
  description:
    "Premium outstation bus rental services for long-distance travel, tours, and corporate events. Luxury coaches with professional drivers across India.",
  keywords:
    "outstation bus rental, long distance bus service, tour bus rental, luxury coach rental, intercity bus service, Dadhich Bus Service outstation",
  openGraph: {
    title: "Outstation Bus Rental Services | Dadhich Bus Services",
    description:
      "Premium outstation bus rental services for long-distance travel, tours, and corporate events. Luxury coaches with professional drivers across India.",
    type: "website",
    url: "https://dadhichbusservice.com/outstation-bus-rental",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://dadhichbusservice.com/outstation-bus-rental",
  },
};

const OutstationBusRentalPage = () => {
  return <OutstationRentalClient />;
};

export default OutstationBusRentalPage;
