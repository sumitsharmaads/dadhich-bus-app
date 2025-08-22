# WebsiteProvider Improvements

## Overview
The `WebsiteProvider` has been significantly improved to provide better error handling, caching, and data management for website configuration.

## Key Improvements

### 1. **Corrected API Endpoint**
- **Before**: Called `/config` (non-existent endpoint)
- **After**: Calls `/websites/by-host?host=${hostname}` (correct backend endpoint)

### 2. **Enhanced Error Handling**
- Added error state management
- Implemented retry logic (max 3 attempts)
- Better error messages for different failure scenarios
- Automatic cache clearing on errors

### 3. **Improved Caching Strategy**
- Fixed cache key from empty string to `website_expiry`
- 45-minute cache validity
- Automatic cache invalidation on errors
- Better cache management

### 4. **Service Layer Architecture**
- Created `websiteService` for API calls
- Centralized error handling
- Better separation of concerns
- Reusable service methods

### 5. **Data Transformation**
- Added `transformWebsiteData` utility
- Backward compatibility with existing frontend code
- Support for both new and legacy data structures
- Helper functions for common data access patterns

### 6. **Enhanced Context API**
- Added error state
- Retry functionality
- Loading states
- Better user experience

## Usage Examples

### Basic Usage
```tsx
import { useWebsite } from "@/contexts/WebsiteProvider";

const MyComponent = () => {
  const { websiteInfo, isLoading, error } = useWebsite();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>Brand: {websiteInfo?.branding?.brandName}</div>;
};
```

### With Error Boundary
```tsx
import { WebsiteErrorBoundary } from "@/components/common";

const App = () => (
  <WebsiteProvider>
    <WebsiteErrorBoundary>
      <YourAppContent />
    </WebsiteErrorBoundary>
  </WebsiteProvider>
);
```

### Using Helper Functions
```tsx
import { getWebsiteLogo, getWebsiteBrandName } from "@/utils/website";

const Header = () => {
  const { websiteInfo } = useWebsite();
  
  return (
    <header>
      <img src={getWebsiteLogo(websiteInfo)} alt="Logo" />
      <h1>{getWebsiteBrandName(websiteInfo)}</h1>
    </header>
  );
};
```

## Data Structure

### New Structure (Backend)
```typescript
{
  branding: { brandName, logo, preLogo },
  contact: { emails, phone, address },
  socials: { facebook, instagram, twitter, ... },
  seo: { metaTitle, metaDescription, ... },
  booking: { currencyCode, currencySymbol, ... },
  // ... more fields
}
```

### Legacy Structure (Frontend Compatibility)
```typescript
{
  brandname: string,
  logo: { id, url },
  phone: string,
  // ... legacy fields for backward compatibility
}
```

## Error Handling

### Retry Logic
- Automatically retries failed requests up to 3 times
- Exponential backoff between retries
- User can manually retry using `retryFetch()`

### Error States
- Network errors
- 404: Website not found
- 500: Server errors
- Invalid data responses

## Performance Optimizations

### Caching
- 45-minute cache validity
- Automatic cache invalidation
- Reduced API calls
- Faster page loads

### Loading States
- Immediate cache display
- Background refresh
- Smooth user experience

## Migration Notes

### Breaking Changes
- None - all changes are backward compatible

### New Features
- Error handling and retry logic
- Better caching
- Helper utility functions
- Enhanced context API

### Recommended Updates
- Use new helper functions for data access
- Implement error boundaries for better UX
- Leverage retry functionality for reliability
