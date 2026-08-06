# Awan Leading Company — Equipment Rental Platform

Next.js (App Router) + TypeScript + Tailwind CSS, backed by Supabase (Postgres, Auth, RLS).

## Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, lucide-react, recharts
- **Backend/DB:** Supabase (Postgres + Row Level Security)
- **Auth:** Supabase Auth (email/password), roles: `customer` / `admin`
- **Deployment:** Vercel

## Local setup

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in your Supabase project's values (Project Settings → API in the Supabase dashboard):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxxxxxx
```

Run the SQL migrations in the Supabase **SQL Editor** (in order — this creates every table, RLS policy, and the security fix below):

1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_fix_role_escalation.sql`

Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Creating your first admin account

All signups default to the `customer` role — there is no self-service way to become an admin (see security note below). To make your own account an admin:

1. Sign up normally through the site (Login → Sign Up).
2. In the Supabase dashboard, go to **SQL Editor** and run:
   ```sql
   update public.profiles set role = 'admin' where id =
     (select id from auth.users where email = 'you@example.com');
   ```
3. Log out and back in on the site — you'll land on `/` and the header will route you to the Admin Dashboard.

## Database schema

See `supabase/migrations/0001_init.sql` for the full schema:

- `profiles` — one row per auth user, `role` is `customer` or `admin`
- `vehicles` — the equipment fleet (seeded with the real Awan Leading catalog)
- `bookings` — customer rental requests; `booking_number` is the public tracking key
- `testimonials`, `faqs`, `contact_messages`

All tables have RLS enabled. Notable policies:

- Anyone (including guests) can **insert** a booking.
- A customer can only **select** their own bookings (`customer_id = auth.uid()`); admins can see and update all.
- The public "Track Booking" page never queries the `bookings` table directly — it calls the `get_booking_status(p_booking_number)` Postgres function, which returns only status/equipment/date, never customer PII (name, phone, email, address).
- A trigger (`0002_fix_role_escalation.sql`) prevents any authenticated user from changing their own `role` via the API — only a direct database action (SQL editor, service_role) can promote someone to admin.

## What's real vs. illustrative

Wired to live Supabase data: authentication, the booking form, the customer dashboard's booking list, the admin dashboard's bookings table (with status updates), and the public tracking page.

Still illustrative/mock (no backing table was requested for these): the admin "Revenue Overview" and "Service Distribution" charts, the Drivers tab, and the Customers tab's spend figures. The Invoices and Support tabs are UI-only placeholders. Extending any of these to real data is a matter of adding the corresponding table + RLS policy and swapping the mock array for a Supabase query, following the same pattern used for `bookings`.

## Known limitation

Several "pages" (Booking, Track, Admin, Customer Dashboard, Login) are implemented as components defined inside the single root `AwanTransport` component in `src/app/page.tsx`, rather than as separate Next.js routes. A future improvement would be to split these into real routes under `src/app/(routes)/...` — this would also fix the residual issue where toggling dark mode or language while mid-form (rare, but possible) resets that form's local state, since the whole tree remounts on root-level state changes. The scroll-position bug that caused this same class of issue was fixed by moving scroll tracking local to the `Header` component.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the environment variables from `.env.example` in the Vercel project's **Settings → Environment Variables** (at minimum `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Deploy. Vercel auto-detects Next.js — no build config needed.
5. In Supabase, go to **Authentication → URL Configuration** and add your Vercel deployment URL to the redirect allow-list so auth flows work in production.

## Production checklist

- [ ] Both SQL migrations run on the production Supabase project
- [ ] Env vars set in Vercel (not just locally)
- [ ] At least one admin account created (see above)
- [ ] Supabase Auth email templates reviewed (Authentication → Email Templates) — defaults are fine to start
- [ ] Decide on email confirmation requirement (Authentication → Providers → Email → "Confirm email") — currently whatever your Supabase project's default is
- [ ] Real company logo asset added (currently a generated icon + wordmark, not the actual PDF logo artwork)
- [ ] Resend/Google Maps integration, if you want booking confirmation emails or a live map on Contact — not yet wired (see `.env.example`)
