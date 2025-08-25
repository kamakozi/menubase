-- Script to give yourself premium access for testing
-- Replace 'your-email@example.com' with your actual test account email

-- First, let's find your user ID (replace with your actual email)
-- You can run this query first to get your user_id:
-- SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Option 1: Set Premium subscription (replace the user_id with your actual user_id)
INSERT INTO user_subscriptions (
  user_id,
  plan_type,
  status,
  subscription_start_date,
  subscription_end_date,
  trial_start_date,
  trial_end_date,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'kamakozi123@gmail.com'), -- Replace with your email
  'premium',
  'active',
  NOW(),
  NOW() + INTERVAL '1 year',
  NOW(),
  NOW() + INTERVAL '14 days',
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  plan_type = 'premium',
  status = 'active',
  subscription_start_date = NOW(),
  subscription_end_date = NOW() + INTERVAL '1 year',
  trial_start_date = NOW(),
  trial_end_date = NOW() + INTERVAL '14 days',
  updated_at = NOW();

-- Option 2: If you want Premium Plus instead, uncomment this and comment out the above:
/*
INSERT INTO user_subscriptions (
  user_id,
  plan_type,
  status,
  subscription_start_date,
  subscription_end_date,
  trial_start_date,
  trial_end_date,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'your-email@example.com'), -- Replace with your email
  'premium_plus',
  'active',
  NOW(),
  NOW() + INTERVAL '1 year',
  NOW(),
  NOW() + INTERVAL '14 days',
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  plan_type = 'premium_plus',
  status = 'active',
  subscription_start_date = NOW(),
  subscription_end_date = NOW() + INTERVAL '1 year',
  trial_start_date = NOW(),
  trial_end_date = NOW() + INTERVAL '14 days',
  updated_at = NOW();
*/
