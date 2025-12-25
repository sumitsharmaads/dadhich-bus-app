import { Metadata } from "next";
import { tourService } from "@/lib/api/services/tour.service";
import TourDetailPageClient from "./TourDetailPageClient";

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    // Try to get tour data - use existing method for now since SEO endpoint isn't built yet
    let tourData;
    try {
      // First try the SEO endpoint (when it's available)
      console.log("🔍 Trying SEO endpoint for tour:", id);
      const seoResponse = await tourService.getTourSeo(id);
      // Extract the actual tour data from the response
      tourData = seoResponse.data;
    } catch (seoError) {
      console.log(
        "⚠️ SEO endpoint not available, falling back to full tour data"
      );
      // Fallback to full tour data for now
      tourData = await tourService.getTourById(id);
      console.log("✅ Fallback tour data successful:", tourData);
    }

    if (!tourData) {
      return {
        title: "Tour Not Found | Dadhich Bus Services",
        description: "The requested tour could not be found.",
      };
    }

    // Use tour-specific SEO if available, otherwise generate from tour data
    const seoTitle =
      tourData.seo?.title ||
      `${tourData.tourName} - ${
        tourData.days || 0
      } Days Tour | Dadhich Bus Services`;

    const seoDescription =
      tourData.seo?.description ||
      tourData.shortDescription ||
      tourData.description?.substring(0, 160) ||
      `Experience ${tourData.tourName} with Dadhich Bus Services. ${
        tourData.days || 0
      } days of adventure, comfort, and unforgettable memories.`;

    const seoKeywords = tourData.seo?.keywords || [
      tourData.tourName,
      "tour package",
      "travel India",
      "bus tour",
      "group tour",
      "adventure travel",
      "Dadhich Bus Services",
    ];

    // Generate route for canonical URL
    const canonicalUrl = `https://dadhichbusservice.com/tour/${tourData._id}`;

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: seoKeywords.join(", "),
      authors: [{ name: "Dadhich Bus Services" }],
      creator: "Dadhich Bus Services",
      publisher: "Dadhich Bus Services",
      metadataBase: new URL("https://dadhichbusservice.com"),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        url: canonicalUrl,
        siteName: "Dadhich Bus Services",
        images: tourData.heroImage
          ? [
              {
                url: tourData.heroImage.url,
                width: 1200,
                height: 630,
                alt: tourData.tourName,
              },
            ]
          : [
              {
                url: "/images/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Dadhich Bus Services - Premium Bus Rental & Tour Packages",
              },
            ],
        locale: "en_IN",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDescription,
        images: tourData.heroImage
          ? [tourData.heroImage.url]
          : ["/images/og-image.jpg"],
        creator: "@dadhichbusservice",
        site: "@dadhichbusservice",
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
      category: "Travel & Tourism",
      classification: "Business",
      other: {
        "geo.region": "IN",
        "geo.placename": "India",
        "geo.position": "20.5937;78.9629",
        ICBM: "20.5937, 78.9629",
      },
    };
  } catch (error) {
    // Fallback metadata if tour data can't be fetched
    return {
      title: "Tour Details | Dadhich Bus Services",
      description:
        "Explore our premium tour packages with Dadhich Bus Services. Safe, comfortable, and memorable travel experiences across India.",
    };
  }
}

// Server component that fetches data and renders client component
export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TourDetailPageClient tourId={id} />;
}
