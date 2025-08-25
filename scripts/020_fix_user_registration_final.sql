-- Drop existing problematic triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_profiles ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_user_signup();

-- Create the proper user profile creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles table (main profile)
  INSERT INTO public.profiles (id, first_name, last_name, business_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'business_name', '')
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert into user_profiles table (extended profile)
  INSERT INTO public.user_profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', '')
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Create default subscription with 14-day trial
  INSERT INTO public.user_subscriptions (
    user_id,
    plan_type,
    status,
    trial_start_date,
    trial_end_date,
    subscription_start_date
  )
  VALUES (
    NEW.id,
    'premium',
    'trialing',
    NOW(),
    NOW() + INTERVAL '14 days',
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS is enabled and policies exist for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;

-- Create RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles 
  FOR DELETE USING (auth.uid() = id);

-- Ensure RLS is enabled and policies exist for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_delete_own" ON public.user_profiles;

-- Create RLS policies for user_profiles
CREATE POLICY "user_profiles_select_own" ON public.user_profiles 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_profiles_insert_own" ON public.user_profiles 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_profiles_update_own" ON public.user_profiles 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_profiles_delete_own" ON public.user_profiles 
  FOR DELETE USING (auth.uid() = user_id);

-- Ensure RLS is enabled and policies exist for user_subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "user_subscriptions_select_own" ON public.user_subscriptions;
DROP POLICY IF EXISTS "user_subscriptions_insert_own" ON public.user_subscriptions;
DROP POLICY IF EXISTS "user_subscriptions_update_own" ON public.user_subscriptions;
DROP POLICY IF EXISTS "user_subscriptions_delete_own" ON public.user_subscriptions;

-- Create RLS policies for user_subscriptions
CREATE POLICY "user_subscriptions_select_own" ON public.user_subscriptions 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_subscriptions_insert_own" ON public.user_subscriptions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_subscriptions_update_own" ON public.user_subscriptions 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_subscriptions_delete_own" ON public.user_subscriptions 
  FOR DELETE USING (auth.uid() = user_id);
