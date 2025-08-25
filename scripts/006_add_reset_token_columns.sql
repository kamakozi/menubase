-- Add reset token columns to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN reset_token TEXT,
ADD COLUMN reset_token_expires TIMESTAMP WITH TIME ZONE;

-- Add index for faster token lookups
CREATE INDEX idx_user_profiles_reset_token ON user_profiles(reset_token);
