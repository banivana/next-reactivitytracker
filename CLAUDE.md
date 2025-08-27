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

### Database Schema

Database schema used in supabase:

```sql
CREATE TABLE public.events (
  user_id uuid,
  date character varying,
  trigger_type character varying,
  level_of_reaction character varying,
  description text,
  created_at date NOT NULL DEFAULT now(),
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  location uuid, -- Now references locations.id instead of being a text field
  time_of_day text,
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT events_location_fkey FOREIGN KEY (location) REFERENCES public.locations(id)
);
CREATE TABLE public.locations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  label text NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  active boolean NOT NULL DEFAULT true,
  CONSTRAINT locations_pkey PRIMARY KEY (id),
  CONSTRAINT locations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.health (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  date character varying,
  description text,
  user_id uuid,
  time_of_day text,
  CONSTRAINT health_pkey PRIMARY KEY (id)
);
CREATE TABLE public.notes (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  date character varying,
  note_content text,
  user_id uuid DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  time_of_day text,
  CONSTRAINT notes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  user_id uuid NOT NULL DEFAULT auth.uid(),
  triggers json,
  is_trainer boolean DEFAULT false,
  is_admin boolean NOT NULL DEFAULT false,
  name text,
  CONSTRAINT profiles_pkey PRIMARY KEY (user_id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.trainer_client (
  trainer uuid DEFAULT auth.uid(),
  client uuid DEFAULT auth.uid(),
  first_name text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  last_name text,
  CONSTRAINT trainer_client_pkey PRIMARY KEY (id),
  CONSTRAINT trainer_client_trainer_fkey FOREIGN KEY (trainer) REFERENCES auth.users(id),
  CONSTRAINT trainer_client_client_fkey FOREIGN KEY (client) REFERENCES auth.users(id)
);
```
