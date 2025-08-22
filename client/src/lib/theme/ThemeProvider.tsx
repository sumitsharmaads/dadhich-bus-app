"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeContextType, lightTheme } from "./index";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  // Handle SSR - prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply CSS custom properties for light theme
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Set CSS custom properties for colors
    Object.entries(lightTheme.colors).forEach(([category, colors]) => {
      if (typeof colors === "object" && colors !== null) {
        Object.entries(colors as Record<string, string>).forEach(
          ([shade, color]) => {
            root.style.setProperty(`--color-${category}-${shade}`, color);
          }
        );
      }
    });

    // Set typography custom properties
    const typography = lightTheme.typography;
    root.style.setProperty(
      "--font-family-primary",
      typography.fontFamily.primary
    );
    root.style.setProperty(
      "--font-family-secondary",
      typography.fontFamily.secondary
    );
    root.style.setProperty("--font-family-mono", typography.fontFamily.mono);
  }, [mounted]);

  const value: ThemeContextType = {
    theme: lightTheme,
    isDark: false,
    toggleTheme: () => {},
    setTheme: () => {},
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Hook to get theme colors
export const useThemeColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

// Hook to get theme typography
export const useThemeTypography = () => {
  const { theme } = useTheme();
  return theme.typography;
};

// Hook to get theme spacing
export const useThemeSpacing = () => {
  const { theme } = useTheme();
  return theme.spacing;
};

// Hook to get theme shadows
export const useThemeShadows = () => {
  const { theme } = useTheme();
  return theme.shadows;
};

// Hook to get theme transitions
export const useThemeTransitions = () => {
  const { theme } = useTheme();
  return theme.transitions;
};
