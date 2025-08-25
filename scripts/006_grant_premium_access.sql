-- Grant premium plus access to test user
-- This script gives premium plus access to the test user for development/testing purposes

-- First, get the user ID from the auth.users table based on email
DO $$
DECLARE
    test_user_id uuid;
BEGIN
    -- Get the user ID for the test email
    -- Updated email from ziga.zoric@gmail.com to kamakozi123@gmail.com
    SELECT id INTO test_user_id 
    FROM auth.users 
    WHERE email = 'kamakozi123@gmail.com';
    
    -- Check if user exists
    IF test_user_id IS NOT NULL THEN
        -- Delete any existing subscription for this user
        DELETE FROM user_subscriptions WHERE user_id = test_user_id;
        
        -- Insert premium plus subscription
        INSERT INTO user_subscriptions (
            id,
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
            gen_random_uuid(),
            test_user_id,
            'premium_plus',
            'active',
            NOW(),
            NOW() + INTERVAL '1 year', -- Give 1 year of premium access
            NOW(),
            NOW() + INTERVAL '30 days', -- 30 day trial period
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Premium Plus access granted to user: %', test_user_id;
    ELSE
        -- Updated error message to reflect new email
        RAISE NOTICE 'User with email kamakozi123@gmail.com not found';
    END IF;
END $$;
