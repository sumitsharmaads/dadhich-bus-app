import React from "react";
import { Metadata } from "next";
import { generateServerMetadata } from "@/lib/seo/serverSEO";
import ContactClient from "@/components/pages/ContactClient";

export async function generateMetadata(): Promise<Metadata> {
  return generateServerMetadata("/contact", {
    title: "Contact Us | Dadhich Bus Services",
    description:
      "Get in touch with Dadhich Bus Services for all your transportation needs. Contact us for local and outstation bus rental services, tours, and inquiries.",
    keywords: [
      "contact us",
      "bus rental contact",
      "Dadhich Bus Service contact",
      "bus service inquiry",
      "transportation contact",
      "bus booking contact",
      "tour inquiry",
      "customer service",
      "bus rental support",
      "transportation help",
      "booking assistance",
      "bus service phone",
      "transportation email",
      "customer support",
    ],
    image: "/images/og-image.jpg",
  });
}

const ContactPage = () => {
  return <ContactClient />;
};

export default ContactPage;
