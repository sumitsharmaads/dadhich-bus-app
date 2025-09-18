import type { Metadata } from "next";
import { generateServerMetadata } from "@/lib/seo/serverSEO";
import HomePageClient from "@/components/home/HomePageClient";

export async function generateMetadata(): Promise<Metadata> {
  return generateServerMetadata("/", {
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
    ],
    image: "/images/og-image.jpg",
  });
}

export default function HomePage() {
  return <HomePageClient />;
}
