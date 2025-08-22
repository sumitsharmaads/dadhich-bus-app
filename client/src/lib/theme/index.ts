// Modern Theme System for Travel/Tourism Website
// Based on Material Design 3 and modern web standards
// Adapted from client folder analysis

export interface ThemeColors {
  // Primary Brand Colors (from client analysis)
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string; // Main brand color #C22A54
    600: string;
    700: string;
    800: string;
    900: string;
  };

  // Secondary Colors (from client analysis)
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string; // #202542 from client
    600: string;
    700: string;
    800: string;
    900: string;
  };

  // Neutral Colors
  neutral: {
    0: string;
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };

  // Semantic Colors
  success: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };

  warning: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };

  error: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };

  info: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };

  // Background Colors
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };

  // Surface Colors
  surface: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };

  // Text Colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    disabled: string;
  };
}

export interface ThemeTypography {
  fontFamily: {
    primary: string; // Poppins from client
    secondary: string; // Volkhov from client
    mono: string;
  };

  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
    "5xl": string;
    "6xl": string;
    "7xl": string;
    "8xl": string;
    "9xl": string;
  };

  fontWeight: {
    thin: number;
    extralight: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
    black: number;
  };

  lineHeight: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };

  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
}

export interface ThemeSpacing {
  spacing: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    8: string;
    10: string;
    12: string;
    16: string;
    20: string;
    24: string;
    32: string;
    40: string;
    48: string;
    56: string;
    64: string;
    80: string;
    96: string;
    128: string;
  };

  borderRadius: {
    none: string;
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    full: string;
  };

  borderWidth: {
    0: string;
    1: string;
    2: string;
    4: string;
    8: string;
  };
}

export interface ThemeShadows {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  inner: string;
  none: string;
}

export interface ThemeBreakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
}

export interface ThemeTransitions {
  duration: {
    75: string;
    100: string;
    150: string;
    200: string;
    300: string;
    500: string;
    700: string;
    1000: string;
  };

  easing: {
    linear: string;
    in: string;
    out: string;
    inOut: string;
  };
}

export interface ThemeZIndex {
  hide: number;
  auto: string;
  base: number;
  docked: number;
  dropdown: number;
  sticky: number;
  banner: number;
  overlay: number;
  modal: number;
  popover: number;
  skipLink: number;
  toast: number;
  tooltip: number;
}

export interface Theme {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  shadows: ThemeShadows;
  breakpoints: ThemeBreakpoints;
  transitions: ThemeTransitions;
  zIndex: ThemeZIndex;
}

// Light Theme - Based on client analysis
export const lightTheme: Theme = {
  colors: {
    primary: {
      50: "#fdf2f8",
      100: "#fce7f3",
      200: "#fbcfe8",
      300: "#f9a8d4",
      400: "#f472b6",
      500: "#C22A54", // Your brand color from client
      600: "#A82046", // Hover color from client
      700: "#8a1c3a",
      800: "#6b162e",
      900: "#4d1022",
    },
    secondary: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#202542", // Secondary color from client
      600: "#1a1f35",
      700: "#141928",
      800: "#0e131b",
      900: "#080a0e",
    },
    neutral: {
      0: "#ffffff",
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
      950: "#0a0a0a",
    },
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
    },
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
    },
    error: {
      50: "#fef2f2",
      100: "#fee2e2",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
    },
    info: {
      50: "#eff6ff",
      100: "#dbeafe",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
    },
    background: {
      primary: "#ffffff",
      secondary: "#fafafa",
      tertiary: "#f5f5f5",
      inverse: "#171717",
    },
    surface: {
      primary: "#ffffff",
      secondary: "#fafafa",
      tertiary: "#f5f5f5",
      inverse: "#171717",
    },
    text: {
      primary: "#171717",
      secondary: "#525252",
      tertiary: "#737373",
      inverse: "#ffffff",
      disabled: "#a3a3a3",
    },
  },
  typography: {
    fontFamily: {
      primary: '"Poppins", sans-serif', // From client
      secondary: '"Volkhov", serif', // From client
      mono: '"JetBrains Mono", monospace',
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
      "7xl": "4.5rem",
      "8xl": "6rem",
      "9xl": "8rem",
    },
    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },
  spacing: {
    spacing: {
      0: "0px",
      1: "0.25rem",
      2: "0.5rem",
      3: "0.75rem",
      4: "1rem",
      5: "1.25rem",
      6: "1.5rem",
      8: "2rem",
      10: "2.5rem",
      12: "3rem",
      16: "4rem",
      20: "5rem",
      24: "6rem",
      32: "8rem",
      40: "10rem",
      48: "12rem",
      56: "14rem",
      64: "16rem",
      80: "20rem",
      96: "24rem",
      128: "32rem",
    },
    borderRadius: {
      none: "0px",
      sm: "0.125rem",
      base: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      "2xl": "1rem",
      "3xl": "1.5rem",
      full: "9999px",
    },
    borderWidth: {
      0: "0px",
      1: "1px",
      2: "2px",
      4: "4px",
      8: "8px",
    },
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    none: "0 0 #0000",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  transitions: {
    duration: {
      75: "75ms",
      100: "100ms",
      150: "150ms",
      200: "200ms",
      300: "300ms",
      500: "500ms",
      700: "700ms",
      1000: "1000ms",
    },
    easing: {
      linear: "linear",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
  zIndex: {
    hide: -1,
    auto: "auto",
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1020,
    banner: 1030,
    overlay: 1040,
    modal: 1050,
    popover: 1060,
    skipLink: 1070,
    toast: 1080,
    tooltip: 1090,
  },
};

// Dark Theme
export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: {
      primary: "#0a0a0a",
      secondary: "#171717",
      tertiary: "#262626",
      inverse: "#ffffff",
    },
    surface: {
      primary: "#171717",
      secondary: "#262626",
      tertiary: "#404040",
      inverse: "#ffffff",
    },
    text: {
      primary: "#ededed",
      secondary: "#a3a3a3",
      tertiary: "#737373",
      inverse: "#171717",
      disabled: "#525252",
    },
  },
};

// Export theme tokens for easy access
export const themeTokens = {
  light: lightTheme,
  dark: darkTheme,
};

// Theme context type
export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}
