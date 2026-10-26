-- ========================================================================
-- KING'S STORE (كينجز ستور) - SUPABASE DATABASE SCHEMA
-- انسخ هذا الكود والصقه في محرّر SQL في لوحة تحكم Supabase واضغط Run
-- ========================================================================

-- 1. إنشاء جدول العملاء (customers)
create table if not exists public.customers (
    id uuid default gen_random_uuid() primary key,
    customer_code text unique,
    email text unique not null,
    name text not null,
    phone text,
    wallet_balance_egp numeric default 0,
    is_banned boolean default false,
    ban_reason text,
    can_purchase boolean default true,
    can_use_coupons boolean default true,
    can_access_portal boolean default true,
    total_spent_egp numeric default 0,
    orders_count integer default 0,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. تفعيل نظام الأمان على مستوى الصفوف (Row Level Security)
alter table public.customers enable row level security;

-- 3. سياسة القراءة: السماح للجميع بقراءة أو للمستخدم بقراءة ملفه
create policy "Allow public read access"
    on public.customers for select
    using (true);

-- 4. سياسة الإدخال والتحديث: السماح بتسجيل وتعديل الحسابات
create policy "Allow public insert and update"
    on public.customers for all
    using (true)
    with check (true);

-- 5. جدول اختياري لتسجيل حركات المحفظة (wallet_transactions)
create table if not exists public.wallet_transactions (
    id text primary key,
    customer_email text references public.customers(email) on delete cascade,
    type text not null,
    amount numeric not null,
    date text not null,
    reason text not null,
    admin_note text,
    previous_balance numeric not null,
    new_balance numeric not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.wallet_transactions enable row level security;

create policy "Allow wallet transactions access"
    on public.wallet_transactions for all
    using (true)
    with check (true);
