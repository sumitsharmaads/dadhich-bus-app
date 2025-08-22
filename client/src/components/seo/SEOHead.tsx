import React from "react";
import Head from "next/head";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "service" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  structuredData?: any;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image = "/images/og-image.jpg",
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  structuredData,
  canonical,
  noindex = false,
  nofollow = false,
}) => {
  const fullUrl = url
    ? `https://dadhichbusservice.com${url}`
    : "https://dadhichbusservice.com";
  const fullImageUrl = image.startsWith("http")
    ? image
    : `https://dadhichbusservice.com${image}`;

  // Default structured data for organization
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Dadhich Bus Services",
    url: "https://dadhichbusservice.com",
    logo: "https://dadhichbusservice.com/images/logo.png",
    description: "Premium bus rental and tour services across India",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressRegion: "India",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-XXXXXXXXXX",
      contactType: "customer service",
      availableLanguage: "English, Hindi",
    },
    sameAs: [
      "https://www.facebook.com/dadhichbusservice",
      "https://www.instagram.com/dadhichbusservice",
      "https://www.linkedin.com/company/dadhichbusservice",
      "https://twitter.com/dadhichbusservice",
    ],
  };

  // Merge with custom structured data
  const finalStructuredData = structuredData
    ? { ...defaultStructuredData, ...structuredData }
    : defaultStructuredData;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author || "Dadhich Bus Services"} />
      <meta
        name="robots"
        content={`${noindex ? "noindex" : "index"}, ${
          nofollow ? "nofollow" : "follow"
        }`}
      />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Dadhich Bus Services" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@dadhichbusservice" />
      <meta name="twitter:creator" content="@dadhichbusservice" />

      {/* Article specific meta tags */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {type === "article" && section && (
        <meta property="article:section" content={section} />
      )}
      {type === "article" &&
        tags.length > 0 &&
        tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}

      {/* Geographic Meta Tags */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="geo.position" content="20.5937;78.9629" />
      <meta name="ICBM" content="20.5937, 78.9629" />

      {/* Dublin Core Meta Tags */}
      <meta name="DC.title" content={title} />
      <meta name="DC.creator" content="Dadhich Bus Services" />
      <meta
        name="DC.subject"
        content="Bus Rental, Tour Packages, Transportation"
      />
      <meta name="DC.description" content={description} />
      <meta name="DC.publisher" content="Dadhich Bus Services" />
      <meta name="DC.contributor" content="Dadhich Bus Services" />
      <meta name="DC.date" content={new Date().toISOString()} />
      <meta name="DC.type" content={type} />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.identifier" content={fullUrl} />
      <meta name="DC.language" content="en" />
      <meta name="DC.coverage" content="India" />
      <meta
        name="DC.rights"
        content="Copyright © 2024 Dadhich Bus Services. All rights reserved."
      />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData),
        }}
      />

      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#1976d2" />
      <meta name="msapplication-TileColor" content="#1976d2" />

      {/* Preload critical resources */}
      <link
        rel="preload"
        href="/fonts/poppins-regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link rel="preload" href="/images/hero-bg.jpg" as="image" />

      {/* DNS Prefetch for external domains */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
    </Head>
  );
};

export default SEOHead;
