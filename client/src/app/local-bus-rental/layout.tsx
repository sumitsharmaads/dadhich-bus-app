import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Local Bus Rental Services | Dadhich Bus Services",
  description:
    "Book local bus rental services for city travel, corporate events, and local transportation. Hourly and daily bus rental with professional drivers.",
  keywords:
    "local bus rental, city bus service, hourly bus rental, corporate bus rental, local transportation",
  openGraph: {
    title: "Local Bus Rental Services | Dadhich Bus Services",
    description:
      "Book local bus rental services for city travel and local transportation.",
    type: "website",
    url: "https://dadhichbus.com/local-bus-rental",
  },
};

export default function LocalBusRentalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
