import React from "react";
import { Metadata } from "next";
import { generateMetadata, createPageSEO } from "@/utils/seo";
import { SignupForm, PreventLoginRoute } from "@/components/auth";

export const metadata: Metadata = generateMetadata(
  createPageSEO({
    title: "Sign Up - Travel & Tourism | Create Your Account",
    description:
      "Create your Travel & Tourism account to book tours, manage bookings, and access exclusive offers.",
    keywords: "sign up, register, create account, travel account, tourism",
  })
);

export default function SignupPage() {
  return (
    <PreventLoginRoute>
      <div className="min-h-screen bg-surface-primary">
        <SignupForm />
      </div>
    </PreventLoginRoute>
  );
}
