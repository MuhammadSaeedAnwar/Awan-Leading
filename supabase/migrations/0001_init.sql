-- ═══════════════════════════════════════════════════════════════════
-- Awan Leading Company — initial schema
-- Run this once in the Supabase SQL editor (or via `supabase db push`).
-- ═══════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ─── PROFILES ─────────────────────────────────────────────────────
-- One row per authenticated user. Created automatically on signup by the
-- trigger below — never insert into this table directly from the client.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Helper used by policies below to check the caller's role without
-- recursive RLS lookups.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── VEHICLES (equipment fleet) ────────────────────────────────────
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text,
  image text,
  capacity text,
  category text,
  description text,
  description_ar text,
  price_note text,
  status text not null default 'available' check (status in ('available', 'booked', 'maintenance')),
  created_at timestamptz not null default now()
);

alter table public.vehicles enable row level security;

create policy "vehicles_public_read"
  on public.vehicles for select
  using (true);

create policy "vehicles_admin_write"
  on public.vehicles for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─── BOOKINGS ───────────────────────────────────────────────────────
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_number text not null unique,
  customer_id uuid references public.profiles (id) on delete set null,
  vehicle_id uuid references public.vehicles (id) on delete set null,
  full_name text not null,
  company_name text,
  phone text not null,
  whatsapp text,
  email text not null,
  project_site_address text,
  delivery_address text,
  start_date date not null,
  start_time time,
  equipment_type text,
  project_type text,
  required_capacity text,
  required_dimensions text,
  rental_duration text check (rental_duration in ('daily', 'weekly', 'monthly')),
  notes text,
  status text not null default 'pending' check (
    status in ('pending', 'confirmed', 'assigned', 'dispatched', 'transit', 'delivered', 'completed', 'cancelled')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

create index if not exists bookings_booking_number_idx on public.bookings (booking_number);
create index if not exists bookings_customer_id_idx on public.bookings (customer_id);

-- Anyone can submit a booking (guest checkout is allowed).
create policy "bookings_public_insert"
  on public.bookings for insert
  with check (true);

-- Signed-in customers see only their own bookings; admins see everything.
create policy "bookings_select_own_or_admin"
  on public.bookings for select
  using (auth.uid() = customer_id or public.is_admin());

create policy "bookings_admin_update"
  on public.bookings for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "bookings_admin_delete"
  on public.bookings for delete
  using (public.is_admin());

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- Public booking tracker: returns only non-sensitive status fields for a
-- given booking number, so the "Track Booking" page never has to expose
-- full customer PII (name/phone/email/address) via a broad SELECT policy.
create or replace function public.get_booking_status(p_booking_number text)
returns table (
  booking_number text,
  status text,
  equipment_type text,
  start_date date,
  created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select booking_number, status, equipment_type, start_date, created_at
  from public.bookings
  where booking_number = p_booking_number;
$$;

grant execute on function public.get_booking_status(text) to anon, authenticated;

-- ─── TESTIMONIALS ───────────────────────────────────────────────────
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  rating int not null check (rating between 1 and 5),
  content text not null,
  content_ar text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

create policy "testimonials_public_read_published"
  on public.testimonials for select
  using (is_published or public.is_admin());

create policy "testimonials_admin_write"
  on public.testimonials for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─── FAQS ───────────────────────────────────────────────────────────
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  question_ar text,
  answer text not null,
  answer_ar text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.faqs enable row level security;

create policy "faqs_public_read"
  on public.faqs for select
  using (true);

create policy "faqs_admin_write"
  on public.faqs for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─── CONTACT MESSAGES ───────────────────────────────────────────────
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "contact_messages_public_insert"
  on public.contact_messages for insert
  with check (true);

create policy "contact_messages_admin_read"
  on public.contact_messages for select
  using (public.is_admin());

create policy "contact_messages_admin_write"
  on public.contact_messages for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "contact_messages_admin_delete"
  on public.contact_messages for delete
  using (public.is_admin());

-- ─── SEED DATA (equipment fleet) ────────────────────────────────────
insert into public.vehicles (name, name_ar, capacity, category, description, description_ar, status)
values
  ('Mobile Crane', 'رافعة متحركة', '20 - 500 Tons', 'Crane', 'Precise crane operations for heavy lifting on construction and industrial projects.', 'عمليات رفع دقيقة للرفع الثقيل في مشاريع البناء والصناعة.', 'available'),
  ('Forklift', 'رافعة شوكية', '2 - 25 Tons', 'Forklift', 'Efficient material handling solutions for seamless logistics within your workspace.', 'حلول مناولة فعالة للمواد لخدمات لوجستية سلسة في مكان العمل.', 'available'),
  ('Diesel Generator', 'مولد ديزل', '50 - 1000 kVA', 'Generator', 'Reliable power backup for construction sites, facilities, and events.', 'طاقة احتياطية موثوقة لمواقع البناء والمرافق والفعاليات.', 'available'),
  ('Boom Truck', 'شاحنة رافعة', '3 - 15 Tons', 'Boom Truck', 'Versatile lifting and loading equipment for tight and busy sites.', 'معدات رفع وتحميل متعددة الاستخدامات للمواقع الضيقة والمزدحمة.', 'available'),
  ('Lowbed Trailer', 'مقطورة منخفضة', 'Normal & Hydraulic', 'Trailer', 'Specialized transport for oversized and extra-heavy machinery.', 'نقل متخصص للآلات الكبيرة والثقيلة جداً.', 'booked'),
  ('Flatbed Trailer', 'مقطورة مسطحة', '12 - 24 Meters', 'Trailer', 'For long cargo, pipes, and structural steel across the Kingdom.', 'للبضائع الطويلة والأنابيب والحديد الإنشائي في جميع أنحاء المملكة.', 'available'),
  ('Scissor Lift', 'رافعة مقصية', '8 - 18 Meters', 'Lift', 'Safe elevated access for maintenance and installation work.', 'وصول آمن للأماكن المرتفعة لأعمال الصيانة والتركيب.', 'available'),
  ('Man Lift / Boom Lift', 'رافعة بشرية', '12 - 47 Meters', 'Lift', 'Extended reach for high-access construction and inspection work.', 'مدى وصول ممتد لأعمال البناء والفحص في المرتفعات.', 'available'),
  ('Excavator', 'حفارة', 'Multiple Sizes', 'Excavator', 'Earthmoving and excavation equipment for any project scale.', 'معدات حفر ونقل تراب لمشاريع بجميع الأحجام.', 'available'),
  ('Telehandler Boom', 'رافعة شوكية طويلة', 'Multiple Capacities', 'Telehandler', 'Flexible lifting and placement on rough and uneven terrain.', 'رفع ووضع مرن على التضاريس الوعرة وغير المستوية.', 'available')
on conflict do nothing;

insert into public.faqs (question, question_ar, answer, answer_ar, sort_order)
values
  ('How do I rent equipment?', 'كيف أستأجر المعدات؟', 'You can book through our website by clicking ''Book Now'', calling our office, or sending a WhatsApp message. Our team will confirm your booking within 30 minutes.', 'يمكنك الحجز عبر موقعنا بالنقر على ''احجز الآن''، أو الاتصال بمكتبنا، أو إرسال رسالة واتساب. سيؤكد فريقنا حجزك خلال 30 دقيقة.', 1),
  ('What rental durations do you offer?', 'ما مدد التأجير المتوفرة؟', 'We offer daily, weekly, and monthly rental plans.', 'نقدم خطط تأجير يومية وأسبوعية وشهرية.', 2),
  ('Do you provide maintenance for rented equipment?', 'هل توفرون صيانة للمعدات المؤجرة؟', 'Yes, all our equipment is maintained to the highest standards.', 'نعم، جميع معداتنا تخضع للصيانة بأعلى المعايير.', 3),
  ('What payment methods do you accept?', 'ما طرق الدفع المقبولة؟', 'We accept cash, bank transfer, Mada, Visa, and Mastercard.', 'نقبل النقد والتحويل البنكي ومدى وفيزا وماستركارد.', 4)
on conflict do nothing;
