# Project Context

## Project Overview

lief-shift-tracker is a Next.js-based web application for tracking employee shifts, featuring clock-in/out functionality, geolocation tracking, and manager oversight. It integrates with Auth0 for authentication and Supabase for data storage.

## Current Status

Project is in initial development phase with basic components and database schema set up.

## Key Decisions Made

- Chosen Next.js with TypeScript for the frontend framework
- Auth0 for user authentication and authorization
- Supabase as the backend database service
- Prisma ORM for database interactions
- Grommet UI library for components

## Active Issues & Solutions

No active issues identified at this stage.

## Dependencies & Integrations

- Auth0: User authentication
- Supabase: Database and real-time features
- Prisma: Database ORM
- Next.js: React framework
- Grommet: UI component library

## Development Notes

- Uses geolocation hooks for location-based features
- Clock interface component handles shift timing
- Manager page for oversight functionality
- Test pages for various features (auth, db, location)

## Next Steps

- Implement core shift tracking logic
- Add user role management
- Enhance UI/UX for mobile devices
- Add reporting and analytics features