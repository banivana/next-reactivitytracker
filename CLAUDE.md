# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build production version
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Project Architecture

This is a **ReactivityTracker** application - a Next.js app for dog trainers to track and manage client reactivity data.

### Tech Stack
- **Next.js 15.1.7** with App Router and React 19
- **TypeScript** with path aliases (`@/*` maps to root)
- **Supabase** for authentication and database
- **Tailwind CSS** + **NextUI** for styling
- **Recharts** for data visualization

### Key Directories
- `app/` - Next.js App Router structure with components, dashboard, auth routes
- `app/dashboard/` - Protected routes for trainers (clients management, home)
- `components/ui/` - shadcn/ui components
- `lib/` - Utility libraries and configurations
- `utils/` - Server-side utilities and helpers
- `scripts/` - Database management scripts

### Authentication Flow
- **Supabase Auth** with email/password
- **Middleware** (`middleware.ts`) protects `/dashboard` routes
- **Role-based access**: trainers vs clients
- **SSR support** via `@supabase/ssr`

### Database Operations
- Use custom scripts in `/scripts/` for admin tasks like `addClientsToTrainer.js`
- Server actions for form handling and mutations
- Type-safe database operations through Supabase client

### UI Patterns
- **Server Components** for data fetching
- **Client Components** for interactivity
- **Loading states** with NProgress
- **Responsive design** with mobile-first approach
- **Consistent theming** via Tailwind config with custom colors and fonts

### Development Notes
- Environment variables required for Supabase configuration
- No testing framework currently configured
- ESLint for code quality, TypeScript for type safety
- Hot reloading enabled in development mode