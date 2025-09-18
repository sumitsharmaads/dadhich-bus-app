import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { WebsiteContextProvider } from "@/contexts/WebsiteProvider";
import { LoaderContextProvider } from "@/contexts/LoaderContext";
import { AuthContextProvider } from "@/contexts/AuthContextProvider";
import "./globals.css";

// Basic metadata - let individual pages handle their own SEO
export const metadata: Metadata = {
  metadataBase: new URL("https://dadhichbusservice.com"),
  title: {
    template: "%s | Dadhich Bus Services",
    default: "Dadhich Bus Services",
  },
  description: "Premium bus rental and tour services across India",
  authors: [{ name: "Dadhich Bus Services" }],
  creator: "Dadhich Bus Services",
  publisher: "Dadhich Bus Services",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
    yandex: process.env.YANDEX_VERIFICATION_CODE,
    yahoo: process.env.YAHOO_VERIFICATION_CODE,
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

        {/* Structured Data will be handled by individual page SEO */}
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
