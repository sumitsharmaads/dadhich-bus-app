# Dadhich Bus Service - Next.js Frontend

This is the Next.js frontend for Dadhich Bus Service, designed to work seamlessly with the Express backend in a monorepo structure.

## Project Structure

```
dadhich-bus-app/
├── server/                 # Express backend (port 4000)
├── client/                 # Next.js frontend (port 3000)
├── package.json            # Root package.json for monorepo management
└── README.md               # Project documentation
```

## Features

- **🚌 Bus Rental Services**: Local and outstation bus rental options
- **🌍 Tour Packages**: Curated tour experiences across India
- **🔐 User Authentication**: Secure login/signup with JWT
- **📱 Responsive Design**: Mobile-first approach with Material-UI
- **🔍 SEO Optimized**: Dynamic metadata, sitemaps, and robots.txt
- **🎨 Modern UI**: Beautiful interface with Tailwind CSS and Framer Motion
- **📊 Admin Dashboard**: Comprehensive admin panel for business management
- **💳 Payment Integration**: Razorpay payment gateway support
- **📧 Communication**: Email notifications and OTP verification
- **🔒 Security**: CSRF protection, rate limiting, and input sanitization

## Tech Stack

### Frontend
- **Next.js 15.4.6** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI** - Component library
- **Framer Motion** - Animation library
- **Chart.js** - Data visualization
- **Axios** - HTTP client

### Backend Integration
- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Multer** - File uploads
- **Cloudinary** - Image management

## Development

### Prerequisites
- Node.js 20.x or higher
- MongoDB instance
- Git

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd dadhich-bus-app
   npm run install-all
   ```

2. **Environment Configuration:**
   
   Create `server/.env` file:
   ```env
   NODE_ENV=development
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/dadhich-bus-app
   CORS_ORIGIN=http://localhost:3000,http://localhost:4000
   JWT_SECRET=your-jwt-secret-key
   JWT_EXPIRES_IN=7d
   RATE_LIMIT_WINDOW_MS=600000
   RATE_LIMIT_MAX=1000
   REQUEST_BODY_LIMIT=10mb
   SESSION_SECRET=your-session-secret
   ```

   Create `client/.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Start Development Servers:**
   ```bash
   # Start both frontend and backend concurrently
   npm run dev
   
   # Or start individually:
   npm run dev:client    # Frontend (port 3000)
   npm run dev:server    # Backend (port 4000)
   ```

## Available Scripts

### Root Level
- `npm run install-all` - Install dependencies for both client and server
- `npm run dev` - Start both development servers concurrently
- `npm run dev:client` - Start only the Next.js frontend
- `npm run dev:server` - Start only the Express backend
- `npm run build` - Build both client and server
- `npm run start` - Start production server

### Client Level
- `npm run dev` - Start Next.js development server
- `npm run build` - Build Next.js application
- `npm run start` - Start Next.js production server
- `npm run lint` - Run ESLint

## Project Structure

### Client (`/client`)
```
src/
├── app/                   # Next.js App Router
│   ├── (routes)/         # Route groups
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   ├── sitemap.ts        # Dynamic sitemap generation
│   └── robots.ts         # Robots.txt generation
├── components/            # Reusable UI components
├── contexts/              # React contexts
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

### Key Pages
- **Home** (`/`) - Landing page with services overview
- **About Us** (`/aboutus`) - Company information
- **Services** (`/services`) - Service offerings
- **Tours** (`/tours`) - Tour packages
- **Bus Rental** (`/local-bus-rental`, `/outstation-bus-rental`)
- **Contact** (`/contact`) - Contact information
- **Authentication** (`/login`, `/signup`, `/forgot-password`)
- **User Profile** (`/profile`) - User dashboard
- **Admin Panel** (`/admin`) - Business management

## API Integration

The frontend communicates with the Express backend through well-defined API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Tours & Services
- `GET /api/tours` - Get all tours
- `GET /api/tours/:id` - Get tour details
- `POST /api/tours` - Create new tour (admin)
- `PUT /api/tours/:id` - Update tour (admin)

### Bus Management
- `GET /api/buses` - Get available buses
- `POST /api/buses/rent` - Request bus rental
- `GET /api/buses/rentals` - Get rental history

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/bookings` - Get user bookings

## SEO Features

- **Dynamic Metadata**: Page-specific meta tags and Open Graph data
- **Sitemap Generation**: Automatic XML sitemap with `MetadataRoute.Sitemap`
- **Robots.txt**: Search engine crawling instructions
- **Structured Data**: JSON-LD markup for better search visibility
- **Performance**: Optimized images and lazy loading

## Security Features

- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API request throttling
- **Input Sanitization**: MongoDB injection and XSS prevention
- **JWT Authentication**: Secure token-based authentication
- **CORS Configuration**: Controlled cross-origin access
- **Helmet**: Security headers and middleware

## Deployment

### Render (Recommended)
The project is configured for single deployment on Render:

1. **Build Command**: `npm run render-build`
2. **Start Command**: `npm run render-start`
3. **Environment**: Node.js 20.x

### Other Platforms
- **Vercel**: Deploy client separately
- **Railway**: Full-stack deployment
- **Heroku**: Container-based deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## License

This project is proprietary software owned by Dadhich Bus Service.

---

**Built with ❤️ for Dadhich Bus Service**
