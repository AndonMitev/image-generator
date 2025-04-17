# ImageGen - AI Image Generator

## Features

- Authentication with Supabase (Magic Link)
- Protected routes
- Authentication dialog integrated into sidebar
- Centralized auth management via AuthProvider
- Future support for Google and Twitter authentication

## Setup

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env.local` file in the root of the project with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase:

   - Create a new project in Supabase
   - Enable Email Auth in Authentication → Providers → Email
   - Enable "Email OTP" for Magic Link authentication
   - Set your site URL in Authentication → URL Configuration

5. Run the development server:

```bash
pnpm dev
```

## Authentication Flow

1. User clicks "Sign In" in the sidebar
2. Authentication dialog appears with options:
   - Magic Link (Active)
   - Google (Coming soon)
   - Twitter (Coming soon)
3. User selects Magic Link and enters their email
4. A magic link is sent to their email
5. User clicks the link and is redirected back to the site
6. The callback route (`/auth/callback`) exchanges the code for a session
7. User is authenticated and UI updates accordingly

## Project Structure

- `app/` - Next.js app router pages
- `components/` - React components
  - `auth/` - Authentication-related components
  - `providers/` - Context providers
    - `AuthProvider.tsx` - Central auth state and methods
  - `ui/` - UI components
- `lib/` - Utility functions and clients
  - `clients/` - API clients (Supabase)

## Protected Routes

The following routes are protected and require authentication:

- `/account`
- `/generate`

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
