import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Dadhich Bus Services",
  description:
    "Get in touch with Dadhich Bus Services. Contact us for bus rental inquiries, bookings, and support. We're here to help with all your transportation needs.",
  keywords:
    "contact us, bus rental contact, transportation services, customer support, bus booking",
  openGraph: {
    title: "Contact Us | Dadhich Bus Services",
    description: "Get in touch with us for all your bus rental needs.",
    type: "website",
    url: "https://dadhichbus.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
