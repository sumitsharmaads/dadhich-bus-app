import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://dadhichbusservice.com";

  // Main pages with high priority
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
    {
      url: "/corporate-transportation",
      priority: 0.8,
      changeFrequency: "weekly",
    },
    {
      url: "/wedding-transportation",
      priority: 0.8,
      changeFrequency: "weekly",
    },
    { url: "/airport-transfer", priority: 0.8, changeFrequency: "weekly" },
    { url: "/tour-packages", priority: 0.8, changeFrequency: "weekly" },
  ];

  // User account pages with lower priority
  const userRoutes = [
    { url: "/login", priority: 0.5, changeFrequency: "monthly" },
    { url: "/signup", priority: 0.5, changeFrequency: "monthly" },
    { url: "/profile", priority: 0.4, changeFrequency: "monthly" },
    { url: "/forgot-password", priority: 0.3, changeFrequency: "monthly" },
  ];

  // Inquiry and support pages
  const supportRoutes = [
    { url: "/inquery", priority: 0.6, changeFrequency: "monthly" },
    { url: "/support", priority: 0.6, changeFrequency: "monthly" },
    { url: "/terms-conditions", priority: 0.4, changeFrequency: "yearly" },
    { url: "/privacy-policy", priority: 0.4, changeFrequency: "yearly" },
    { url: "/refund-policy", priority: 0.4, changeFrequency: "yearly" },
  ];

  // Combine all routes
  const allRoutes = [
    ...mainRoutes,
    ...serviceRoutes,
    ...userRoutes,
    ...supportRoutes,
  ];

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
