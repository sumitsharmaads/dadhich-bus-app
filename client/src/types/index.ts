// Re-export all types from their respective modules
export * from "./user.types";
export * from "./website.types";
export * from "./api.types";

// Common utility types
export interface LoaderContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export interface SEOInterface {
  _id?: string;
  path: string;
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Form related types
export interface FormErrors {
  [key: string]: string;
}

export interface FormState<T> {
  values: T;
  errors: FormErrors;
  isSubmitting: boolean;
  isValid: boolean;
}

// Common component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Navigation and routing
export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isExternal?: boolean;
  children?: NavigationItem[];
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: string;
    end: string;
  };
  destinations?: string[];
  duration?: {
    min: number;
    max: number;
  };
  sortBy?: "price" | "duration" | "popularity" | "date";
  sortOrder?: "asc" | "desc";
}

// Theme and UI types
export interface ThemeConfig {
  mode: "light" | "dark";
  primaryColor: string;
  secondaryColor: string;
  fontSize: "small" | "medium" | "large";
}

// Notification types
export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
