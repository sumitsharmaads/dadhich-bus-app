# API Layer Documentation

This folder contains all the API-related functionality for the frontend application, organized in a clean and maintainable structure.

## 📁 Folder Structure

```
src/lib/api/
├── types/           # TypeScript interfaces and types
├── services/        # API service classes
├── validation/      # Client-side validation functions
├── axiosInstance.ts # Axios configuration and interceptors
├── service.ts       # Generic HTTP methods wrapper
├── index.ts         # Main export file
└── README.md        # This documentation
```

## 🚀 Quick Start

```typescript
import { authService, validateRegistration } from '@/lib/api';

// Register a new user
try {
  const result = await authService.register({
    fullname: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    password: "securepassword123"
  });
  
  console.log('Registration successful:', result);
} catch (error) {
  // Error handling is automatic with user-friendly alerts
  console.error('Registration failed:', error);
}
```

## 🔧 API Services

### Authentication Service (`authService`)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `register()` | `POST /auth/register` | Register new user | `RegisterRequest` |
| `login()` | `POST /auth/login` | User login | `LoginRequest` |
| `forgotPassword()` | `POST /auth/forgot-password` | Request password reset | `ForgotPasswordRequest` |
| `changePassword()` | `POST /auth/reset-password` | Change password | `ChangePasswordRequest` |
| `updateProfile()` | `POST /auth/me` | Update user profile | `SelfUpdateRequest` |

### Features

- ✅ **Automatic CSRF token handling** for all state-changing operations
- ✅ **Built-in error handling** with user-friendly alert messages
- ✅ **Rate limit detection** with appropriate user feedback
- ✅ **Session management** with automatic logout on expiration
- ✅ **Success notifications** for all successful operations

## 🛡️ Security Features

### CSRF Protection
- Automatically extracts CSRF tokens from cookies
- Includes tokens in all POST, PUT, PATCH, DELETE requests
- Handles token refresh from response headers

### Session Management
- Automatic session validation on app initialization
- Handles 401 (Unauthorized) responses with logout
- Manages 403 (Forbidden) responses with appropriate redirects

### Rate Limiting
- Detects 429 (Too Many Requests) responses
- Shows user-friendly retry timing information
- Prevents API abuse with proper feedback

## 📝 Validation

### Client-Side Validation
All validation functions match the backend Zod schema requirements:

```typescript
import { validateRegistration } from '@/lib/api';

const validation = validateRegistration({
  fullname: "John",
  email: "john@example.com",
  phone: "1234567890",
  password: "securepassword123"
});

if (!validation.isValid) {
  console.log('Validation errors:', validation.errors);
}
```

### Validation Rules

| Field | Rules |
|-------|-------|
| `fullname` | Required, 2-100 characters |
| `email` | Required, valid email format |
| `phone` | Optional, exactly 10 digits |
| `password` | Required, 10-128 characters (registration), 8-128 (login) |

## 🔄 Error Handling

### HTTP Status Code Handling

| Status | Action | User Feedback |
|--------|--------|---------------|
| 400 | Show validation error | "Invalid request data. Please check your input." |
| 401 | Logout user | "Session expired. Please login again." |
| 403 | Show access denied | "Access denied. You don't have permission for this action." |
| 404 | Show not found | "The requested information could not be found" |
| 409 | Show conflict | "Email already in use. Please use a different email address." |
| 429 | Show rate limit | "Rate limit exceeded. Please try again later." |
| 500+ | Show server error | "Server error. Please try again later." |

### Business Logic Errors
- Error codes 102, 105, 108 are handled with specific messages
- Automatic redirects for session-related errors
- Step-up authentication prompts for sensitive operations

## 🎯 Usage Examples

### Registration Form
```typescript
import { authService, validateRegistration } from '@/lib/api';

const handleSubmit = async (formData: RegisterRequest) => {
  // Client-side validation
  const validation = validateRegistration(formData);
  if (!validation.isValid) {
    setErrors(validation.errors);
    return;
  }

  try {
    const result = await authService.register(formData);
    // Success handling - automatic success alert shown
    router.push('/login');
  } catch (error) {
    // Error handling - automatic error alert shown
    // Form errors are already handled by the service
  }
};
```

### Login Form
```typescript
import { authService, validateLogin } from '@/lib/api';

const handleLogin = async (credentials: LoginRequest) => {
  const validation = validateLogin(credentials);
  if (!validation.isValid) {
    setErrors(validation.errors);
    return;
  }

  try {
    const result = await authService.login(credentials);
    // Success handling - automatic success alert shown
    // User is automatically logged in via session
  } catch (error) {
    // Error handling - automatic error alert shown
  }
};
```

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Base URL
- **Development**: `http://localhost:4000/api`
- **Production**: Set via `NEXT_PUBLIC_API_URL` environment variable

## 🚨 Troubleshooting

### Common Issues

1. **CSRF Token Missing**
   - Ensure cookies are enabled
   - Check if backend is setting `csrf_token` cookie

2. **Session Expiration**
   - User is automatically logged out on 401 responses
   - Check backend session configuration

3. **Rate Limiting**
   - Respect rate limits (20 requests per minute for auth endpoints)
   - Show appropriate user feedback

4. **Validation Errors**
   - Client-side validation prevents invalid requests
   - Backend validation provides additional security

## 📚 Best Practices

1. **Always use validation functions** before making API calls
2. **Handle errors gracefully** - the service provides user-friendly messages
3. **Use TypeScript interfaces** for type safety
4. **Respect rate limits** and provide good user experience
5. **Test error scenarios** to ensure proper user feedback

## 🔄 Future Updates

To add new API endpoints:

1. **Add types** in `types/` folder
2. **Create service methods** in appropriate service file
3. **Add validation** in `validation/` folder
4. **Update this documentation**

This structure makes it easy to maintain and extend the API layer while providing a consistent developer experience.
