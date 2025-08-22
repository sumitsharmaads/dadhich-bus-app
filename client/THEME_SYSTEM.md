# Modern Theme System Documentation

## Overview

This Next.js project features a comprehensive, modern theme system built with TypeScript, Tailwind CSS, and React Context. The theme system is designed to provide a consistent, scalable design foundation for travel/tourism websites.

## 🎨 Theme Architecture

### Core Components

1. **Theme Provider** (`src/lib/theme/ThemeProvider.tsx`)
   - Manages theme state (light/dark)
   - Handles SSR and hydration
   - Provides theme context to the entire app
   - Automatically syncs with localStorage and system preferences

2. **Theme Configuration** (`src/lib/theme/index.ts`)
   - TypeScript interfaces for type safety
   - Light and dark theme definitions
   - Comprehensive design tokens

3. **Tailwind Integration** (`tailwind.config.ts`)
   - Extended with custom theme tokens
   - CSS custom properties for dynamic theming
   - Responsive design utilities

4. **Global Styles** (`src/app/globals.css`)
   - CSS custom properties for theming
   - Base styles and typography
   - Dark mode support

## 🎯 Design Tokens

### Colors

#### Primary Colors (Brand)
```typescript
primary: {
  50: '#fdf2f8',   // Lightest
  100: '#fce7f3',
  200: '#fbcfe8',
  300: '#f9a8d4',
  400: '#f472b6',
  500: '#C22A54',   // Main brand color
  600: '#A82046',   // Hover state
  700: '#8a1c3a',
  800: '#6b162e',
  900: '#4d1022'    // Darkest
}
```

#### Secondary Colors
```typescript
secondary: {
  500: '#202542',   // Main secondary color
  // ... other shades
}
```

#### Semantic Colors
- **Success**: Green variants for positive actions
- **Warning**: Yellow variants for caution states
- **Error**: Red variants for error states
- **Info**: Blue variants for informational content

#### Neutral Colors
- **0-950**: Complete grayscale palette
- **Background**: Primary, secondary, tertiary surfaces
- **Text**: Primary, secondary, tertiary, inverse, disabled

### Typography

#### Font Families
```typescript
fontFamily: {
  primary: '"Poppins", sans-serif',    // Main body text
  secondary: '"Volkhov", serif',        // Headings
  mono: '"JetBrains Mono", monospace'   // Code
}
```

#### Font Sizes
- **xs** to **9xl**: Complete scale from 0.75rem to 8rem
- Responsive typography with line-height optimization

#### Font Weights
- **thin** to **black**: 100 to 900 weight scale

### Spacing

#### Spacing Scale
```typescript
spacing: {
  0: '0px',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  4: '1rem',       // 16px
  8: '2rem',       // 32px
  // ... up to 128: '32rem'
}
```

#### Border Radius
```typescript
borderRadius: {
  none: '0px',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px'
}
```

### Shadows

```typescript
shadows: {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000'
}
```

### Transitions

```typescript
transitions: {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms'
  },
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
}
```

## 🌙 Dark Mode Support

### Automatic Detection
- Detects system preference (`prefers-color-scheme: dark`)
- Remembers user preference in localStorage
- Smooth transitions between themes

### Dark Theme Colors
```typescript
dark: {
  background: {
    primary: '#0a0a0a',
    secondary: '#171717',
    tertiary: '#262626'
  },
  surface: {
    primary: '#171717',
    secondary: '#262626',
    tertiary: '#404040'
  },
  text: {
    primary: '#ededed',
    secondary: '#a3a3a3',
    tertiary: '#737373'
  }
}
```

## 🎛️ Usage Examples

### Using Theme Hooks

```typescript
import { useTheme, useThemeColors, useThemeTypography } from '@/lib/theme/ThemeProvider';

function MyComponent() {
  const { isDark, toggleTheme } = useTheme();
  const colors = useThemeColors();
  const typography = useThemeTypography();

  return (
    <div style={{ backgroundColor: colors.background.primary }}>
      <h1 style={{ fontFamily: typography.fontFamily.secondary }}>
        Hello World
      </h1>
      <button onClick={toggleTheme}>
        Toggle {isDark ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
}
```

### Theme Toggle Component

```typescript
import ThemeToggle from '@/components/ThemeToggle';

// Icon variant
<ThemeToggle variant="icon" size="md" />

// Switch variant
<ThemeToggle variant="switch" size="lg" />

// Button variant (default)
<ThemeToggle variant="button" size="sm" />
```

### Tailwind Classes

```jsx
// Using theme colors
<div className="bg-primary-500 text-white">
  Primary Button
</div>

// Using surface colors
<div className="bg-surface-secondary text-text-primary">
  Card Content
</div>

// Using typography
<h1 className="font-secondary text-4xl font-bold">
  Heading
</h1>

// Using spacing
<div className="p-4 m-8 space-y-4">
  Content with consistent spacing
</div>

// Using shadows
<div className="shadow-lg hover:shadow-xl">
  Elevated Card
</div>

// Using transitions
<button className="transition-all duration-200 ease-out">
  Smooth Button
</button>
```

## 🚀 Features

### 1. Type Safety
- Full TypeScript support
- IntelliSense for all theme tokens
- Compile-time error checking

### 2. Performance
- CSS custom properties for dynamic theming
- Minimal JavaScript overhead
- Optimized for SSR

### 3. Accessibility
- High contrast ratios
- Focus indicators
- Screen reader support

### 4. Responsive Design
- Mobile-first approach
- Breakpoint system
- Flexible layouts

### 5. Customization
- Easy to extend and modify
- Modular architecture
- Scalable design system

## 📁 File Structure

```
src/
├── lib/
│   └── theme/
│       ├── index.ts              # Theme definitions
│       └── ThemeProvider.tsx     # Context provider
├── components/
│   └── ThemeToggle.tsx           # Theme switcher
├── app/
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
└── tailwind.config.ts            # Tailwind configuration
```

## 🎨 Design Principles

### 1. Consistency
- Unified color palette
- Consistent spacing scale
- Standardized typography

### 2. Accessibility
- WCAG 2.1 AA compliance
- High contrast ratios
- Keyboard navigation support

### 3. Performance
- Minimal CSS bundle size
- Efficient theme switching
- Optimized for Core Web Vitals

### 4. Maintainability
- Clear naming conventions
- Modular architecture
- Comprehensive documentation

## 🔧 Customization

### Adding New Colors
```typescript
// In src/lib/theme/index.ts
export interface ThemeColors {
  // ... existing colors
  accent: {
    50: string;
    100: string;
    500: string;
    900: string;
  };
}
```

### Adding New Animations
```typescript
// In tailwind.config.ts
animation: {
  'bounce-slow': 'bounce 2s infinite',
  'pulse-fast': 'pulse 0.5s infinite',
}
```

### Custom Components
```typescript
// Create reusable themed components
const ThemedButton = ({ variant = 'primary', children }) => {
  const colors = useThemeColors();
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600',
    secondary: 'bg-secondary-500 hover:bg-secondary-600',
    outline: 'border border-primary-500 text-primary-500'
  };

  return (
    <button className={`px-4 py-2 rounded-lg transition-colors ${variants[variant]}`}>
      {children}
    </button>
  );
};
```

## 🧪 Testing

### Theme Switching
- Test light/dark mode toggle
- Verify localStorage persistence
- Check system preference detection

### Responsive Design
- Test on various screen sizes
- Verify breakpoint behavior
- Check mobile navigation

### Accessibility
- Test with screen readers
- Verify keyboard navigation
- Check color contrast ratios

## 📚 Best Practices

### 1. Use Semantic Colors
```jsx
// ✅ Good
<button className="bg-success-500 text-white">
  Success
</button>

// ❌ Avoid
<button className="bg-green-500 text-white">
  Success
</button>
```

### 2. Leverage Design Tokens
```jsx
// ✅ Good
<div className="p-4 m-8 space-y-4">
  Content
</div>

// ❌ Avoid
<div className="p-4 m-8 space-y-4" style={{ padding: '16px' }}>
  Content
</div>
```

### 3. Use Theme Hooks
```jsx
// ✅ Good
const colors = useThemeColors();
const typography = useThemeTypography();

// ❌ Avoid
const colors = {
  primary: '#C22A54',
  secondary: '#202542'
};
```

## 🚀 Future Enhancements

### 1. Theme Variants
- Support for multiple theme variants
- Seasonal themes
- Brand-specific themes

### 2. Advanced Animations
- Micro-interactions
- Page transitions
- Loading states

### 3. Component Library
- Pre-built themed components
- Storybook integration
- Design system documentation

### 4. Performance Optimizations
- CSS-in-JS optimization
- Critical CSS extraction
- Bundle size optimization

## 📖 Conclusion

This theme system provides a solid foundation for building modern, accessible, and maintainable web applications. It follows industry best practices and is designed to scale with your project's needs.

For questions or contributions, please refer to the project documentation or create an issue in the repository.
