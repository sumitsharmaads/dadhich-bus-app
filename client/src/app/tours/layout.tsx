import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tour Packages | Dadhich Bus Service",
  description:
    "Discover amazing tour packages across India with Dadhich Bus Service. From spiritual journeys to adventure expeditions, we provide unforgettable travel experiences with comfortable transportation.",
  keywords:
    "tour packages, India tours, spiritual tours, adventure tours, guided tours, travel packages, bus tours, group tours, religious tours, luxury tours",
  openGraph: {
    title: "Tour Packages | Dadhich Bus Service",
    description:
      "Explore amazing destinations across India with our curated tour packages. Comfortable transportation and unforgettable experiences.",
    type: "website",
    url: "https://dadhichbusservice.com/tours",
    images: [
      {
        url: "/images/tours-og.jpg",
        width: 1200,
        height: 630,
        alt: "Dadhich Bus Service Tour Packages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tour Packages | Dadhich Bus Service",
    description:
      "Discover amazing tour packages across India with comfortable transportation and expert guidance.",
    images: ["/images/tours-og.jpg"],
  },
  alternates: {
    canonical: "/tours",
  },
};

export default function ToursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Top Banner Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-4 left-10 w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"></div>
        <div
          className="absolute top-8 right-16 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-6 left-20 w-1.5 h-1.5 bg-white rounded-full opacity-25 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Content */}
        <div className="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-volkhov leading-tight">
              Discover Amazing Destinations
            </h1>
            <p className="mt-2 text-blue-100 font-poppins text-sm sm:text-base max-w-2xl mx-auto">
              Experience the beauty of India with our curated tour packages.
              From spiritual journeys to adventure expeditions, we make your
              travel dreams come true.
            </p>
          </div>
        </div>

        {/* Bottom Wave Effect */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-8 text-white"
            viewBox="0 0 1200 32"
            preserveAspectRatio="none"
          >
            <path
              d="M0,32L48,26.7C96,21,192,11,288,10.7C384,11,480,21,576,26.7C672,32,768,32,864,26.7C960,21,1056,11,1152,10.7L1200,11L1200,32L0,32Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      {children}
    </>
  );
}
