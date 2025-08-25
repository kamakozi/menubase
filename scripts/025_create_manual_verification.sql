-- Create a temporary solution for testing without email confirmation
-- This allows manual user verification for development/testing

-- Function to manually verify a user (for testing purposes)
CREATE OR REPLACE FUNCTION manually_verify_user(user_email TEXT)
RETURNS VOID AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Find the user by email
    SELECT id INTO user_id 
    FROM auth.users 
    WHERE email = user_email 
    AND email_confirmed_at IS NULL;
    
    IF user_id IS NOT NULL THEN
        -- Update the user to be confirmed
        UPDATE auth.users 
        SET 
            email_confirmed_at = NOW(),
            updated_at = NOW()
        WHERE id = user_id;
        
        -- Create profile if it doesn't exist
        INSERT INTO profiles (
            id, 
            first_name, 
            last_name, 
            business_name,
            created_at,
            updated_at
        )
        SELECT 
            user_id,
            (raw_user_meta_data->>'first_name')::TEXT,
            (raw_user_meta_data->>'last_name')::TEXT,
            (raw_user_meta_data->>'business_name')::TEXT,
            NOW(),
            NOW()
        FROM auth.users 
        WHERE id = user_id
        ON CONFLICT (id) DO NOTHING;
        
        -- Create user subscription with 14-day trial
        INSERT INTO user_subscriptions (
            user_id,
            plan_type,
            status,
            trial_start,
            trial_end,
            created_at,
            updated_at
        ) VALUES (
            user_id,
            'premium',
            'trialing',
            NOW(),
            NOW() + INTERVAL '14 days',
            NOW(),
            NOW()
        ) ON CONFLICT (user_id) DO NOTHING;
        
        RAISE NOTICE 'User % has been manually verified and profile created', user_email;
    ELSE
        RAISE NOTICE 'User % not found or already verified', user_email;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (for testing)
GRANT EXECUTE ON FUNCTION manually_verify_user(TEXT) TO authenticated;
