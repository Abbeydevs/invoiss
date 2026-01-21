# ARCHITECTURAL DECISIONS

This document explains the reasoning behind key architectural decisions made during the development of Invoiss, including alternatives that were considered and rejected.

## 1. TECH STACK DECISIONS

### Next.js vs Other Frameworks

**Decision**: Next.js 16 with App Router
**Why Chosen**:
- Full-stack capabilities with API routes eliminate need for separate backend
- App Router provides better performance and developer experience than Pages Router
- Excellent TypeScript support and modern React features
- Built-in optimization for production deployments
- Vercel integration for seamless deployment

**Alternatives Considered**:
- **Remix**: Considered for better data loading patterns, but Next.js had better ecosystem maturity
- **SvelteKit**: Rejected due to smaller ecosystem and less enterprise adoption
- **Nuxt.js**: Considered for Vue ecosystem, but React had better Nigerian developer availability
- **Traditional MERN Stack**: Rejected due to complexity of maintaining separate frontend/backend

**Rejection Reasons**:
- Remix was too new and had smaller community
- SvelteKit lacked enterprise-grade libraries and tools
- Separate frontend/backend would increase complexity and deployment overhead

### React 19 vs Earlier Versions

**Decision**: React 19 (latest stable)
**Why Chosen**:
- Access to latest performance improvements and concurrent features
- Better developer experience with improved error boundaries
- Future-proofing for upcoming React features
- Compatibility with Next.js 16 requirements

**Alternatives Considered**:
- React 18: Stable but lacked some performance optimizations
- Preact: Smaller bundle size but ecosystem compatibility issues

**Rejection Reasons**:
- React 18 was already outdated at project start
- Preact would require significant ecosystem workarounds

### TypeScript vs JavaScript

**Decision**: TypeScript with strict mode
**Why Chosen**:
- Prevents runtime errors through compile-time type checking
- Better IDE support and developer productivity
- Self-documenting code through type definitions
- Essential for complex business logic in invoicing domain

**Alternatives Considered**:
- JavaScript with JSDoc: Insufficient type safety for complex operations
- Flow: Smaller ecosystem compared to TypeScript

**Rejection Reasons**:
- JSDoc provides no runtime safety
- Flow has been largely abandoned by Facebook

## 2. DATABASE & ORM DECISIONS

### PostgreSQL vs Other Databases

**Decision**: PostgreSQL with Prisma ORM
**Why Chosen**:
- ACID compliance critical for financial data (invoices, payments)
- Excellent JSON support for flexible invoice customization
- Strong TypeScript integration through Prisma
- Scalable for growing business needs
- Good performance for complex queries

**Alternatives Considered**:
- **MongoDB**: Considered for flexible schemas, rejected due to lack of ACID transactions
- **MySQL**: Considered for familiarity, rejected due to weaker JSON support
- **SQLite**: Rejected for production use (development only)
- **Supabase**: Considered for real-time features, but overkill for current needs

**Rejection Reasons**:
- MongoDB's eventual consistency unacceptable for financial transactions
- MySQL lacks sophisticated JSON operations needed for templates
- SQLite not suitable for multi-user production environment

### Prisma vs Other ORMs

**Decision**: Prisma 6 with client generation
**Why Chosen**:
- Type-safe database operations prevent SQL injection
- Auto-generated TypeScript types from schema
- Excellent migration system
- Built-in database introspection
- Active development and community support

**Alternatives Considered**:
- **TypeORM**: Considered for active record pattern, rejected due to less type safety
- **Drizzle ORM**: Newer but less mature ecosystem
- **Raw SQL with manual types**: Rejected due to maintenance burden
- **Mongoose**: MongoDB-specific, not suitable for PostgreSQL

**Rejection Reasons**:
- TypeORM requires more boilerplate and has weaker TypeScript integration
- Drizzle was too new with potential breaking changes
- Raw SQL would eliminate type safety benefits

## 3. AUTHENTICATION DECISIONS

### NextAuth.js vs Custom Auth

**Decision**: NextAuth.js with JWT strategy
**Why Chosen**:
- Battle-tested authentication library
- Handles complex OAuth flows and session management
- Built-in security best practices
- Excellent Next.js integration
- Supports custom credentials provider

**Alternatives Considered**:
- **Custom JWT implementation**: Considered for full control, rejected due to security risks
- **Auth0**: SaaS solution, rejected due to cost and vendor lock-in
- **Firebase Auth**: Considered for simplicity, rejected due to Google ecosystem coupling
- **Passport.js**: Node.js library, rejected due to Next.js complexity

**Rejection Reasons**:
- Custom JWT implementation prone to security vulnerabilities
- Auth0 adds monthly costs for small business target market
- Firebase would limit deployment flexibility
- Passport.js designed for traditional Express apps

### JWT vs Database Sessions

**Decision**: JWT tokens with database user lookup
**Why Chosen**:
- Stateless authentication scales better
- No server-side session storage needed
- Works well with serverless deployment (Vercel)
- Faster subsequent requests (no DB lookup for session data)

**Alternatives Considered**:
- Database sessions: Considered for security, but slower and less scalable
- Session cookies without JWT: Rejected due to complexity

**Rejection Reasons**:
- Database sessions create bottleneck for scaling
- Session cookies require server state management

## 4. STATE MANAGEMENT DECISIONS

### React Query + Zustand vs Redux

**Decision**: TanStack Query for server state, Zustand for client state
**Why Chosen**:
- React Query handles complex server state (caching, synchronization, error handling)
- Zustand provides simple client state management without boilerplate
- Better developer experience than Redux
- Automatic cache invalidation and background refetching

**Alternatives Considered**:
- **Redux Toolkit**: Considered for predictability, rejected due to excessive boilerplate
- **Recoil**: Facebook's state management, rejected due to smaller ecosystem
- **Context API only**: Rejected due to lack of caching and synchronization features
- **SWR**: Considered as alternative to React Query, but React Query has better features

**Rejection Reasons**:
- Redux creates too much ceremony for simple state needs
- Recoil has uncertain future maintenance
- Context API lacks advanced caching features needed for API data

## 5. UI FRAMEWORK DECISIONS

### Tailwind CSS + Radix UI vs Other UI Libraries

**Decision**: Tailwind CSS for styling, Radix UI for components
**Why Chosen**:
- Tailwind provides utility-first approach for rapid development
- Radix UI offers accessible, unstyled components
- Highly customizable without opinionated designs
- Excellent TypeScript support
- Small bundle size through tree-shaking

**Alternatives Considered**:
- **Material-UI (MUI)**: Considered for component completeness, rejected due to heavy bundle size
- **Chakra UI**: Considered for theming system, rejected due to less flexibility
- **Ant Design**: Enterprise-focused but too opinionated for custom branding
- **Bootstrap**: Considered for familiarity, rejected due to outdated design system
- **Styled Components + Custom Components**: Rejected due to maintenance overhead

**Rejection Reasons**:
- MUI components are heavy and hard to customize extensively
- Chakra UI has good defaults but less flexibility than Tailwind
- Bootstrap looks dated and requires significant overrides
- Styled components create CSS-in-JS complexity

### shadcn/ui Component System

**Decision**: shadcn/ui for component library
**Why Chosen**:
- Copy-paste components that become part of your codebase
- No external dependencies for core components
- Highly customizable with Tailwind
- Excellent accessibility and design
- Community-driven component ecosystem

**Alternatives Considered**:
- **Custom component library**: Rejected due to development time
- **Paid component libraries**: Rejected due to cost
- **Forked open-source libraries**: Rejected due to maintenance burden

**Rejection Reasons**:
- Building custom components from scratch would delay development
- Paid libraries add recurring costs
- Forked libraries create maintenance overhead

## 6. PROJECT STRUCTURE DECISIONS

### App Router Route Groups vs Traditional Structure

**Decision**: Next.js App Router with route groups for organization
**Why Chosen**:
- Route groups allow logical organization without affecting URLs
- Co-located API routes with pages
- Better performance than Pages Router
- Modern Next.js recommended approach
- Cleaner file structure for complex applications

**Alternatives Considered**:
- **Pages Router**: Considered for stability, but App Router is the future
- **Flat structure**: Rejected due to poor organization for growing app
- **Feature-based folders**: Considered but route groups provide better URL organization

**Rejection Reasons**:
- Pages Router is being phased out
- Flat structure becomes unmanageable at scale
- Feature folders would complicate routing

### Separation of Concerns: Components vs Pages

**Decision**: Clear separation between pages, components, and utilities
**Why Chosen**:
- Pages handle routing and data fetching
- Components focus purely on UI presentation
- Utilities contain business logic and helpers
- Easier testing and maintenance
- Follows React best practices

**Alternatives Considered**:
- **Container/Presentational pattern**: Similar but more complex
- **Mixed concerns in components**: Rejected due to poor maintainability
- **Page components handling everything**: Rejected due to bloated files

**Rejection Reasons**:
- Container pattern adds unnecessary abstraction
- Mixed concerns make components hard to test and reuse

## 7. DEPLOYMENT & INFRASTRUCTURE DECISIONS

### Vercel vs Other Platforms

**Decision**: Vercel as primary deployment platform
**Why Chosen**:
- Seamless Next.js integration
- Global CDN for performance
- Automatic HTTPS and scaling
- Excellent developer experience
- Free tier sufficient for MVP
- Built-in preview deployments

**Alternatives Considered**:
- **Netlify**: Considered for simplicity, rejected due to less Next.js optimization
- **AWS Amplify**: Considered for AWS ecosystem, rejected due to complexity
- **Railway**: Considered for full-stack, rejected due to cost
- **Self-hosted**: Rejected due to infrastructure management overhead

**Rejection Reasons**:
- Netlify has fewer Next.js-specific optimizations
- AWS Amplify requires AWS knowledge and has higher complexity
- Railway costs more than Vercel for similar features
- Self-hosting adds DevOps complexity for solo development

### NeonDB vs Other PostgreSQL Providers

**Decision**: NeonDB for database hosting
**Why Chosen**:
- Serverless PostgreSQL with automatic scaling
- Generous free tier for development
- Branching feature for safe schema changes
- Good performance and reliability
- PostgreSQL compatibility

**Alternatives Considered**:
- **Supabase**: Considered for real-time features, rejected due to overkill
- **PlanetScale**: MySQL-based, not suitable for PostgreSQL needs
- **AWS RDS**: Considered for enterprise features, rejected due to cost and complexity
- **Self-hosted PostgreSQL**: Rejected due to management overhead

**Rejection Reasons**:
- Supabase adds unnecessary real-time features
- PlanetScale doesn't support PostgreSQL
- AWS RDS requires infrastructure knowledge
- Self-hosting adds operational complexity

## 8. API DESIGN DECISIONS

### RESTful API Routes vs GraphQL

**Decision**: RESTful API routes with Next.js API routes
**Why Chosen**:
- Simple and familiar for CRUD operations
- No additional complexity or libraries needed
- Good performance for typical invoicing operations
- Easy to understand and maintain
- Sufficient for current feature set

**Alternatives Considered**:
- **GraphQL**: Considered for flexible queries, rejected due to complexity for simple CRUD
- **tRPC**: Considered for type safety, rejected due to additional tooling
- **REST with separate backend**: Rejected due to Next.js full-stack capabilities

**Rejection Reasons**:
- GraphQL adds complexity for operations that are mostly CRUD
- tRPC would require additional build tooling
- Separate backend increases deployment complexity

### Zod Validation vs Other Validation Libraries

**Decision**: Zod for runtime type validation
**Why Chosen**:
- TypeScript-first approach with excellent type inference
- Runtime validation prevents invalid data
- Integrates seamlessly with React Hook Form
- Self-documenting schemas
- Small bundle size

**Alternatives Considered**:
- **Joi**: Considered for popularity, rejected due to less TypeScript integration
- **Yup**: Similar to Zod but less type-safe
- **Manual validation**: Rejected due to maintenance burden
- **io-ts**: Functional programming approach, too complex for team

**Rejection Reasons**:
- Joi requires more boilerplate for TypeScript
- Yup has weaker type inference than Zod
- Manual validation is error-prone and hard to maintain

## 9. DATA MODELING DECISIONS

### Single Database vs Microservices

**Decision**: Monolithic database with multi-tenant architecture
**Why Chosen**:
- Simpler architecture for MVP development
- ACID transactions across related data (invoices, payments)
- Easier querying for dashboard analytics
- Lower operational complexity
- Sufficient for current scale

**Alternatives Considered**:
- **Microservices**: Considered for scalability, rejected due to complexity
- **Separate databases per tenant**: Rejected due to cost and complexity
- **Shared database with schema separation**: Considered but monolithic approach simpler

**Rejection Reasons**:
- Microservices add significant operational overhead for small team
- Multi-tenant databases are complex to manage at scale
- Schema separation would complicate queries

### Invoice Status Enum vs Status Table

**Decision**: Database enum for invoice status
**Why Chosen**:
- Simple and performant
- Type-safe with Prisma generation
- Easy to query and filter
- Clear state transitions
- No additional table maintenance

**Alternatives Considered**:
- **Status lookup table**: Considered for flexibility, rejected for simplicity
- **JSON status field**: Rejected due to lack of constraints
- **State machine pattern**: Overkill for current workflow

**Rejection Reasons**:
- Lookup table adds unnecessary joins for simple status
- JSON lacks data integrity constraints
- State machine too complex for linear invoice workflow

## 10. EMAIL & NOTIFICATION DECISIONS

### Resend vs Other Email Providers

**Decision**: Resend for transactional emails
**Why Chosen**:
- Excellent deliverability rates
- Developer-friendly API
- Good free tier for development
- React Email integration for templates
- Reliable infrastructure

**Alternatives Considered**:
- **SendGrid**: Considered for enterprise features, rejected due to cost
- **Mailgun**: Similar to SendGrid, higher cost
- **AWS SES**: Considered for AWS integration, rejected due to complexity
- **Nodemailer with SMTP**: Rejected due to deliverability issues

**Rejection Reasons**:
- SendGrid costs more for similar functionality
- AWS SES requires AWS setup and monitoring
- Custom SMTP has poor deliverability and spam filtering

### React Email vs Traditional Templates

**Decision**: React Email for HTML templates
**Why Chosen**:
- Component-based template development
- Type-safe with TypeScript
- Consistent with React codebase
- Easy to maintain and test
- Good Tailwind CSS integration

**Alternatives Considered**:
- **MJML**: Considered for email-specific syntax, rejected due to learning curve
- **Handlebars templates**: Rejected due to less maintainability
- **HTML strings**: Rejected due to poor developer experience

**Rejection Reasons**:
- MJML has additional syntax to learn
- Handlebars lacks component reusability
- Raw HTML is hard to maintain and debug

## 11. PAYMENT INTEGRATION DECISIONS

### Nomba vs Other Payment Gateways

**Decision**: Nomba for Nigerian payment processing
**Why Chosen**:
- Nigerian-focused payment gateway
- Supports multiple payment methods (cards, transfers, USSD)
- Good API documentation
- Local support and compliance
- Reasonable fees for Nigerian market

**Alternatives Considered**:
- **Paystack**: Considered for popularity, but Nomba has better enterprise features
- **Flutterwave**: Similar to Paystack, Nomba chosen for specific requirements
- **Stripe**: International gateway, rejected due to Nigerian focus and fees
- **PayPal**: Rejected due to high fees and limited Nigerian adoption

**Rejection Reasons**:
- Stripe charges higher fees for international transactions
- PayPal has limited acceptance in Nigeria
- Paystack/Flutterwave are good but Nomba better suits business model

### Webhook vs Polling for Payment Status

**Decision**: Webhook-based payment status updates
**Why Chosen**:
- Real-time payment notifications
- Lower server load than polling
- Immediate status updates for better UX
- Industry standard for payment processing
- Reliable delivery with retry mechanisms

**Alternatives Considered**:
- **Polling API**: Considered for simplicity, rejected due to inefficiency
- **Push notifications**: Rejected due to mobile app dependency

**Rejection Reasons**:
- Polling wastes API calls and server resources
- Push notifications require additional infrastructure

## 12. DEVELOPMENT WORKFLOW DECISIONS

### Solo Development vs Team Setup

**Decision**: Optimized for solo development with team scalability
**Why Chosen**:
- Faster decision-making and implementation
- Consistent code style and architecture
- Easier maintenance and debugging
- Prepared for future team expansion
- Documentation and conventions established

**Alternatives Considered**:
- **Full team from start**: Rejected due to budget constraints
- **Outsourced development**: Rejected due to control and quality concerns
- **No-code platforms**: Rejected due to customization limitations

**Rejection Reasons**:
- Team development would increase costs significantly
- Outsourcing reduces control over architecture decisions
- No-code platforms cannot handle complex invoicing logic

### MVP-First vs Full-Featured Launch

**Decision**: MVP approach with core features, advanced features planned
**Why Chosen**:
- Faster time to market
- Reduced development risk
- Ability to validate business model
- Incremental feature development based on user feedback
- Better resource allocation

**Alternatives Considered**:
- **Full-featured launch**: Rejected due to longer development time
- **Minimum viable product with all features**: Impossible with constraints

**Rejection Reasons**:
- Full-featured product would take too long to develop
- Higher risk of building unwanted features
- MVP allows for user validation and iteration

## 13. CONSTRAINT-DRIVEN DECISIONS

### Time Constraints Impact

**Decision**: Prioritize core invoicing workflow over advanced features
**Why Chosen**:
- Limited development timeline
- Focus on revenue-generating features first
- Essential functionality over nice-to-have features
- Ship working product over perfect architecture

**Resulting Trade-offs**:
- Payment processing implementation deferred
- Some technical debt accepted for speed
- Feature scope limited to MVP requirements

### Budget Constraints Impact

**Decision**: Use free/open-source tools and services
**Why Chosen**:
- Minimize operational costs
- Leverage generous free tiers
- Open-source ecosystem for cost-effective development
- Focus spending on business-critical areas

**Tools Selected for Cost**:
- Vercel free tier for hosting
- NeonDB free tier for database
- Open-source libraries and frameworks
- Free email service tiers

### Market Constraints Impact

**Decision**: Nigeria-focused with NGN currency and local payment methods
**Why Chosen**:
- Target market familiarity and needs
- Local payment gateway integration
- Currency and regulatory compliance
- Competitive advantage in local market

**Global Expansion Considerations**:
- Architecture designed for multi-currency support
- Modular payment gateway integration
- Database schema supports internationalization

## CONCLUSION

These architectural decisions were made with careful consideration of the project's constraints (time, budget, team size) while maintaining scalability and maintainability. The chosen technologies and patterns provide a solid foundation for the invoicing platform while allowing for future growth and feature expansion.

The MVP-first approach ensures a working product that can generate revenue and user feedback, which will inform future architectural decisions and feature prioritization.