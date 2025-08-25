import React from "react";
import { Metadata } from "next";
import AboutUsClient from "@/components/pages/AboutUsClient";

export const metadata: Metadata = {
  title: "Dadhich Bus Services | About US",
  description:
    "Experience reliable, luxurious, and safe journeys with Rajasthan's most trusted bus rental service. Learn about our vision, services, and commitment to excellence.",
  keywords:
    "Dadhich Bus Service, bus rental Rajasthan, luxury bus service, tour bus rental, religious tour bus, Khatu shyam bus service, Ramdevra bus service",
  openGraph: {
    title: "Dadhich Bus Services | About US",
    description:
      "Experience reliable, luxurious, and safe journeys with Rajasthan's most trusted bus rental service.",
    type: "website",
    url: "https://dadhichbusservice.com/aboutus",
  },
};

const AboutUsPage = () => {
  return <AboutUsClient />;
};

export default AboutUsPage;
