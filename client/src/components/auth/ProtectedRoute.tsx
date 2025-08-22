"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContextProvider";
import User from "@/utils/User";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "captain" | "guest";
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback,
}) => {
  const { isAuthenticated, isAdmin, isCaptain, isGuest } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setLoading(true);
      
      // Check if user is logged in
      if (!User.isLogin) {
        // Store intended route for redirect after login
        if (typeof window !== "undefined") {
          sessionStorage.setItem("intendedRoute", window.location.pathname);
        }
        router.push("/login");
        return;
      }

      // Check role permissions if required
      if (requiredRole) {
        let hasRequiredRole = false;
        
        switch (requiredRole) {
          case "admin":
            hasRequiredRole = User.isAdmin;
            break;
          case "captain":
            hasRequiredRole = User.isCaptain;
            break;
          case "guest":
            hasRequiredRole = User.isGuest;
            break;
          default:
            hasRequiredRole = true;
        }

        if (!hasRequiredRole) {
          router.push("/");
          return;
        }
      }

      setHasPermission(true);
      setLoading(false);
    };

    // Small delay to ensure auth context is initialized
    const timer = setTimeout(checkAuth, 200);
    return () => clearTimeout(timer);
  }, [router, requiredRole, isAuthenticated, isAdmin, isCaptain, isGuest]);

  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )
    );
  }

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
};
