# 🏥 Lief Shift Tracker

> A modern, location-aware shift management system for healthcare workers and managers. Built with cutting-edge web technologies for seamless clock-in/out operations and comprehensive workforce analytics.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.16.1-2d3748?style=flat-square&logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://postgresql.org)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Setup Instructions](#-setup-instructions)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [Database Management](#-database-management)
- [API Endpoints](#-api-endpoints)
- [Architecture & Design](#-architecture--design)
- [Security Features](#-security-features)
- [Development Workflow](#-development-workflow)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Overview

Lief Shift Tracker is a comprehensive workforce management solution designed specifically for healthcare organizations. It enables seamless shift tracking with location-based validation, providing both care workers and managers with intuitive interfaces to manage their daily operations efficiently.

**Use Cases:**

- Healthcare facilities (hospitals, clinics, medical centers)
- Staff scheduling and attendance tracking
- Location-based work verification
- Real-time workforce analytics and reporting
- Shift history and compliance documentation

---

## ✨ Key Features

### 🔐 For Care Workers

- **One-Click Clock In/Out**: Intuitive interface with geolocation validation
- **Location-Based Validation**: Automatic verification that workers are within the facility
- **Shift Notes**: Add context and notes to shifts for better record-keeping
- **Shift History**: Complete view of past shifts with timestamps and duration
- **Real-Time Feedback**: Immediate perimeter validation alerts
- **Mobile-First Design**: Fully responsive experience optimized for mobile devices
- **Offline Support**: Works seamlessly across desktop and mobile platforms

### 📊 For Managers

- **Active Staff Dashboard**: Real-time view of currently clocked-in staff members
- **Advanced Analytics**:
  - Daily average hours per staff member
  - Daily clock-in statistics
  - Weekly hours summary per employee
  - Visual charts and graphs using Recharts
- **Shift History Management**: Complete audit trail with timestamps and GPS coordinates
- **Geofence Configuration**: Set custom location perimeters for facility locations
- **Staff Management**: View and manage user roles and permissions
- **Data Export Ready**: Foundation for generating reports and compliance documentation

### 🔐 Security & Authentication

- **Auth0 Integration**: Enterprise-grade authentication
- **Multiple Login Options**: Google, Email, and standard credentials
- **Session Management**: Secure and automatic session handling
- **Role-Based Access Control**: Manager vs. Care Worker distinct permissions
- **GPS Tracking**: Location verification for all clock-in/out operations
- **Data Encryption**: All sensitive data encrypted in transit and at rest

---

## 🛠 Technology Stack

### Frontend

- **Framework**: [Next.js 15.5.2](https://nextjs.org) with Turbopack bundler
- **Language**: [TypeScript 5.9.2](https://www.typescriptlang.org) for type safety
- **UI Library**: [Grommet 2.48.0](https://v2.grommet.io) for accessible components
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) + Styled Components
- **Charts**: [Recharts 3.2.1](https://recharts.org) for data visualization
- **Icons**: [Lucide React](https://lucide.dev) + Grommet Icons
- **Utilities**: clsx, tailwind-merge, zod for schema validation

### Backend & Database

- **API Layer**: Next.js API Routes with TypeScript
- **Database**: [PostgreSQL](https://postgresql.org) via [Supabase](https://supabase.com)
- **ORM**: [Prisma 6.16.1](https://prisma.io) for type-safe database access
- **Authentication**: [Auth0](https://auth0.com) with `@auth0/nextjs-auth0` SDK

### Development Tools

- **Linting**: ESLint 9 with Next.js config
- **Task Runner**: npm scripts with tsx for seed execution
- **Package Manager**: npm (Node.js compatible)
- **Bundler**: Turbopack (Next.js integrated)

---

## 📁 Project Structure

```
lief-shift-tracker/
├── 📄 package.json              # Project dependencies and scripts
├── 📄 tsconfig.json             # TypeScript configuration
├── 📄 next.config.ts            # Next.js configuration
├── 📄 prisma/
│   ├── schema.prisma            # Database schema with detailed comments
│   ├── seed.ts                  # Demo data seeding script
│   └── migrations/              # Database migrations
├── 📄 app/
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── middleware.ts            # Next.js middleware
│   ├── actions/
│   │   └── shift-actions.ts     # Server actions for shift operations
│   ├── api/
│   │   ├── auth/[...auth0]/     # Auth0 dynamic route handlers
│   │   └── check-user-role/     # User role checking endpoint
│   ├── components/              # Shared components (auth, providers, UI)
│   ├── manager/                 # Manager dashboard
│   ├── worker/                  # Worker interface
│   ├── test/                    # Testing pages
│   └── lib/                     # Utility functions
├── 📄 components/
│   └── ui/                      # Reusable UI components
├── 📄 hooks/
│   └── use-geolocation.ts       # Custom geolocation hook
├── 📄 lib/
│   ├── auth0.ts                 # Auth0 configuration
│   ├── prisma.ts                # Prisma client singleton
│   ├── supabase.ts              # Supabase initialization
│   └── utils.ts                 # Utility functions
├── 📄 public/                   # Static assets
└── 📄 types/
    └── auth0.d.ts               # TypeScript type definitions
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.17.0 or higher ([Download](https://nodejs.org))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: For version control ([Download](https://git-scm.com))
- **PostgreSQL**: v14+ or Supabase account for database

### Required Accounts

- **Auth0**: Free account for authentication ([Sign up](https://auth0.com/signup))
- **Supabase**: Free tier includes PostgreSQL database ([Sign up](https://supabase.com))

---

## 🚀 Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/rizwandev99/lief-shift-tracker.git
cd lief-shift-tracker
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages from `package.json` including Next.js, Prisma, Auth0 SDK, and UI libraries.

### Step 3: Environment Configuration

Create a `.env.local` file in the project root with the following variables (see [Environment Configuration](#-environment-configuration) section):

```bash
cp .env.example .env.local
```

Then fill in the values for your Auth0 and Supabase accounts.

### Step 4: Setup Database

```bash
# Apply migrations to your database
npx prisma migrate deploy

# Optional: Seed demo data
npm run db:seed
```

### Step 5: Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

---

## 🔧 Environment Configuration

Create a `.env.local` file in the project root with the following environment variables:

```env
# Database Configuration (Supabase/PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/dbname"

# Auth0 Configuration
AUTH0_SECRET="your-generated-secret-key"
AUTH0_DOMAIN="your-tenant.auth0.com"
AUTH0_CLIENT_ID="your-client-id"
AUTH0_CLIENT_SECRET="your-client-secret"
APP_BASE_URL="http://localhost:3000"

# Optional: Auth0 Advanced Configuration
AUTH0_AUDIENCE="https://your-api-identifier"
AUTH0_SCOPE="openid profile email"
```

### Generating AUTH0_SECRET

```bash
openssl rand -hex 32
```

### Getting Auth0 Credentials

1. Visit [Auth0 Dashboard](https://manage.auth0.com)
2. Create a new Regular Web Application
3. Go to Settings tab
4. Copy: Domain, Client ID, and Client Secret
5. Add `http://localhost:3000/auth/callback` to Allowed Callback URLs
6. Add `http://localhost:3000` to Allowed Logout URLs

### Getting Supabase Database URL

1. Create a project on [Supabase](https://supabase.com)
2. Go to Project Settings → Database
3. Find "Connection string" with Prisma format
4. Copy and set as `DATABASE_URL`

---

## 🏃 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

Starts the development server with Turbopack for faster compilation. Access at http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

Creates an optimized production build and starts the server.

### Linting

```bash
npm run lint
```

Runs ESLint to check code quality and style compliance.

### Database Seeding

```bash
npm run db:seed
```

Populates the database with demo/test data from `prisma/seed.ts`

---

## 🗄 Database Management

### Prisma Commands

```bash
# View database schema in UI
npx prisma studio

# Create a new migration from schema changes
npx prisma migrate dev --name add_new_field

# Apply pending migrations
npx prisma migrate deploy

# Reset database (⚠️ warning: deletes all data)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

### Database Schema Overview

The application uses three main models:

**users**

- Store healthcare worker and manager information
- Email-based identification with Auth0 integration
- Role-based access control (worker, manager, admin)

**shifts**

- Complete shift records with timestamps
- GPS coordinates for clock-in and clock-out
- Optional notes and calculated duration
- Indexed for fast queries on user and time

**organizations**

- Facility location information
- Geofence configuration (latitude, longitude, radius)
- Location validation reference for clock-in restrictions

---

## 🔌 API Endpoints

### Authentication Routes (Auth0 Managed)

- `GET /auth/login` - Initiate login flow
- `GET /auth/logout` - Logout current user
- `GET /auth/callback` - OAuth callback handler
- `GET /auth/profile` - Get authenticated user profile
- `GET /auth/access-token` - Retrieve access token

### Custom API Routes

- `GET/POST /api/check-user-role` - Verify user role for access control

### Server Actions

- Clock in/out operations defined in `app/actions/shift-actions.ts`
- Server-side validation for location and shift management

---

## 🏗 Architecture & Design

### Frontend Architecture

- **Server Components**: Used for data fetching and authentication checks
- **Client Components**: Used for interactive UI and real-time features
- **API Routes**: Thin layer for Auth0 integration and role checking
- **Server Actions**: Direct database mutations with server-side validation

### Key Design Patterns

- **Single Responsibility**: Each component has one clear purpose
- **Type Safety**: Full TypeScript coverage for runtime safety
- **Progressive Enhancement**: Works with and without JavaScript
- **Mobile-First**: Responsive design prioritizing mobile devices
- **Geolocation Integration**: Browser API with fallback handling

### State Management

- React Context API for global auth state
- Component-level state for UI interactions
- Server-side state for database persistence
- No external state management library (Redux not needed)

### Authentication Flow

```
User → Login Button → Auth0 → Callback → Session Created → Dashboard
```

---

## 🔒 Security Features

✅ **Authentication & Authorization**

- Auth0 OAuth 2.0 integration
- Secure session management with automatic refresh
- Role-based access control (RBAC)

✅ **Data Protection**

- PostgreSQL encryption at rest
- HTTPS for data in transit
- SQL injection prevention via Prisma ORM
- XSS protection through React/Next.js defaults

✅ **Location Security**

- GPS-based geofencing for clock-in validation
- Perimeter violation detection and logging
- Coordinates stored for audit trails

✅ **API Security**

- Middleware-based route protection
- Auth0 access token validation
- CORS configuration for cross-origin requests

✅ **Database Security**

- Supabase provides secure PostgreSQL hosting
- Row-level security policies (can be configured)
- Connection pooling for secure database access

---

## 💻 Development Workflow

### Code Quality

```bash
# Check for linting issues
npm run lint

# Format code (configure in ESLint config)
npm run lint -- --fix
```

### Making Database Changes

1. **Update Schema**

   ```bash
   # Edit prisma/schema.prisma
   ```

2. **Create Migration**

   ```bash
   npx prisma migrate dev --name descriptive_name
   ```

3. **Test Changes**
   ```bash
   npm run dev
   # Test in browser at http://localhost:3000
   ```

### Adding New Features

1. Create/update components in `app/components/`
2. Add server actions in `app/actions/` if needed
3. Update database schema if new data models required
4. Run migrations and test thoroughly
5. Check type safety with TypeScript

---

## 🚀 Deployment

### Deployment Platforms

**Recommended: Vercel** (seamless Next.js deployment)

```bash
npm install -g vercel
vercel
```

**Alternative: Docker + Any Cloud Provider**

```bash
docker build -t lief-shift-tracker .
docker run -p 3000:3000 lief-shift-tracker
```

### Pre-Deployment Checklist

- [ ] All environment variables configured in deployment platform
- [ ] Database migrations applied in production
- [ ] Auth0 production credentials configured
- [ ] Allowed URLs updated in Auth0 settings
- [ ] HTTPS enforced in Next.js config
- [ ] Logging configured for monitoring
- [ ] Database backups enabled

### Environment Variables for Production

Ensure these are set in your deployment platform's environment configuration:

- `DATABASE_URL` (production database)
- `AUTH0_SECRET` (different from development)
- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `APP_BASE_URL` (your production domain)

---

## 🤝 Contributing

This is a submission project. For contributions or improvements:

1. Create a feature branch
2. Make your changes with clear commit messages
3. Ensure all tests pass and linting is clean
4. Submit a pull request with detailed description

---

## 📝 License

This project is private and submitted for evaluation purposes.

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://prisma.io/docs)
- [Auth0 Documentation](https://auth0.com/docs)
- [Grommet UI Library](https://v2.grommet.io)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 🎓 Learning Resources Included

The database schema includes detailed comments explaining:

- Model relationships and constraints
- Field purposes and data types
- Indexing strategy for performance
- Best practices for 2025 development

Check `prisma/schema.prisma` for comprehensive inline documentation.

---

**Built with ❤️ for healthcare workforce management**

_Last Updated: November 2025_
