-- Add subscription and plan management tables
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'premium', 'premium_plus')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  trial_start_date TIMESTAMPTZ,
  trial_end_date TIMESTAMPTZ,
  subscription_start_date TIMESTAMPTZ DEFAULT NOW(),
  subscription_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add user profile table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  profile_picture_url TEXT,
  notification_preferences JSONB DEFAULT '{"special_offers": true, "login_alerts": true, "security_alerts": true}'::jsonb,
  security_settings JSONB DEFAULT '{"two_factor_enabled": false, "login_notifications": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add activity log for better tracking
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  action_description TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own subscription" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own subscription" ON user_subscriptions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own activity" ON user_activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert activity" ON user_activity_log FOR INSERT WITH CHECK (true);

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, first_name, last_name)
  VALUES (NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  
  -- Give new users 14-day premium trial
  INSERT INTO user_subscriptions (user_id, plan_type, status, trial_start_date, trial_end_date)
  VALUES (NEW.id, 'premium', 'trial', NOW(), NOW() + INTERVAL '14 days');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Function to check if user has premium access
CREATE OR REPLACE FUNCTION has_premium_access(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  subscription_record user_subscriptions%ROWTYPE;
BEGIN
  SELECT * INTO subscription_record 
  FROM user_subscriptions 
  WHERE user_id = user_uuid 
  ORDER BY created_at DESC 
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check if trial is still active
  IF subscription_record.status = 'trial' AND subscription_record.trial_end_date > NOW() THEN
    RETURN TRUE;
  END IF;
  
  -- Check if paid subscription is active
  IF subscription_record.status = 'active' AND subscription_record.plan_type IN ('premium', 'premium_plus') THEN
    IF subscription_record.subscription_end_date IS NULL OR subscription_record.subscription_end_date > NOW() THEN
      RETURN TRUE;
    END IF;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
