import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Outstation Bus Rental Services | Dadhich Bus Services",
  description:
    "Luxury outstation bus rental services for long-distance travel, tours, and group transportation. Professional drivers and premium amenities included.",
  keywords:
    "outstation bus rental, luxury bus service, long distance bus rental, tour bus rental, group transportation",
  openGraph: {
    title: "Outstation Bus Rental Services | Dadhich Bus Services",
    description:
      "Luxury outstation bus rental services for long-distance travel and tours.",
    type: "website",
    url: "https://dadhichbus.com/outstation-bus-rental",
  },
};

export default function OutstationBusRentalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
