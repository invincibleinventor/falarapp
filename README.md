# Falar

A social media platform with posts, stories, messaging, and content discovery.

## What it does

Falar is a full-featured social network where users can:
- Create and share posts with media
- Follow other users and build a feed
- Send direct messages
- Browse and discover content through explore
- Create quickies (short-form content)
- Save bookmarks
- Block/report users

## Tech Stack

- Next.js with React 18
- Supabase for auth, database, and storage
- Ably for real-time messaging
- Framer Motion and GSAP for animations
- MDX Editor for rich text
- TailwindCSS
- Capacitor for mobile builds

## Setup

1. Clone the repo
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in:
   - Supabase URL and anon key
   - Ably API key (for real-time features)
4. Run the development server:
   ```
   npm run dev
   ```

## Project Structure

```
falarapp/
  app/
    (home)/         - Main feed
    auth/           - Login/signup
    bookmarks/      - Saved posts
    create/         - New post
    explore/        - Content discovery
    messages/       - Direct messages
    notifications/  - Activity feed
    post/           - Post detail
    profile/        - User profiles
    quickies/       - Short content
    search/         - User search
  components/       - Shared UI components
  lib/              - Supabase client
  utils/            - Helper functions
```

---

Short description for GitHub:

A social media platform with posts, stories, real-time messaging, and content discovery. Built with Next.js and Supabase.
