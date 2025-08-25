import React from "react";
import { Metadata } from "next";
import ServicesClient from "@/components/pages/ServicesClient";

export const metadata: Metadata = {
  title: "Bus Rental Services | Dadhich Bus Services",
  description:
    "Comprehensive bus rental services including local and outstation transportation. Professional drivers, luxury coaches, and competitive pricing for all your travel needs.",
  keywords:
    "bus rental services, local bus rental, outstation bus rental, tour bus service, corporate transportation, Dadhich Bus Service",
  openGraph: {
    title: "Bus Rental Services | Dadhich Bus Services",
    description:
      "Comprehensive bus rental services including local and outstation transportation. Professional drivers, luxury coaches, and competitive pricing for all your travel needs.",
    type: "website",
    url: "https://dadhichbusservice.com/services",
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
    canonical: "https://dadhichbusservice.com/services",
  },
};

const ServicesPage = () => {
  return <ServicesClient />;
};

export default ServicesPage;
