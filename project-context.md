# 1. PROJECT OVERVIEW

## Purpose

Invoiss is a comprehensive invoicing and billing platform designed for small to medium-sized businesses in Nigeria. It enables users to create, send, and manage professional invoices, track payments, and manage customer relationships.

## Real-World Problem Solved

- Eliminates manual invoice creation using spreadsheets or basic templates
- Provides automated payment tracking and overdue notifications
- Enables businesses to accept payments through integrated payment gateways (Nomba)
- Offers professional branding and customization for business credibility
- Solves cash flow management through payment milestones and scheduling

## Target Users and Roles

- **Individual Entrepreneurs**: Freelancers and sole proprietors needing simple invoicing
- **Small Businesses**: Companies with 1-50 employees requiring professional invoicing
- **Accountants/Bookkeepers**: Managing invoices on behalf of multiple clients
- **Admin Users**: Platform administrators managing system settings and user accounts

## Core Features Implemented

- User registration and authentication with role-based access
- Customer management (CRUD operations)
- Invoice creation with customizable templates
- Payment tracking and milestone-based payments
- Bank account integration for payment details
- Dashboard with business analytics
- Email notifications for invoices
- Subscription management (Basic/Pro plans)
- Team collaboration features
- Admin panel for system management
- Image upload for logos and templates

## Features Planned but NOT Implemented

- Full Nomba payment gateway integration (API keys configured but not fully wired)
- Wallet system for receiving payments directly
- Advanced reporting and analytics
- Mobile app companion
- API for third-party integrations
- Multi-currency support (currently NGN only)
- Automated payment reminders
- Invoice PDF generation and download
- Advanced template customization
- Bulk invoice operations

# 2. TECH STACK

## Frameworks and Versions

- **Next.js 16.1.1**: React framework with App Router for full-stack development
- **React 19.2.3**: UI library with modern hooks and concurrent features
- **TypeScript 5**: Type-safe JavaScript with strict mode enabled

## Language Choices

- **TypeScript**: Primary language for type safety and developer experience
- **JavaScript**: Used in configuration files and some utilities

## Database and ORM

- **PostgreSQL**: Primary database hosted on NeonDB
- **Prisma 6.18.0**: ORM for type-safe database operations with schema migrations

## Auth Strategy

- **NextAuth.js 4.24.11**: JWT-based authentication with credentials provider
- **bcryptjs**: Password hashing for secure storage
- **JWT**: Token-based sessions with custom claims (planType, accountType, role)

## Third-Party Integrations

- **Resend**: Email service for invoice notifications and password resets
- **Cloudinary**: Image storage and optimization for logos and templates
- **Nomba**: Nigerian payment gateway (configured but not fully implemented)
- **React Email**: HTML email templates with Tailwind CSS

## Hosting/Deployment Assumptions

- **Vercel**: Primary deployment platform (vercel.json present)
- **NeonDB**: Managed PostgreSQL hosting
- **Development**: Local PostgreSQL with connection pooling

# 3. ARCHITECTURE

## Overall Architectural Style

Modular monolith with clear separation of concerns. Next.js App Router enables co-located API routes and UI components while maintaining server/client boundaries.

## Client vs Server Responsibilities

**Client (Browser):**

- UI rendering and user interactions
- Form validation and state management
- API calls via React Query
- Route navigation and protected routes

**Server (Next.js API Routes):**

- Authentication and authorization
- Database operations via Prisma
- Business logic validation
- Email sending and file uploads
- External API integrations

## Data Flow

```
User Action → Client Component → API Route → Validation → Prisma Query → Database
                      ↓
Response ← API Route ← Business Logic ← Database Result
```

## Auth Flow

```
Login Form → /api/auth/[...nextauth] → Credentials Provider → Prisma User Lookup
                      ↓
bcrypt.compare() → JWT Token Creation → Session Storage → Protected Routes
```

## Error Handling Strategy

- **Client**: React Query error boundaries and toast notifications (Sonner)
- **Server**: Try-catch blocks with structured error responses
- **Validation**: Zod schemas for input validation with detailed error messages
- **Database**: Prisma error handling with user-friendly messages

## State Management Approach

- **Server State**: React Query (TanStack Query) for API data caching and synchronization
- **Client State**: Zustand for user session and global UI state
- **Form State**: React Hook Form with Zod validation
- **Session State**: NextAuth session provider

# 4. PROJECT STRUCTURE

## Full Directory Tree

```
/
├── prisma/
│   ├── schema.prisma          # Database schema and models
│   ├── seed.ts               # Database seeding script
│   └── migrations/           # Prisma migration files
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/           # Authentication routes (login, register, etc.)
│   │   ├── (dashboard)/      # Protected dashboard routes
│   │   │   ├── dashboard/    # Main dashboard page
│   │   │   └── [other routes]
│   │   ├── (marketing)/      # Public marketing pages
│   │   ├── admin/            # Admin-only routes
│   │   ├── api/              # API routes
│   │   │   ├── analytics/    # Dashboard statistics
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── bank-accounts/# Bank account management
│   │   │   ├── billing/      # Subscription management
│   │   │   ├── customers/    # Customer CRUD
│   │   │   ├── invoices/     # Invoice operations
│   │   │   ├── profile/      # User profile updates
│   │   │   ├── templates/    # Invoice templates
│   │   │   ├── upload/       # File upload handling
│   │   │   └── wallet/       # Payment wallet (Pro feature)
│   │   ├── contact/          # Contact page
│   │   ├── features/         # Features page
│   │   ├── pricing/          # Pricing page
│   │   └── globals.css       # Global styles
│   ├── components/           # Reusable UI components
│   │   ├── admin/            # Admin-specific components
│   │   ├── auth/             # Authentication forms
│   │   ├── bank-accounts/    # Bank account components
│   │   ├── billing/          # Subscription components
│   │   ├── common/           # Shared utilities
│   │   ├── customers/        # Customer management
│   │   ├── dashboard/        # Dashboard layout and widgets
│   │   ├── email/            # Email templates
│   │   ├── invoice/          # Invoice-related components
│   │   ├── landing/          # Marketing page components
│   │   ├── layout/           # Layout components
│   │   ├── providers/        # React context providers
│   │   └── ui/               # Base UI components (Radix UI)
│   ├── lib/                  # Utility libraries
│   │   ├── api/              # Client-side API functions
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── mail.ts           # Email utilities
│   │   ├── nomba.ts          # Nomba payment integration
│   │   ├── prisma.ts         # Prisma client instance
│   │   ├── types.ts          # TypeScript type definitions
│   │   └── utils.ts          # General utilities
│   ├── stores/               # Zustand state stores
│   │   └── userStore.ts      # User state management
│   └── types/                # Type definitions
│       ├── index.ts          # Main types (currently empty)
│       └── next-auth.d.ts    # NextAuth type extensions
├── public/                   # Static assets
│   └── images/               # Image assets
├── components.json           # shadcn/ui configuration
├── eslint.config.mjs         # ESLint configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── vercel.json               # Vercel deployment config
```

## App Router Structure

Uses Next.js App Router with route groups for organization:

- `(auth)`: Authentication pages (login, register, password reset)
- `(dashboard)`: Protected business dashboard pages
- `(marketing)`: Public marketing pages (pricing, features, contact)

## Separation of Concerns

- **Routes**: Page components handle routing and layout
- **Components**: UI components focused on presentation
- **API Routes**: Server-side logic and database operations
- **Lib**: Shared utilities and configurations
- **Types**: Type definitions for type safety
- **Stores**: Global state management

# 5. DOMAIN MODELS & DATA

## Prisma Schema Overview

The application uses PostgreSQL with Prisma ORM. Key models include User, Invoice, Customer, Payment, and supporting entities.

## Key Entities

### User

- Core user account with authentication
- Supports individual and company accounts
- Subscription management (Basic/Pro plans)
- Role-based access (USER/ADMIN)
- Trial period handling

### Profile

- Extended user information
- Business details for invoicing
- Logo and branding information
- Contact information

### Customer

- Client information for invoicing
- Contact details and addresses
- Linked to invoices and payments

### Invoice

- Core business entity
- Comprehensive invoice data including items, taxes, discounts
- Payment tracking and milestones
- Status workflow (Draft → Sent → Paid)
- Template and customization support

### Payment & Wallet

- Payment records for invoices
- Wallet system for Pro users
- Transaction history and balances
- Nomba integration for payment processing

## Relationships

```
User (1) ──── (N) Invoice
User (1) ──── (N) Customer
User (1) ──── (N) BankAccount
User (1) ──── (1) Profile
User (1) ──── (1) Subscription
User (1) ──── (1) Wallet
Invoice (1) ──── (N) InvoiceItem
Invoice (1) ──── (N) PaymentMilestone
Invoice (1) ──── (N) InvoicePayment
Customer (1) ──── (N) Invoice
```

## Important Constraints

- Invoice numbers are auto-generated and unique per user
- Users can only access their own data (userId foreign keys)
- Email uniqueness across all users
- Cascade deletes for related data
- Status transitions are controlled (cannot go backwards)

## Business Rules Enforced at Data Level

- Trial periods default to 7 days for new users
- Pro plan required for wallet and advanced features
- Invoice totals calculated from items + tax - discount
- Payment milestones must sum to total amount
- Only one default bank account per user

# 6. KEY FLOWS (STEP-BY-STEP)

## Authentication Flow

1. **Entry Point**: `/login` or `/register` pages
2. **Validation**: Zod schema validation on client and server
3. **Registration**:
   - Check system settings (registration open, domain blocking)
   - Hash password with bcrypt
   - Create user with 7-day trial
   - Create profile with business details
4. **Login**:
   - Verify credentials against database
   - Check maintenance mode and bans
   - Generate JWT with custom claims
5. **Session**: Stored in HTTP-only cookies via NextAuth
6. **Failure Cases**: Invalid credentials, banned accounts, maintenance mode

## Invoice Creation Flow

1. **Entry Point**: `/dashboard/invoices/new` page
2. **Form Validation**: React Hook Form with Zod schema
3. **Auto-numbering**: Generate next invoice number (INV-0001 format)
4. **Database Creation**:
   - Create invoice with items
   - Link customer and bank account
   - Create payment milestones if scheduled
5. **Response**: Return complete invoice data with relations
6. **Failure Cases**: Validation errors, database constraints, unauthorized access

## Dashboard Loading Flow

1. **Entry Point**: `/dashboard` page load
2. **Auth Check**: NextAuth session validation
3. **Parallel API Calls**:
   - `/api/analytics` for stats
   - React Query caching
4. **Data Aggregation**:
   - Count invoices and customers
   - Sum payments and pending amounts
   - Fetch recent invoices
5. **UI Rendering**: Stats cards and recent activity
6. **Failure Cases**: Network errors, auth failures, database issues

## Payment Processing Flow (Planned)

1. **Entry Point**: Invoice payment link or wallet deposit
2. **Nomba Integration**: API calls to payment gateway
3. **Webhook Handling**: Update payment status
4. **Database Updates**:
   - Record payment transaction
   - Update invoice balance
   - Credit wallet if applicable
5. **Notifications**: Email confirmations
6. **Failure Cases**: Payment gateway errors, webhook failures

# 7. IMPORTANT FILES

## Core Configuration

- **prisma/schema.prisma**: Database schema, models, relationships, enums
- **src/lib/auth.ts**: NextAuth configuration, providers, callbacks
- **src/lib/prisma.ts**: Prisma client singleton instance
- **package.json**: Dependencies, scripts, Prisma configuration

## API Routes

- **src/app/api/auth/register/route.ts**: User registration with validation
- **src/app/api/invoices/route.ts**: Invoice CRUD operations
- **src/app/api/analytics/route.ts**: Dashboard statistics aggregation

## Components

- **src/components/dashboard/DashboardLayout.tsx**: Main dashboard wrapper
- **src/components/invoice/InvoiceForm.tsx**: Complex invoice creation form
- **src/components/auth/LoginForm.tsx**: Authentication UI

## Utilities

- **src/lib/api/action.ts**: Client-side API functions with error handling
- **src/lib/types.ts**: TypeScript interfaces for API responses
- **src/lib/utils.ts**: General utility functions (formatting, etc.)

## Assumptions

- All API routes assume authenticated users via NextAuth session
- Database operations use user-scoped queries for security
- File uploads handled via Cloudinary for scalability
- Email templates use React Email for consistency

## Edge Cases Handled

- Invoice number collisions (auto-increment logic)
- Trial expiration and subscription management
- Maintenance mode blocking non-admin users
- Domain-based email blocking for spam prevention

# 8. CURRENT STATE (VERY IMPORTANT)

## What is Fully Implemented

- User registration and authentication system
- Basic dashboard with statistics
- Customer management (create, read, update, delete)
- Invoice creation with items, taxes, discounts
- Invoice status tracking and basic CRUD
- Bank account management
- Email notifications infrastructure
- Admin panel for user and system management
- Responsive UI with Tailwind CSS and Radix components
- Database schema with all core entities
- Type-safe API with Zod validation
- Basic subscription plan structure

## What is Partially Implemented

- Payment milestones (created but not fully tracked)
- Invoice templates (basic structure, no customization UI)
- Wallet system (database model exists, no UI or logic)
- Team collaboration (database model, no UI)
- Nomba integration (API keys configured, no actual payment flow)
- Image upload (Cloudinary configured, basic usage)

## What is NOT Implemented

- Actual payment processing through Nomba
- Invoice PDF generation and download
- Automated payment reminders
- Advanced reporting and analytics
- Mobile responsiveness beyond basic breakpoints
- Multi-currency support
- Bulk operations
- API for external integrations
- Advanced template editor
- Wallet deposit/withdrawal UI
- Team member invitations and permissions UI

## Where Development Stopped

Development appears to have stopped after implementing core CRUD operations and basic dashboard functionality. The foundation is solid with authentication, database schema, and basic invoice management, but payment processing and advanced features remain incomplete.

## What the Next Logical Task Should Be

Implement the Nomba payment gateway integration to enable actual payment processing, starting with:

1. Complete the payment flow in invoice creation
2. Add payment webhook handlers
3. Implement wallet funding and withdrawals
4. Add payment status updates and notifications

# 9. KNOWN ISSUES & TECH DEBT

## Bugs

- Invoice numbering may have race conditions in high-concurrency scenarios
- No duplicate invoice number validation beyond auto-increment
- Payment milestone calculations may not handle edge cases properly

## Missing Validation

- No rate limiting on API endpoints
- Insufficient input sanitization for HTML content in emails
- No validation for invoice total calculations on client side

## Performance Concerns

- Dashboard analytics queries could be optimized with database indexes
- No caching strategy for frequently accessed data
- Image uploads not optimized for different screen sizes

## Security Concerns

- Password reset tokens may be vulnerable to timing attacks
- No CSRF protection on API routes
- File upload restrictions not fully implemented
- Admin routes lack additional security measures

## Areas Needing Refactor

- API response types are inconsistent across endpoints
- Error handling patterns vary between routes
- Some components have mixed concerns (UI + business logic)
- Database queries could be abstracted into service layers

# 10. ASSUMPTIONS & DECISIONS

## Architectural Decisions Made

- **Next.js App Router**: Chosen for co-located API routes and modern React features
- **Prisma ORM**: Selected for type safety and migration management
- **JWT Sessions**: Preferred over database sessions for scalability
- **Tailwind + Radix**: UI library choice for accessibility and customization

## Trade-offs Chosen

- **Monolithic Structure**: Easier development vs microservices complexity
- **Client-side Validation**: Better UX vs server security
- **PostgreSQL**: ACID compliance vs NoSQL flexibility
- **Custom Auth**: Full control vs third-party auth simplicity

## Constraints

- **Time**: Focused on MVP features, advanced features deferred
- **Budget**: Used free tiers (NeonDB, Vercel Hobby)
- **Scope**: Nigerian market focus limited internationalization
- **Team**: Solo development influenced code organization

# 11. HOW TO CONTINUE DEVELOPMENT

## Safe Areas to Extend

- Add new invoice fields or customer attributes
- Implement additional dashboard widgets
- Add more email templates and notifications
- Extend admin panel with new system settings
- Add new API endpoints following existing patterns

## Dangerous Areas to Avoid Breaking

- Authentication system (NextAuth configuration)
- Database schema changes (use migrations)
- Invoice numbering logic (test for collisions)
- Payment calculations (ensure data integrity)
- Admin permission checks

## Coding Conventions Used

- **TypeScript**: Strict mode, no any types
- **File Naming**: kebab-case for files, PascalCase for components
- **Imports**: Absolute imports with @ aliases
- **Error Handling**: Try-catch with structured responses
- **Validation**: Zod schemas for all inputs

## Patterns to Follow

- **API Routes**: GET/POST structure with session validation
- **Components**: Client components with "use client" directive
- **Database**: Prisma includes for related data
- **Forms**: React Hook Form with Zod and error display
- **State**: React Query for server state, Zustand for client state

This document provides complete context for continuing development of the Invoiss invoicing platform. The codebase has a solid foundation with room for the planned payment processing and advanced features.
