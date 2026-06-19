# Stash

Private knowledge-saving app for prompts, snippets, links, and notes.

## Stack

- React + TypeScript + Tailwind CSS
- Supabase Auth with email magic-link login
- Supabase Postgres table: `items`
- Vercel-ready Vite deployment

## Local Setup

1. Create a Supabase project.
2. In Supabase SQL Editor, run:

   `supabase/migrations/202606200001_create_items.sql`

3. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

4. Fill in `.env.local`:

   ```bash
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_ALLOWED_EMAIL=you@example.com
   ```

5. Start the app:

   ```bash
   npm install
   npm run dev
   ```

## Supabase Auth Redirects

In Supabase, go to Authentication > URL Configuration.

Set the local site URL while developing:

```text
http://localhost:5173
```

After deploying to Vercel, add your deployed URL to redirect URLs:

```text
https://your-app.vercel.app
```

## Vercel Deployment

In Vercel:

1. Import this project directory: `stash`
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables:

   ```text
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_ALLOWED_EMAIL
   ```

Then deploy. The included `vercel.json` rewrites all routes to `index.html` for the single-page app.

For a stricter single-user setup, create your user first in Supabase, then disable public signups in Supabase Auth settings. `VITE_ALLOWED_EMAIL` keeps the UI focused on one email, but client-side environment variables are public and should not be treated as the only security layer.
