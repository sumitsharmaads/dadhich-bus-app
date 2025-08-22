"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContextProvider";
import DummyFallback from "@/components/common/DummyFallback";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  redirectAuthenticated?: boolean;
}

/**
 * PublicRoute - For routes that should redirect authenticated users
 * Useful for login, signup, forgot password pages
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = "/",
  redirectAuthenticated = true,
}) => {
  const { isAuthenticated, state: user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);

      if (redirectAuthenticated && isAuthenticated && user) {
        // Redirect authenticated users to appropriate dashboard
        let redirectPath = redirectTo;

        if (redirectTo === "/" && user.roleType === 0) {
          // Admin
          redirectPath = "/admin";
        }

        router.push(redirectPath);
        setIsLoading(false);
        return;
      }

      setShouldShow(true);
      setIsLoading(false);
    };

    // Add a small delay to prevent flash
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, redirectTo, redirectAuthenticated, router]);

  if (isLoading) {
    return <DummyFallback message="Loading..." />;
  }

  if (!shouldShow) {
    return null; // Router will handle redirect
  }

  return <>{children}</>;
};

/**
 * PreventLoginRoute - Specific for auth pages (login, signup, etc.)
 * Redirects authenticated users to dashboard
 */
export const PreventLoginRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <PublicRoute redirectAuthenticated={true}>{children}</PublicRoute>;
