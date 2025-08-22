import React from "react";
import { Metadata } from "next";
import { generateMetadata, createPageSEO } from "@/utils/seo";
import { LoginForm, PreventLoginRoute } from "@/components/auth";

export const metadata: Metadata = generateMetadata(
  createPageSEO({
    title: "Login - Travel & Tourism | Sign In to Your Account",
    description:
      "Sign in to your Travel & Tourism account to book tours, manage bookings, and access exclusive offers.",
    keywords: "login, sign in, travel account, tourism, book tours",
  })
);

export default function LoginPage() {
  return (
    <PreventLoginRoute>
      <div className="min-h-screen bg-surface-primary">
        <LoginForm />
      </div>
    </PreventLoginRoute>
  );
}
