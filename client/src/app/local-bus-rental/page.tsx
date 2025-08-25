import React from "react";
import { Metadata } from "next";
import LocalBusRental from "@/components/pages/LocalBusRental";

export const metadata: Metadata = {
  title: "Local Bus Rental Services | Dadhich Bus Services",
  description:
    "Professional local bus rental services for corporate events, weddings, city tours, and local transportation. Hourly and daily rates with professional drivers.",
  keywords:
    "local bus rental, city bus service, corporate transportation, wedding bus rental, local tour bus, Dadhich Bus Service local rental",
  openGraph: {
    title: "Local Bus Rental Services | Dadhich Bus Services",
    description:
      "Professional local bus rental services for corporate events, weddings, city tours, and local transportation. Hourly and daily rates with professional drivers.",
    type: "website",
    url: "https://dadhichbusservice.com/local-bus-rental",
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
    canonical: "https://dadhichbusservice.com/local-bus-rental",
  },
};

const LocalBusRentalPage = () => {
  return <LocalBusRental />;
};

export default LocalBusRentalPage;
