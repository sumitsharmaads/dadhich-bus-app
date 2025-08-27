import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://dadhichbusservice.com";

  // Main public pages with high priority
  const mainRoutes = [
    { url: "/", priority: 1.0, changeFrequency: "daily" },
    { url: "/aboutus", priority: 0.9, changeFrequency: "monthly" },
    { url: "/services", priority: 0.9, changeFrequency: "weekly" },
    { url: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { url: "/tours", priority: 0.9, changeFrequency: "weekly" },
    { url: "/faq", priority: 0.7, changeFrequency: "monthly" },
  ];

  // Service-specific pages with medium-high priority
  const serviceRoutes = [
    { url: "/local-bus-rental", priority: 0.8, changeFrequency: "weekly" },
    { url: "/outstation-bus-rental", priority: 0.8, changeFrequency: "weekly" },
  ];

  // Inquiry page
  const inquiryRoutes = [
    { url: "/inquery", priority: 0.6, changeFrequency: "monthly" },
  ];

  // Combine all public routes only
  const allRoutes = [...mainRoutes, ...serviceRoutes, ...inquiryRoutes];

  // Note: Dynamic tour pages (/tour/[id]) are not included in sitemap
  // as they are generated dynamically and should be crawled separately

  return allRoutes.map((route) => ({
    url: `${base}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency as
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never",
    priority: route.priority,
  }));
}
