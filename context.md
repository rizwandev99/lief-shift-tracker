# Project Context

## Project Overview

lief-shift-tracker is a web application (usable on mobile and web) for healthcare workers to clock in and clock out of their shifts. It enables organizations (such as hospitals) to have care workers easily record and track shift start/end times with location-based validation.

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

Project is in initial development phase. Basic Next.js setup with Auth0 integration, Prisma database schema, and Grommet UI components established. Manager dashboard partially implemented with data fetching. Care worker clock-in interface needs location perimeter validation and full implementation.

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

No active issues identified at this stage.

## Dependencies & Integrations

- **Auth0:** User authentication with Google/email login options
- **Supabase:** Primary database for shifts, users, and organizations
- **Prisma:** Database ORM for type-safe queries
- **Next.js:** React framework with server/client components
- **Grommet:** UI component library for responsive design
- **Chart.js:** Analytics visualization in manager dashboard
- **Geolocation API:** Browser-based location tracking

## Development Notes

- Location perimeter validation requires GPS coordinates and radius settings
- Clock-in/out operations include optional notes and location data
- Manager settings need organization configuration (GPS coordinates, perimeter radius)
- Progressive Web App (PWA) features planned for bonus implementation
- Automatic location detection notifications for bonus features
- Mobile-first responsive design required
- Authentication guards needed for role-based access (manager vs care worker)

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
- Enhance database schema for location data and notes
- Add comprehensive error handling for geolocation failures
- Implement real-time updates for active staff
- Add data export functionality for reports