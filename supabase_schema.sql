-- Merchants table
create table merchants (
  id uuid primary key default gen_random_uuid(),
  restaurant_name text not null,
  legal_entity text,
  contact_name text,
  phone text,
  email text,
  restaurant_type text,
  listing_type text,
  restaurant_id text,
  overall_status text default 'account',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  contract jsonb default '{"contract_id":null,"status":"not_raised","raised_at":null,"signed_at":null,"last_reminder_at":null,"reminder_count":0}'::jsonb,
  signature jsonb default '{"status":"not_sent","reminder_sent_at":null}'::jsonb,
  discount jsonb default '{"applicable":null,"prebook_applicable":null,"percentage":null,"duration_days":null,"start_date":null,"end_date":null,"notes":"","form_status":"not_set","prebook_form_status":"not_set"}'::jsonb
);

-- Tasks table
create table tasks (
  id text primary key,
  merchant_id uuid references merchants(id) on delete cascade,
  type text,
  name text,
  stage text,
  status text default 'not_started',
  required boolean default true,
  owner text,
  due_date text,
  completed_at timestamptz,
  external_url text,
  notes text default ''
);

-- Documents table
create table documents (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid references merchants(id) on delete cascade,
  type text,
  required text,
  status text default 'pending'
);

-- Notes table
create table notes (
  id text primary key,
  merchant_id uuid references merchants(id) on delete cascade,
  text text,
  author text,
  timestamp timestamptz default now()
);

-- Activity table
create table activity (
  id text primary key,
  merchant_id uuid references merchants(id) on delete cascade,
  action text,
  description text,
  "user" text,
  timestamp timestamptz default now()
);

-- Communications history table
create table comms_history (
  id text primary key,
  merchant_id uuid references merchants(id) on delete cascade,
  timestamp timestamptz default now(),
  channels text[],
  purpose text,
  reminder_number int,
  triggered_by text,
  status text default 'sent_demo'
);

-- Enable Row Level Security (open for now, lock down after adding auth)
alter table merchants enable row level security;
alter table tasks enable row level security;
alter table documents enable row level security;
alter table notes enable row level security;
alter table activity enable row level security;
alter table comms_history enable row level security;

-- Allow all operations for now (replace with auth policies later)
create policy "allow all" on merchants for all using (true) with check (true);
create policy "allow all" on tasks for all using (true) with check (true);
create policy "allow all" on documents for all using (true) with check (true);
create policy "allow all" on notes for all using (true) with check (true);
create policy "allow all" on activity for all using (true) with check (true);
create policy "allow all" on comms_history for all using (true) with check (true);
