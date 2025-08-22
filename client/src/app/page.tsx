// Server metadata for SEO and a client component for the UI
import type { Metadata } from "next";
import {
  createPageSEO,
  fetchSEOData,
  seoToMetadata,
  generateMetadata as buildMetadata,
} from "@/utils/seo";
import HomePageClient from "@/components/home/HomePageClient";

export async function generateMetadata(): Promise<Metadata> {
  // Try dynamic SEO from backend first (admin-managed)
  const dynamicSEO = await fetchSEOData("/");
  if (dynamicSEO) return seoToMetadata(dynamicSEO);

  // Fallback SEO with comprehensive metadata
  return buildMetadata(
    createPageSEO({
      title:
        "Dadhich Bus Services - Premium Bus Rental & Tour Packages Across India",
      description:
        "Experience premium bus rentals, corporate transportation, and curated tour packages across India with Dadhich Bus Services. Safe, comfortable, and reliable transportation solutions for groups, corporate events, and tourism.",
      keywords: [
        "Dadhich Bus Services",
        "bus rental India",
        "corporate bus service",
        "tour packages India",
        "group transportation",
        "luxury bus hire",
        "outstation bus service",
        "local bus rental",
        "bus booking online",
        "travel agency India",
        "bus transportation",
        "corporate travel",
        "wedding transportation",
        "airport transfer",
        "bus charter service",
        "India bus tours",
        "group travel packages",
        "business transportation",
        "event transportation",
      ].join(", "),
      image: "/images/og-image.jpg",
      canonical: "/",
      openGraph: {
        title: "Dadhich Bus Services - Premium Bus Rental & Tour Packages",
        description:
          "Experience premium bus rentals, corporate transportation, and curated tour packages across India. Safe, comfortable, and reliable transportation solutions.",
        url: "https://dadhichbusservice.com",
        siteName: "Dadhich Bus Services",
        images: [
          {
            url: "/images/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "Dadhich Bus Services - Premium Bus Rental & Tour Packages",
          },
          {
            url: "/images/og-image-square.jpg",
            width: 600,
            height: 600,
            alt: "Dadhich Bus Services Logo",
          },
        ],
        locale: "en_IN",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Dadhich Bus Services - Premium Bus Rental & Tour Packages",
        description:
          "Premium bus rentals, corporate transportation, and curated tour packages across India. Safe, comfortable, and reliable transportation solutions.",
        images: ["/images/og-image.jpg"],
        creator: "@dadhichbusservice",
        site: "@dadhichbusservice",
      },
      alternates: {
        canonical: "https://dadhichbusservice.com",
      },
      other: {
        "geo.region": "IN",
        "geo.placename": "India",
        "geo.position": "20.5937;78.9629",
        ICBM: "20.5937, 78.9629",
        "DC.title": "Dadhich Bus Services - Premium Bus Rental & Tour Packages",
        "DC.creator": "Dadhich Bus Services",
        "DC.subject":
          "Bus Rental, Tour Packages, Transportation, Corporate Travel",
        "DC.description": "Premium bus rental and tour services across India",
        "DC.publisher": "Dadhich Bus Services",
        "DC.contributor": "Dadhich Bus Services",
        "DC.date": new Date().toISOString(),
        "DC.type": "Service",
        "DC.format": "text/html",
        "DC.identifier": "https://dadhichbusservice.com",
        "DC.language": "en",
        "DC.coverage": "India",
        "DC.rights":
          "Copyright © 2024 Dadhich Bus Services. All rights reserved.",
      },
    })
  );
}

export default function HomePage() {
  return <HomePageClient />;
}
