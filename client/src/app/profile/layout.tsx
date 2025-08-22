import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile | Dadhich Bus Service",
  description: "Manage your profile, personal information, and quick ticket guests with Dadhich Bus Service.",
  keywords: "profile, user account, personal information, dadhich bus service",
  openGraph: {
    title: "My Profile | Dadhich Bus Service",
    description: "Manage your profile, personal information, and quick ticket guests with Dadhich Bus Service.",
    type: "website",
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
