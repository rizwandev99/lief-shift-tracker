# Project Context

## Project Overview

lief-shift-tracker is a web application (usable on mobile and web) for healthcare workers to clock in and clock out of their shifts at City General Hospital. It enables healthcare workers to easily record and track shift start/end times with location-based validation.

**Core Features:**

**Manager Dashboard:**

- Set location perimeter (e.g., within 2km of hospital) for clock-in validation
- View table of all currently clocked-in staff
- Access detailed clock-in/out history with timestamps and locations for each staff member
- Analytics dashboard showing:
  - Average hours people spend clocked in each day
  - Number of people clocking in each day
  - Total hours clocked in per staff over the last week

**Care Worker Interface:**

- Clock in/out functionality with optional notes
- Location-based clock-in restriction (must be within perimeter)
- Real-time perimeter validation with user feedback
- Shift history view

**Authentication:**

- User registration with username/password
- Auth0 integration with Google and email login options
- Secure login/logout with session management
- User-specific task/shift history

**UI/UX Requirements:**

- Clean, user-friendly interface using Grommet design library
- Fully responsive design for desktop and mobile
- MVP approach for features with focus on usability

## Current Status

Project is in development phase with core authentication and database infrastructure implemented. Auth0 integration is fully configured with proper error handling. Manager dashboard is fully implemented with analytics, active staff monitoring, and shift history. Care worker interface includes clock-in/out functionality with location validation. Database schema is complete with seeded demo data. Ready for production deployment pending database connection verification.

## Key Decisions Made

- **Frontend:** Next.js with TypeScript for robust React framework
- **UI Library:** Grommet for consistent, accessible component design
- **Authentication:** Auth0 for secure user management with multiple login options
- **Database:** Supabase for backend database and real-time features
- **ORM:** Prisma for type-safe database interactions
- **State Management:** React Context (no Redux)
- **Geolocation:** Browser geolocation API with perimeter validation
- **Analytics:** Chart.js for data visualization in manager dashboard

## Active Issues & Solutions

**RESOLVED - Auth0 404 Error (November 11, 2025):**

- Issue: Login redirected to `/auth/login` which returned 404
- Root Cause: Incorrect Auth0 SDK implementation
- Solution Applied:
  - Updated `app/api/auth/[...auth0]/route.ts` to use `handleAuth()` from Auth0 SDK
  - Updated `lib/auth0.ts` to use `initAuth0()` for proper SDK initialization
  - Updated `middleware.ts` to use `withMiddlewareAuthRequired()` from Auth0
  - Fixed login button to use correct route: `/api/auth/login`
- Status: ✅ Fixed and verified
- Verification:
  - ✅ Route handler: Correctly exports `handleAuth()`
  - ✅ Auth0 library: Correctly initializes with `initAuth0()`
  - ✅ Middleware: Correctly uses `withMiddlewareAuthRequired()`
  - ✅ Login button: Points to `/api/auth/login`
  - ✅ Package.json: Has `@auth0/nextjs-auth0@^4.12.0` installed

**Next Steps for Vercel Deployment:**

- Add Auth0 environment variables to Vercel project settings
- Update Auth0 application callback URLs to match Vercel deployment URL
- Redeploy on Vercel

## Dependencies & Integrations

- **Auth0:** User authentication with Google/email login options
  - SDK: @auth0/nextjs-auth0
  - Configuration: Domain, Client ID, Client Secret, Secret
  - Routes: /auth/login, /auth/logout, /auth/callback, /auth/profile
  - Environment variables: AUTH0_SECRET, APP_BASE_URL, AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET
- **Supabase:** Primary database for shifts and users
- **Prisma:** Database ORM for type-safe queries
- **Next.js:** React framework with server/client components
- **Grommet:** UI component library for responsive design
- **Chart.js:** Analytics visualization in manager dashboard
- **Geolocation API:** Browser-based location tracking

## Development Notes

- Location perimeter validation requires GPS coordinates and radius settings
- Clock-in/out operations include optional notes and location data
- Manager settings include location perimeter configuration for City General Hospital (GPS coordinates, perimeter radius)
- Progressive Web App (PWA) features planned for bonus implementation
- Automatic location detection notifications for bonus features
- Mobile-first responsive design required
- Authentication guards needed for role-based access (manager vs care worker)

## Auth0 Integration Reference

**SDK Setup:**

- Install: `npm install @auth0/nextjs-auth0`
- Client initialization in `lib/auth0.js` with authorization parameters
- Middleware configuration for route protection

**Environment Variables:**

- AUTH0_SECRET: Generated using `openssl rand -hex 32`
- APP_BASE_URL: Application base URL (e.g., http://localhost:3000)
- AUTH0_DOMAIN: Auth0 tenant domain
- AUTH0_CLIENT_ID: Application client ID
- AUTH0_CLIENT_SECRET: Application client secret
- AUTH0_AUDIENCE: API identifier (optional)
- AUTH0_SCOPE: Permission scopes (optional)

**Auto-configured Routes (via Dynamic Route Handler `[...auth0]`):**

- /api/auth/login: Login endpoint (redirects to Auth0)
- /api/auth/logout: Logout endpoint
- /api/auth/callback: Authentication callback (OAuth redirect)
- /api/auth/profile: User profile endpoint (returns user data)
- /api/auth/access-token: Access token endpoint

**Usage Patterns:**

- Server components: Use `auth0.getSession()` for user data
- Client components: Use `useUser()` hook from @auth0/nextjs-auth0
- Login: Link to `/api/auth/login` (SDK automatically redirects to Auth0)
- Logout: Link to `/api/auth/logout` (SDK automatically handles logout)
- Protected routes: Use `withMiddlewareAuthRequired()` in middleware.ts

## Next Steps

**Required Features Implementation:**

- Implement care worker clock-in/out interface with location validation
- Add location perimeter settings in manager dashboard
- Complete clock-in/out history with location data display
- Build analytics dashboard with Chart.js visualizations
- Add user role management (manager vs care worker)
- Implement optional notes for clock-in/out actions
- Add perimeter violation warnings for care workers
- Create user registration flow with Auth0
- Ensure full mobile responsiveness

**Bonus Features (Optional):**

- Convert to Progressive Web App (PWA) with offline capabilities
- Implement automatic location detection notifications
- Add service workers for app-like experience

**Technical Tasks:**

- Set up GraphQL API (if needed beyond current setup)
- Database schema optimized for single organization with location data and notes
- Add comprehensive error handling for geolocation failures
- Implement real-time updates for active staff
- Add data export functionality for reports
