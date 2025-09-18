import React from "react";
import { Metadata } from "next";
import { generatePageSEO, seoEntryToMetadata } from "@/lib/seo/seoUtils";
import { seoService } from "@/lib/api/services/seo.service";
import { LoginForm, PreventLoginRoute } from "@/components/auth";
import { generateServerMetadata } from "@/lib/seo/serverSEO";

export async function generateMetadata(): Promise<Metadata> {
  return generateServerMetadata("/login", {
    title: "Login | Dadhich Bus Services",
    description:
      "Sign in to your Dadhich Bus Services account to book tours, manage bookings, and access exclusive offers.",
    keywords: [
      "login",
      "sign in",
      "Dadhich Bus account",
      "bus service login",
      "tour booking login",
      "user account",
      "bus rental login",
      "travel account",
      "customer login",
      "member login",
    ],
    image: "/images/og-image.jpg",
  });
}

export default function LoginPage() {
  return (
    <PreventLoginRoute>
      <div className="min-h-screen bg-surface-primary">
        <LoginForm />
      </div>
    </PreventLoginRoute>
  );
}
