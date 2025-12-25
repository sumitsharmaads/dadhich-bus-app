import React from "react";
import { Metadata } from "next";
import { generatePageSEO, seoEntryToMetadata } from "@/lib/seo/seoUtils";
import { seoService } from "@/lib/api/services/seo.service";
import { SignupForm, PreventLoginRoute } from "@/components/auth";
import { generateServerMetadata } from "@/lib/seo/serverSEO";

export async function generateMetadata(): Promise<Metadata> {
  return generateServerMetadata("/signup", {
    title: "Sign Up | Dadhich Bus Services",
    description:
      "Create your Dadhich Bus Services account to book tours, manage bookings, and access exclusive offers.",
    keywords: [
      "sign up",
      "register",
      "create account",
      "Dadhich Bus account",
      "bus service registration",
      "tour booking account",
      "user registration",
      "bus rental account",
      "travel account",
      "customer registration",
      "member signup",
    ],
    image: "/images/og-image.jpg",
  });
}

export default function SignupPage() {
  return (
    <PreventLoginRoute>
      <div className="min-h-screen bg-surface-primary">
        <SignupForm />
      </div>
    </PreventLoginRoute>
  );
}
