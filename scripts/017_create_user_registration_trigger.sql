-- Create function to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Create profile record
  insert into public.profiles (id, first_name, last_name, business_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    coalesce(new.raw_user_meta_data ->> 'business_name', '')
  )
  on conflict (id) do nothing;

  -- Create user profile record
  insert into public.user_profiles (user_id, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  )
  on conflict (user_id) do nothing;

  -- Create subscription record with 14-day trial
  insert into public.user_subscriptions (
    user_id, 
    plan_type, 
    status, 
    trial_start_date, 
    trial_end_date,
    subscription_start_date
  )
  values (
    new.id,
    'premium',
    'trialing',
    now(),
    now() + interval '14 days',
    now()
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Ensure RLS policies exist for profiles table
alter table public.profiles enable row level security;

-- Drop existing policies if they exist
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_delete_own" on public.profiles;

-- Create RLS policies for profiles
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- Ensure RLS policies exist for user_profiles table
alter table public.user_profiles enable row level security;

-- Drop existing policies if they exist
drop policy if exists "user_profiles_select_own" on public.user_profiles;
drop policy if exists "user_profiles_insert_own" on public.user_profiles;
drop policy if exists "user_profiles_update_own" on public.user_profiles;
drop policy if exists "user_profiles_delete_own" on public.user_profiles;

-- Create RLS policies for user_profiles
create policy "user_profiles_select_own"
  on public.user_profiles for select
  using (auth.uid() = user_id);

create policy "user_profiles_insert_own"
  on public.user_profiles for insert
  with check (auth.uid() = user_id);

create policy "user_profiles_update_own"
  on public.user_profiles for update
  using (auth.uid() = user_id);

create policy "user_profiles_delete_own"
  on public.user_profiles for delete
  using (auth.uid() = user_id);

-- Ensure RLS policies exist for user_subscriptions table
alter table public.user_subscriptions enable row level security;

-- Drop existing policies if they exist
drop policy if exists "user_subscriptions_select_own" on public.user_subscriptions;
drop policy if exists "user_subscriptions_insert_own" on public.user_subscriptions;
drop policy if exists "user_subscriptions_update_own" on public.user_subscriptions;
drop policy if exists "user_subscriptions_delete_own" on public.user_subscriptions;

-- Create RLS policies for user_subscriptions
create policy "user_subscriptions_select_own"
  on public.user_subscriptions for select
  using (auth.uid() = user_id);

create policy "user_subscriptions_insert_own"
  on public.user_subscriptions for insert
  with check (auth.uid() = user_id);

create policy "user_subscriptions_update_own"
  on public.user_subscriptions for update
  using (auth.uid() = user_id);

create policy "user_subscriptions_delete_own"
  on public.user_subscriptions for delete
  using (auth.uid() = user_id);
