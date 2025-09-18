/**
 * Route Path Utilities for SEO
 * Handles route normalization and validation
 */

/**
 * Normalize route path for consistent SEO handling
 * Examples:
 * - "/home/" -> "/home"
 * - "home" -> "/home"
 * - "/HOME" -> "/home"
 * - "/" -> "/"
 * - "" -> "/"
 */
export function normalizeRoutePath(routePath: string): string {
  if (!routePath || routePath === "") {
    return "/";
  }

  let normalized = routePath;

  // Ensure starts with /
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  // Remove trailing slash (except for root)
  if (normalized !== "/" && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  // Convert to lowercase for consistency
  normalized = normalized.toLowerCase();

  return normalized;
}

/**
 * Validate if a route path is valid for SEO
 */
export function isValidRoutePath(routePath: string): boolean {
  if (!routePath || typeof routePath !== "string") {
    return false;
  }

  const normalized = normalizeRoutePath(routePath);

  // Check for valid characters (alphanumeric, hyphens, underscores, forward slashes)
  const validPattern = /^\/[a-z0-9\-\/]*$/;

  return validPattern.test(normalized);
}

/**
 * Get route segments from a path
 * Example: "/about/team" -> ["about", "team"]
 */
export function getRouteSegments(routePath: string): string[] {
  const normalized = normalizeRoutePath(routePath);

  if (normalized === "/") {
    return [];
  }

  return normalized.split("/").filter((segment) => segment.length > 0);
}

/**
 * Get parent route from a path
 * Example: "/about/team" -> "/about"
 * Example: "/about" -> "/"
 * Example: "/" -> null
 */
export function getParentRoute(routePath: string): string | null {
  const segments = getRouteSegments(routePath);

  if (segments.length <= 1) {
    return null;
  }

  return `/${segments.slice(0, -1).join("/")}`;
}

/**
 * Check if a route is a sub-route of another
 * Example: isSubRoute("/about/team", "/about") -> true
 */
export function isSubRoute(routePath: string, parentPath: string): boolean {
  const normalizedRoute = normalizeRoutePath(routePath);
  const normalizedParent = normalizeRoutePath(parentPath);

  if (normalizedParent === "/") {
    return normalizedRoute !== "/";
  }

  return normalizedRoute.startsWith(normalizedParent + "/");
}

/**
 * Generate breadcrumb data from route path
 */
export function generateBreadcrumbFromRoute(
  routePath: string
): Array<{ name: string; path: string }> {
  const segments = getRouteSegments(routePath);
  const breadcrumbs = [{ name: "Home", path: "/" }];

  let currentPath = "";
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    const name = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({
      name,
      path: currentPath,
    });
  });

  return breadcrumbs;
}

/**
 * Common route patterns for validation
 */
export const ROUTE_PATTERNS = {
  // Static pages
  STATIC: /^\/(about|contact|services|faq|privacy|terms)$/,

  // Dynamic pages
  DYNAMIC: /^\/(tour|admin|profile)\/[\w-]+$/,

  // Auth pages
  AUTH: /^\/(login|signup|forgot-password|reset-password|verify-email)$/,

  // Service pages
  SERVICE: /^\/(local-bus-rental|outstation-bus-rental|tours)$/,

  // Admin pages
  ADMIN: /^\/admin(\/[\w-]+)*$/,
} as const;

/**
 * Get route type based on path
 */
export function getRouteType(
  routePath: string
): "static" | "dynamic" | "auth" | "service" | "admin" | "unknown" {
  const normalized = normalizeRoutePath(routePath);

  if (ROUTE_PATTERNS.STATIC.test(normalized)) return "static";
  if (ROUTE_PATTERNS.DYNAMIC.test(normalized)) return "dynamic";
  if (ROUTE_PATTERNS.AUTH.test(normalized)) return "auth";
  if (ROUTE_PATTERNS.SERVICE.test(normalized)) return "service";
  if (ROUTE_PATTERNS.ADMIN.test(normalized)) return "admin";

  return "unknown";
}
