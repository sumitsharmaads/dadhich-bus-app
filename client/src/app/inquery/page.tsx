import React from "react";
import { Metadata } from "next";
import InqueryClient from "@/components/pages/InqueryClient";

export const metadata: Metadata = {
  title: "Quick Inquiry | Dadhich Bus Services",
  description:
    "Have questions about our bus rental services? Send us a quick inquiry and get detailed information about pricing, availability, and tour packages.",
  keywords:
    "bus rental inquiry, tour inquiry, bus service questions, Dadhich Bus Service inquiry, transportation inquiry",
  openGraph: {
    title: "Quick Inquiry | Dadhich Bus Services",
    description:
      "Have questions about our bus rental services? Send us a quick inquiry and get detailed information about pricing, availability, and tour packages.",
    type: "website",
    url: "https://dadhichbusservice.com/inquery",
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
    canonical: "https://dadhichbusservice.com/inquery",
  },
};

const InquiryPage = () => {
  return <InqueryClient />;
};

export default InquiryPage;
