import React from "react";
import { Metadata } from "next";
import { generateServerMetadata } from "@/lib/seo/serverSEO";
import ForgotPasswordClient from "./ForgotPasswordClient";

export async function generateMetadata(): Promise<Metadata> {
  return generateServerMetadata("/forgot-password", {
    title: "Forgot Password | Dadhich Bus Services",
    description: "Reset your Dadhich Bus Services account password. Enter your email to receive a secure password reset link.",
    keywords: [
      "forgot password",
      "password reset",
      "account recovery",
      "Dadhich Bus password",
      "reset password",
      "account security",
      "password recovery",
      "login help",
      "account access",
      "secure reset"
    ],
    image: "/images/og-image.jpg",
  });
}

const ForgotPasswordPage = () => {
  return <ForgotPasswordClient />;
};

export default ForgotPasswordPage;
