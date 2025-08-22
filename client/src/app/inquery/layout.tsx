import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quick Inquiry | Dadhich Bus Services",
  description:
    "Have questions about our bus rental services? Send us a quick inquiry and we'll respond with detailed information about pricing, availability, and services.",
  keywords:
    "bus rental inquiry, transportation services, quick inquiry, bus booking questions, customer support",
  openGraph: {
    title: "Quick Inquiry | Dadhich Bus Services",
    description: "Send us your questions about bus rental services.",
    type: "website",
    url: "https://dadhichbus.com/inquery",
  },
};

export default function InquiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
