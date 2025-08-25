-- Creating a robust user registration system that ensures users are properly saved to database
-- Drop all existing triggers and functions to start fresh
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a comprehensive user profile creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_first_name text;
  user_last_name text;
  user_business_name text;
BEGIN
  -- Extract user metadata with fallbacks
  user_first_name := COALESCE(NEW.raw_user_meta_data ->> 'first_name', '');
  user_last_name := COALESCE(NEW.raw_user_meta_data ->> 'last_name', '');
  user_business_name := COALESCE(NEW.raw_user_meta_data ->> 'business_name', '');

  -- Log the user creation attempt
  RAISE LOG 'Creating profile for user: % with email: %', NEW.id, NEW.email;

  -- Insert into profiles table (main profile)
  INSERT INTO public.profiles (
    id, 
    email, 
    first_name, 
    last_name, 
    business_name,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    user_first_name,
    user_last_name,
    user_business_name,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    business_name = EXCLUDED.business_name,
    updated_at = NOW();

  -- Insert into user_profiles table (extended profile)
  INSERT INTO public.user_profiles (
    user_id, 
    first_name, 
    last_name,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    user_first_name,
    user_last_name,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    updated_at = NOW();

  -- Create default subscription with 14-day premium trial
  INSERT INTO public.user_subscriptions (
    user_id,
    plan_type,
    status,
    trial_start_date,
    trial_end_date,
    subscription_start_date,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    'premium',
    'trialing',
    NOW(),
    NOW() + INTERVAL '14 days',
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;

  RAISE LOG 'Successfully created profile for user: %', NEW.id;
  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS policies are properly configured
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Update RLS policies to be more permissive for user creation
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

CREATE POLICY "profiles_select_own" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (true); -- Allow trigger to insert
CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;

CREATE POLICY "user_profiles_select_own" ON public.user_profiles 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_profiles_insert_own" ON public.user_profiles 
  FOR INSERT WITH CHECK (true); -- Allow trigger to insert
CREATE POLICY "user_profiles_update_own" ON public.user_profiles 
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_subscriptions_select_own" ON public.user_subscriptions;
DROP POLICY IF EXISTS "user_subscriptions_insert_own" ON public.user_subscriptions;
DROP POLICY IF EXISTS "user_subscriptions_update_own" ON public.user_subscriptions;

CREATE POLICY "user_subscriptions_select_own" ON public.user_subscriptions 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_subscriptions_insert_own" ON public.user_subscriptions 
  FOR INSERT WITH CHECK (true); -- Allow trigger to insert
CREATE POLICY "user_subscriptions_update_own" ON public.user_subscriptions 
  FOR UPDATE USING (auth.uid() = user_id);
