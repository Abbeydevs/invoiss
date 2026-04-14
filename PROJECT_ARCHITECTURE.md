# PROJECT ARCHITECTURE

## 1. Architecture System Overview

Invoiss is a modern full-stack web application built with the following architecture:

- **Frontend framework:** Next.js 16 with App Router
- **UI library:** React 19 with TypeScript
- **Styling:** Tailwind CSS, Radix UI, shadcn/ui components
- **State management:**
  - @tanstack/react-query for server state
  - Zustand for client state
  - React Hook Form for form state
- **Authentication:** NextAuth.js with JWT sessions and Credentials provider
- **Database:** PostgreSQL with Prisma ORM
- **Email service:** Resend
- **Payment gateway:** Nomba (partially implemented)
- **File storage:** Cloudinary
- **Deployment:** Vercel-ready configuration

## 2. Full Project Folder Structure

```
.
├── .DS_Store
├── .env
├── .github
│   └── appmod
│       └── appcat
├── .gitignore
├── .hintrc
├── .vscode
│   └── settings.json
├── ARCHITECT_DECISIONS.md
├── Check
├── PROJECT_ARCHITECTURE.md
├── README.md
├── VERSION_TWO.md
├── components.json
├── env.example
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma
│   ├── migrations
│   │   ├── 20251028063714_table
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── schema.prisma
│   └── seed.ts
├── project-context.md
├── public
│   ├── .DS_Store
│   └── images
│       ├── .DS_Store
│       ├── dashboard.png
│       ├── invoice-dashboard.png
│       ├── invoice-editor.png
│       ├── invoiss-logo.svg
│       └── payment-schedule.png
├── src
│   ├── app
│   │   ├── (auth)
│   │   │   ├── forgot-password
│   │   │   │   └── page.tsx
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   ├── register
│   │   │   │   └── page.tsx
│   │   │   └── reset-password
│   │   │       └── page.tsx
│   │   ├── (dashboard)
│   │   │   └── dashboard
│   │   │       ├── analytics
│   │   │       │   └── page.tsx
│   │   │       ├── bank-accounts
│   │   │       │   └── page.tsx
│   │   │       ├── billing
│   │   │       │   ├── failed
│   │   │       │   │   └── page.tsx
│   │   │       │   ├── success
│   │   │       │   │   └── page.tsx
│   │   │       │   └── page.tsx
│   │   │       ├── customers
│   │   │       │   └── page.tsx
│   │   │       ├── help
│   │   │       │   └── page.tsx
│   │   │       ├── invoices
│   │   │       │   ├── [id]
│   │   │       │   │   ├── layout.tsx
│   │   │       │   │   └── page.tsx
│   │   │       │   ├── create
│   │   │       │   │   └── page.tsx
│   │   │       │   ├── new
│   │   │       │   │   └── page.tsx
│   │   │       │   └── page.tsx
│   │   │       ├── page.tsx
│   │   │       ├── settings
│   │   │       │   └── page.tsx
│   │   │       └── wallet
│   │   │           └── page.tsx
│   │   ├── (marketing)
│   │   │   ├── privacy
│   │   │   │   └── page.tsx
│   │   │   └── terms
│   │   │       └── page.tsx
│   │   ├── admin
│   │   │   ├── broadcasts
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── settings
│   │   │   │   └── page.tsx
│   │   │   ├── subscriptions
│   │   │   │   └── page.tsx
│   │   │   └── users
│   │   │       ├── [id]
│   │   │       │   └── page.tsx
│   │   │       └── page.tsx
│   │   ├── api
│   │   │   ├── analytics
│   │   │   │   └── route.ts
│   │   │   ├── auth
│   │   │   │   ├── [...nextauth]
│   │   │   │   │   └── route.ts
│   │   │   │   └── register
│   │   │   │       └── route.ts
│   │   │   ├── bank-accounts
│   │   │   │   ├── [id]
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── banks
│   │   │   │   ├── route.ts
│   │   │   │   └── verify
│   │   │   │       └── route.ts
│   │   │   ├── billing
│   │   │   │   ├── callback
│   │   │   │   │   └── route.ts
│   │   │   │   └── subscribe
│   │   │   │       └── route.ts
│   │   │   ├── cron
│   │   │   │   └── check-subscriptions
│   │   │   │       └── route.ts
│   │   │   ├── customers
│   │   │   │   ├── [id]
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── invoices
│   │   │   │   ├── [id]
│   │   │   │   │   ├── payments
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── send
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── status
│   │   │   │   │       └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── profile
│   │   │   │   └── route.ts
│   │   │   ├── settings
│   │   │   │   ├── currency
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── templates
│   │   │   │   └── route.ts
│   │   │   ├── upload
│   │   │   │   └── route.ts
│   │   │   └── wallet
│   │   │       └── route.ts
│   │   ├── contact
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── features
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── pricing
│   │       └── page.tsx
│   ├── components
│   │   ├── admin
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── BroadcastManager.tsx
│   │   │   ├── SystemSettingsForm.tsx
│   │   │   └── UserManagementPanel.tsx
│   │   ├── auth
│   │   │   ├── AnimatedLoginText.tsx
│   │   │   ├── AnimatedText.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ResetPasswordForm.tsx
│   │   ├── bank-accounts
│   │   │   ├── AddBankAccount.tsx
│   │   │   ├── BankAccountForm.tsx
│   │   │   └── BankAccountList.tsx
│   │   ├── billing
│   │   │   ├── BillingModal.tsx
│   │   │   └── UpgradeModal.tsx
│   │   ├── common
│   │   │   ├── CurrencyFloatingButton.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ImageUpload.tsx
│   │   │   ├── MobileRestriction.tsx
│   │   │   └── SkeletonLoader.tsx
│   │   ├── customers
│   │   │   ├── AddCustomer.tsx
│   │   │   ├── CustomerDataTable.tsx
│   │   │   ├── CustomerForm.tsx
│   │   │   ├── CustomerTableColumns.tsx
│   │   │   └── EditCustomerDialog.tsx
│   │   ├── dashboard
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── GlobalAlert.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SidebarContext.tsx
│   │   │   └── StatCard.tsx
│   │   ├── email
│   │   │   ├── InvoiceEmailTemplate.tsx
│   │   │   ├── ResetPasswordTemplate.tsx
│   │   │   └── SubscriptionEmails.tsx
│   │   ├── invoice
│   │   │   ├── InvoiceActions.tsx
│   │   │   ├── InvoiceDataTable.tsx
│   │   │   ├── InvoiceEditorForm.tsx
│   │   │   ├── InvoiceForm.tsx
│   │   │   ├── InvoicePreview.tsx
│   │   │   ├── InvoiceStatusBadge.tsx
│   │   │   ├── InvoiceTableColumns.tsx
│   │   │   ├── InvoiceTableRowActions.tsx
│   │   │   ├── MilestoneManager.tsx
│   │   │   ├── RecordPaymentModal.tsx
│   │   │   ├── TemplateCard.tsx
│   │   │   ├── TemplatePreviewModal.tsx
│   │   │   └── previews
│   │   │       ├── BlankPreview.tsx
│   │   │       ├── ClassicPreview.tsx
│   │   │       ├── ElegantPreview.tsx
│   │   │       ├── ExecutivePreview.tsx
│   │   │       ├── ModernPreview.tsx
│   │   │       ├── PrestigePreview.tsx
│   │   │       └── SummitPreview.tsx
│   │   ├── landing
│   │   │   ├── Features.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── features
│   │   │   │   ├── FeatureHero.tsx
│   │   │   │   ├── LiveEditorFeature.tsx
│   │   │   │   └── PaymentTrackingFeature.tsx
│   │   │   └── pricing
│   │   │       ├── PricingFAQ.tsx
│   │   │       └── PricingHero.tsx
│   │   ├── layout
│   │   ├── providers
│   │   │   ├── PublicLayoutWrapper.tsx
│   │   │   ├── QueryProvider.tsx
│   │   │   └── SessionProvider.tsx
│   │   ├── settings
│   │   │   ├── AddBankAccountDialog.tsx
│   │   │   └── CurrencyForm.tsx
│   │   └── ui
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       ├── command.tsx
│   │       ├── currency-input.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── popover.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── skeleton.tsx
│   │       ├── sonner.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       └── textarea.tsx
│   ├── lib
│   │   ├── api
│   │   │   ├── action.ts
│   │   │   ├── admin-actions.ts
│   │   │   ├── admin.ts
│   │   │   ├── broadcast-actions.ts
│   │   │   ├── password-actions.tsx
│   │   │   └── settings-actions.ts
│   │   ├── auth.ts
│   │   ├── mail.ts
│   │   ├── nomba.ts
│   │   ├── prisma.ts
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── validators
│   │       ├── bank-account.schema.ts
│   │       ├── customer.schema.ts
│   │       └── invoice.schema.ts
│   ├── stores
│   │   └── userStore.ts
│   └── types
│       ├── index.ts
│       └── next-auth.d.ts
├── tsconfig.json
└── vercel.json
```

## 3. Notes on the Project Structure

- `src/app` contains the Next.js App Router pages, API routes, layouts, and route groups.
- `src/components` contains reusable UI components grouped by domain.
- `src/lib` contains utilities, API actions, authentication, mail, payment integration, Prisma client, and validators.
- `prisma` contains the database schema, migrations, and seed script.
- `public` contains static assets.
