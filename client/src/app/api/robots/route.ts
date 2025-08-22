import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://dadhichbusservice.com";

  const robotsTxt = `# Robots.txt for Dadhich Bus Services
# https://dadhichbusservice.com

User-agent: *
Allow: /
Allow: /aboutus
Allow: /services
Allow: /tours
Allow: /local-bus-rental
Allow: /outstation-bus-rental
Allow: /corporate-transportation
Allow: /wedding-transportation
Allow: /airport-transfer
Allow: /tour-packages
Allow: /contact
Allow: /faq
Allow: /terms-conditions
Allow: /privacy-policy
Allow: /refund-policy
Allow: /support
Allow: /inquery

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/
Disallow: /temp/
Disallow: /*.json
Disallow: /search?*
Disallow: /profile
Disallow: /login
Disallow: /signup
Disallow: /forgot-password

# Crawl delay for all bots
Crawl-delay: 1

# Special rules for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 0.5

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 2

User-agent: YandexBot
Allow: /
Crawl-delay: 2

# Sitemap locations
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-tours.xml
Sitemap: ${baseUrl}/sitemap-services.xml

# Host
Host: ${baseUrl}`;

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
