# Express + MongoDB + TypeScript Boilerplate

Production-grade Node.js boilerplate focused on security, performance, and a scalable modular architecture.

## Highlights
- Security
  - Helmet, CORS, HPP, express-rate-limit, express-mongo-sanitize
  - CSRF (double-submit cookie/header) applied per-route on state-changing endpoints
  - Server-side sessions (Mongo) with hashed session IDs, step-up auth for sensitive actions
  - Role-based access (requireAuth, requireAdmin), audit logs for critical actions
- Reliability & DX
  - Centralized error handling with correlation ID (X-Error-Id)
  - Structured logging via pino with redaction of sensitive fields
  - Zod-based request validation
  - Layered architecture (routes → controllers → repositories → models)
- Domain modules
  - Auth: register, login, forgot/reset password (reset link email), self-update
  - Security: WebAuthn + TOTP (enroll/enable/disable/step-up)
  - Users (admin CRUD + list)
  - Website config (branding, contact, socials, SEO defaults)
  - Terms (versioned, current)
  - Places (country/state/city + bulk upload of cities)
  - SEO (per-route config, public fetch)
  - Tours (public search, facets, price range, upcoming, admin publish/draft)
  - Buses (admin CRUD)
  - Bookings (public create, payments init, bank transfers, admin list/mark-paid/refund)
  - Media (Cloudinary upload single/multi, rename, delete)
  - Inquiries (inquiry, contact-us, rentals, tour inquiries, plan tour, quick connect)
- Payments
  - Abstraction with mock and Razorpay provider
  - Initiate payment (UPI-first), webhook handling, manual bank transfer with reconcile
  - Refunds: provider-backed (Razorpay) or manual, with policy-based pro‑rating
- Email
  - SMTP mailer with branded HTML and EJS templates in `src/views/email/`
  - Templates: inquiry, contact, local/outstation rentals, tour inquiry, plan help, quick connect, password reset

## Getting Started
1. Copy `.env.example` to `.env` and set required keys (Mongo URI, JWT secret, SMTP, optional Razorpay/Cloudinary)
2. Install deps
   ```bash
   npm install
   ```
3. Dev
   ```bash
   npm run dev
   ```
4. Build & run
   ```bash
   npm run build && npm start
   ```

## Environment (excerpt)
- Core: `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`, `REQUEST_BODY_LIMIT`
- SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- Payments (optional): `PAYMENT_PROVIDER`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
- Cloudinary (optional): `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

## API Map (selected)
- Health: `GET /api/health`
- Auth (public): `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/forgot-password`
- Auth (private): `PUT /api/auth/me` (CSRF), `POST /api/auth/reset-password` (CSRF)
- Security (private): WebAuthn/TOTP options (GET), verify/enabled/disable/step-up (POST + CSRF)
- Tours (public): list, details, upcoming, price-range, facets
- SEO (public): list, by-route, by-id; admin mutations (CSRF + admin)
- Places (public): list countries/states/cities; admin CRUD (CSRF + admin)
- Bookings
  - Public: `POST /api/bookings` (CSRF), `POST /api/bookings/:code/payments/webhook` (no CSRF)
  - Private: admin list/mark-paid/refund (CSRF + admin), cancel (CSRF + auth)
- Media (admin): `/api/media/upload`, `/upload-multiple`, `/delete`, `/rename` (CSRF + admin)
- Inquiries (public): email/contact/rentals/tour/plan/quick-connect

## Security Notes
- CSRF applied only to state-changing routes; read-only GETs remain public.
- Webhooks are intentionally CSRF-exempt.
- Logging redacts auth headers, cookies, passwords, tokens, and session bodies.
- Error responses include `X-Error-Id` for support and tracing.

## Project Structure
```
src/
  controllers/    # request handlers
  lib/            # env, logger, cloudinary, payments
  middlewares/    # auth, csrf, validation, error, etc.
  models/         # mongoose schemas
  repositories/   # data access
  routes/         # route modules
  schemas/        # zod schemas
  utils/          # helpers (responses, errors, crypto)
  views/email/    # EJS email templates
```

## Roadmap / TODO
- Security & Auth
  - Session device list + revoke endpoints
  - Advanced admin endpoint rate limits and anomaly detection (failed logins, OTP/WebAuthn failures)
  - CSP (helmet contentSecurityPolicy) tuned for frontend origins
- Bookings/Payments
  - Signed deep-link/OTP flow for guest booking lookup
  - Refund webhooks full mapping; cancellation policy rules per-website
  - Seat availability checks across holds/confirmed; auto-expire unpaid bookings (TTL added) with notifications
- Tours/Places
  - More facets (state), pagination metadata, sorting presets
  - Validation rules (date consistency, capacity vs sources)
- Observability & Ops
  - Structured audit log viewer endpoints
  - Health checks for external providers (SMTP, Cloudinary, Razorpay)
- Frontend Integration
  - Signed upload tokens for direct-to-Cloudinary from Next.js
  - Theme color binding in email templates from Website config

## License
MIT
