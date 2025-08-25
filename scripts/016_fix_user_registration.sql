-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles table (legacy table)
  INSERT INTO public.profiles (id, first_name, last_name, business_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'business_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert into user_profiles table (new table)
  INSERT INTO public.user_profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', NULL)
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Create default subscription (free plan with 14-day premium trial for first-time users)
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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add RLS policies for profiles table if they don't exist
DO $$
BEGIN
  -- Check if RLS is enabled on profiles table
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create RLS policies for profiles table
CREATE POLICY IF NOT EXISTS "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Add RLS policies for user_profiles table if they don't exist
DO $$
BEGIN
  -- Check if RLS is enabled on user_profiles table
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'user_profiles' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create RLS policies for user_profiles table
CREATE POLICY IF NOT EXISTS "user_profiles_select_own"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "user_profiles_insert_own"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "user_profiles_update_own"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);
