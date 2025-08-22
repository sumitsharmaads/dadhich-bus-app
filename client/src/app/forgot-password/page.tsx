import React from "react";
import { Metadata } from "next";
import { generateMetadata, createPageSEO } from "@/utils/seo";
import { ForgotPasswordForm, PreventLoginRoute } from "@/components/auth";

export const metadata: Metadata = generateMetadata(
  createPageSEO({
    title: "Forgot Password - Travel & Tourism | Reset Your Password",
    description:
      "Reset your Travel & Tourism account password. Enter your email to receive password reset instructions.",
    keywords: "forgot password, reset password, password recovery, travel account",
  })
);

export default function ForgotPasswordPage() {
  return (
    <PreventLoginRoute>
      <div className="min-h-screen bg-surface-primary">
        <ForgotPasswordForm />
      </div>
    </PreventLoginRoute>
  );
}
