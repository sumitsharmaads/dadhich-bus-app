import React from "react";
import { Metadata } from "next";
import ContactClient from "@/components/pages/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Dadhich Bus Services",
  description:
    "Get in touch with Dadhich Bus Services for all your transportation needs. Contact us for local and outstation bus rental services, tours, and inquiries.",
  keywords:
    "contact us, bus rental contact, Dadhich Bus Service contact, bus service inquiry, transportation contact",
  openGraph: {
    title: "Contact Us | Dadhich Bus Services",
    description:
      "Get in touch with Dadhich Bus Services for all your transportation needs. Contact us for local and outstation bus rental services, tours, and inquiries.",
    type: "website",
    url: "https://dadhichbusservice.com/contact",
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
    canonical: "https://dadhichbusservice.com/contact",
  },
};

const ContactPage = () => {
  return <ContactClient />;
};

export default ContactPage;
