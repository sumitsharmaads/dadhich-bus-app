import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://dadhichbusservice.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/aboutus",
          "/services",
          "/tours",
          "/local-bus-rental",
          "/outstation-bus-rental",
          "/corporate-transportation",
          "/wedding-transportation",
          "/airport-transfer",
          "/tour-packages",
          "/contact",
          "/faq",
          "/terms-conditions",
          "/privacy-policy",
          "/refund-policy",
        ],
        disallow: [
          "/admin",
          "/api",
          "/_next",
          "/private",
          "/temp",
          "/*.json",
          "/search?*",
          "/profile",
          "/login",
          "/signup",
          "/forgot-password",
        ],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        crawlDelay: 0.5,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        crawlDelay: 1,
      },
      {
        userAgent: "Slurp",
        allow: "/",
        crawlDelay: 2,
      },
    ],
    sitemap: [
      `${base}/sitemap.xml`,
      `${base}/sitemap-tours.xml`,
      `${base}/sitemap-services.xml`,
    ],
    host: base,
  };
}
