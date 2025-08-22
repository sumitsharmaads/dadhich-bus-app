# FAQ System Setup

This document explains how to set up and use the FAQ system in the Dadhich Bus App.

## Backend Setup

### 1. New Files Created

- **Model**: `src/models/faqs.model.ts` - MongoDB schema for FAQs
- **Repository**: `src/repositories/faqs.repository.ts` - Database operations
- **Controller**: `src/controllers/faqs.controller.ts` - HTTP request handlers
- **Schema**: `src/schemas/faqs.schema.ts` - Request validation
- **Routes**: `src/routes/modules/faqs.route.ts` - API endpoints
- **Seed Script**: `src/scripts/seed-faqs.js` - Initial data population

### 2. API Endpoints

#### Public Endpoints (No Authentication Required)
- `GET /api/faqs` - Get current FAQs
- `GET /api/faqs/list` - Get all FAQ documents
- `GET /api/faqs/:id` - Get FAQ by ID

#### Admin Endpoints (Authentication + Admin Role Required)
- `POST /api/faqs` - Create new FAQ document
- `PUT /api/faqs/:id` - Update FAQ by ID
- `PUT /api/faqs/update` - Update current FAQs (used by admin panel)
- `DELETE /api/faqs/:id` - Delete FAQ by ID

### 3. Database Schema

```typescript
interface FAQDocument {
  questions: Array<{
    question: string;
    answer: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. Seeding Initial Data

To populate the database with sample FAQs:

```bash
cd server
npm run seed:faqs
```

This will create a default FAQ document with 5 common questions and answers.

## Frontend Setup

### 1. New Files Created

- **Service**: `client/src/lib/api/services/faqs.service.ts` - API communication
- **Updated Component**: `client/src/components/FaqAndTerms.tsx` - Public FAQ display
- **Updated Admin Page**: `client/src/app/admin/faqs/page.tsx` - FAQ management

### 2. Service Methods

```typescript
// Get current FAQs for public display
const faqs = await faqsService.getCurrentFAQs();

// Update FAQs from admin panel
const response = await faqsService.updateFAQs({ questions: faqArray });
```

### 3. Features

- **Public Display**: FAQs are displayed in an accordion format with expand/collapse
- **Rich Text Support**: Answers support HTML content (sanitized with DOMPurify)
- **Show More/Less**: Initially shows 3 FAQs, with option to expand to all
- **Error Handling**: Graceful fallback to mock data if API fails
- **Admin Management**: Full CRUD operations through admin panel
- **Responsive Design**: Mobile-friendly accordion interface

## Usage

### For Users
1. Navigate to the FAQ section on the website
2. Click on questions to expand and see answers
3. Use "Show More FAQs" to see all available questions

### For Admins
1. Access `/admin/faqs` in the admin panel
2. Add, edit, or delete FAQ questions and answers
3. Use the rich text editor for formatting answers
4. Save changes to update the public display

### For Developers
1. FAQs are stored as a single document with an array of question-answer pairs
2. The system automatically uses the most recent FAQ document
3. All HTML content is sanitized for security
4. The system includes fallback mock data for development/testing

## Security Features

- **CSRF Protection**: All state-changing operations require CSRF tokens
- **Rate Limiting**: API endpoints are rate-limited to prevent abuse
- **Input Validation**: All requests are validated using Zod schemas
- **HTML Sanitization**: User-generated HTML content is sanitized with DOMPurify
- **Authentication**: Admin operations require proper authentication and admin role

## Error Handling

- **API Failures**: Graceful fallback to mock data
- **Validation Errors**: Clear error messages for invalid input
- **Network Issues**: User-friendly error messages with retry options
- **Loading States**: Visual feedback during API operations

## Future Enhancements

- **FAQ Categories**: Group FAQs by topic or service type
- **Search Functionality**: Allow users to search through FAQs
- **FAQ Analytics**: Track which questions are most viewed
- **Multi-language Support**: Support for multiple languages
- **FAQ Feedback**: Allow users to rate helpfulness of answers
