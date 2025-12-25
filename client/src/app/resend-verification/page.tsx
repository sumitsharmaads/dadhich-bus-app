import React from "react";
import { Metadata } from "next";
import { generatePageSEO, seoEntryToMetadata } from "@/lib/seo/seoUtils";
import { seoService } from "@/lib/api/services/seo.service";
import ResendVerificationClient from "./ResendVerificationClient";
import { generateServerMetadata } from "@/lib/seo/serverSEO";

export async function generateMetadata(): Promise<Metadata> {
  return generateServerMetadata("/resend-verification", {
    title: "Resend Verification Email | Dadhich Bus Services",
    description:
      "Resend verification email for your Dadhich Bus Services account. Get a new verification link to activate your account.",
    keywords: [
      "resend verification",
      "email verification",
      "account activation",
      "verification link",
      "Dadhich Bus verification",
      "account setup",
      "email confirmation",
      "user verification",
      "account activation email",
      "verification resend",
    ],
    image: "/images/og-image.jpg",
  });
}

const ResendVerificationPage = () => {
  return <ResendVerificationClient />;
};

export default ResendVerificationPage;
