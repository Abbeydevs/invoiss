# Invoiss Project Context

## Last updated

June 1, 2026

## Product summary

Invoiss is a full-stack invoicing and billing web application for Nigerian small businesses, freelancers, accountants, and administrators. It combines a public marketing site with a protected dashboard that manages invoices, customers, subscriptions, wallets, and admin system settings.

## Problem statement

Small businesses and service providers need a modern, centralized billing platform that replaces spreadsheets and manual invoice workflows with a reliable system for creating professional invoices, tracking payments, and managing customer relationships.

## Target users

- Freelancers and individual entrepreneurs
- Small business owners and operators
- Accountants and bookkeepers
- Platform administrators

## Value proposition

- Create, send, and manage professional invoices quickly
- Track invoice status, payments, and milestones
- Manage customers and bank accounts in one place
- Support subscription billing and Pro plan workflows
- Offer admin controls for system broadcasts and maintenance

## What the app is today

- A Next.js 16 monolithic web application using App Router
- TypeScript-based UI and server logic
- PostgreSQL data storage via Prisma
- NextAuth authentication with JWT sessions
- Cloudinary image upload support
- Resend email notifications and HTML email templates
- Partial Nomba payment gateway support
- Admin console for system/settings control

## Current feature coverage

### Implemented

- Signup, login, password reset, session management
- Role-based access for `USER` and `ADMIN`
- Customer CRUD and contact metadata
- Invoice creation, editing, listing, previewing, and sending
- Invoice line items, tax, discounts, totals, and payment status
- Milestone payment scheduling and partial payments
- Bank account management and Nomba bank list lookup
- Subscription and billing plan data model
- Wallet balance and transaction tracking
- Dashboard analytics and overview charts
- Admin broadcasts, settings, and user management
- File upload flow for logos and assets
- Protected dashboard route grouping

### Partial / future

- Nomba payment gateway integration is present but not fully finished; webhook and complete payment capture flows remain work in progress
- Multi-currency support is effectively NGN only
- Advanced reporting and BI is not complete beyond the current analytics dashboards
- Bulk invoice operations, automated reminders, and third-party APIs are not shipped yet
- Wallet deposit/withdraw UI is not fully exposed
- Mobile app companion does not exist yet

## Architecture overview

### Platform

- Next.js 16 application with App Router
- React 19 and TypeScript 5
- Tailwind CSS with shadcn/ui and Radix UI components
- React Query for server state and caching
- Zustand for client-side UI state
- React Hook Form + Zod for form validation

### Backend

- PostgreSQL database and Prisma ORM
- NextAuth credentials provider with JWT session strategy
- Prisma client instance in `src/lib/prisma.ts`
- Email service integration via `src/lib/mail.ts`
- Nomba integration via `src/lib/nomba.ts`

### Repository organization

- `src/app/`: pages and API routes
- `src/components/`: reusable UI components
- `src/lib/`: utilities and integrations
- `src/stores/`: global state
- `prisma/`: schema, migrations, seed scripts
- `public/`: static assets

## Route structure

- `(auth)`: login, register, forgot password, reset password
- `(dashboard)`: protected business workflow pages
- `(marketing)`: public landing pages (features, pricing, contact)
- `admin/`: admin dashboard pages
- `api/`: server-side endpoints for auth, invoices, customers, billing, templates, upload, wallet, analytics, cron

## Data model highlights

### Key Prisma models

- `User` / `Profile`
- `Customer`
- `Invoice`, `InvoiceItem`, `InvoicePayment`, `PaymentMilestone`
- `Template`
- `Subscription`, `Payment`
- `Wallet`, `WalletTransaction`
- `TeamMember`
- `Activity`, `SystemBroadcast`, `SystemSettings`
- `BankAccount`, `NombaAccount`

### Important domain rules

- Users own their data through `userId` relationships
- Invoice numbers are unique per user
- Email is unique across users
- Related records cascade-delete where appropriate
- Admins can bypass maintenance lock and manage system state

## Deployment and environment

### Build commands

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:studio`

### Required environment variables

- `DATABASE_URL`, `DIRECT_URL`
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_UPLOAD_PRESET`
- `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_NAME`

### Deployment target

- Vercel is the primary deployment platform
- `vercel.json` is present for deployment configuration

## Alignment with documentation

### Confirmed engineering reality

- The project is a full-stack invoicing product, not just a landing page
- The core business flows are invoices, customers, subscriptions, and billing
- Nomba is included but remains partially implemented, consistent with architecture notes
- The app is built as a monolithic Next.js codebase with public and protected sections

### Developer guidance

Begin investigation in `src/app/` for routes, then follow `src/lib/` for backend utilities and `prisma/schema.prisma` for domain models. The most important business paths are invoice and customer management, authentication, billing/subscription flows, and admin system settings.
