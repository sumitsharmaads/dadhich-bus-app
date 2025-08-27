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
          "/contact",
          "/faq",
          "/inquery",
          "/tour",
          "/test-images",
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
    sitemap: [`${base}/sitemap.xml`],
    host: base,
  };
}
