import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { WebsiteContextProvider } from "@/contexts/WebsiteProvider";
import { LoaderContextProvider } from "@/contexts/LoaderContext";
import { AuthContextProvider } from "@/contexts/AuthContextProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default:
      "Dadhich Bus Services - Premium Bus Rental & Tour Packages Across India",
    template: "%s | Dadhich Bus Services",
  },
  description:
    "Dadhich Bus Services offers premium bus rentals, corporate transportation, and curated tour packages across India. Safe, comfortable, and reliable bus services for groups, corporate events, and tourism.",
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
  ].join(", "),
  authors: [{ name: "Dadhich Bus Services" }],
  creator: "Dadhich Bus Services",
  publisher: "Dadhich Bus Services",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dadhichbusservice.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Dadhich Bus Services - Premium Bus Rental & Tour Packages",
    description:
      "Experience premium bus rentals, corporate transportation, and curated tour packages across India with Dadhich Bus Services. Safe, comfortable, and reliable transportation solutions.",
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
  verification: {
    google:
      process.env.GOOGLE_VERIFICATION_CODE || "your-google-verification-code",
    yandex: process.env.YANDEX_VERIFICATION_CODE,
    yahoo: process.env.YAHOO_VERIFICATION_CODE,
  },
  category: "Travel & Tourism",
  classification: "Business",
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    ICBM: "20.5937, 78.9629",
    "DC.title": "Dadhich Bus Services",
    "DC.creator": "Dadhich Bus Services",
    "DC.subject": "Bus Rental, Tour Packages, Transportation",
    "DC.description": "Premium bus rental and tour services across India",
    "DC.publisher": "Dadhich Bus Services",
    "DC.contributor": "Dadhich Bus Services",
    "DC.date": new Date().toISOString(),
    "DC.type": "Service",
    "DC.format": "text/html",
    "DC.identifier": "https://dadhichbusservice.com",
    "DC.language": "en",
    "DC.coverage": "India",
    "DC.rights": "Copyright © 2024 Dadhich Bus Services. All rights reserved.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Volkhov:wght@400;700&display=swap"
          rel="stylesheet"
        />

        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1976d2" />
        <meta name="msapplication-TileColor" content="#1976d2" />

        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              name: "Dadhich Bus Services",
              alternateName: "Dadhich Bus Service",
              description: "Premium bus rental and tour services across India",
              url: "https://dadhichbusservice.com",
              logo: "https://dadhichbusservice.com/images/logo.png",
              image: "https://dadhichbusservice.com/images/og-image.jpg",
              telephone: "+91-XXXXXXXXXX",
              email: "info@dadhichbusservice.com",
              address: {
                "@type": "PostalAddress",
                addressCountry: "IN",
                addressRegion: "India",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 20.5937,
                longitude: 78.9629,
              },
              sameAs: [
                "https://www.facebook.com/dadhichbusservice",
                "https://www.instagram.com/dadhichbusservice",
                "https://www.linkedin.com/company/dadhichbusservice",
                "https://twitter.com/dadhichbusservice",
              ],
              openingHours: "Mo-Su 00:00-23:59",
              priceRange: "₹₹",
              currenciesAccepted: "INR",
              paymentAccepted:
                "Cash, Credit Card, Debit Card, UPI, Net Banking",
              areaServed: {
                "@type": "Country",
                name: "India",
              },
              serviceType: [
                "Bus Rental",
                "Tour Packages",
                "Corporate Transportation",
                "Airport Transfer",
                "Wedding Transportation",
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Bus Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Local Bus Rental",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Outstation Bus Rental",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Tour Packages",
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body className="font-primary text-text-primary bg-surface-primary antialiased">
        <LoaderContextProvider>
          <WebsiteContextProvider>
            <ThemeProvider>
              <AuthContextProvider>
                <PublicLayout>{children}</PublicLayout>
              </AuthContextProvider>
            </ThemeProvider>
          </WebsiteContextProvider>
        </LoaderContextProvider>
      </body>
    </html>
  );
}
