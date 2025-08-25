-- Create professional email templates for SmartMenu
-- This will customize the email templates in Supabase

-- Note: These templates need to be configured in the Supabase Dashboard
-- Go to Authentication > Email Templates to set these up

/*
CONFIRMATION EMAIL TEMPLATE:

Subject: Welcome to SmartMenu - Confirm Your Account

HTML Body:
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to SmartMenu</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white; }
        .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
        .content { padding: 40px 30px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">SmartMenu</div>
            <p>Welcome to the future of restaurant menus</p>
        </div>
        <div class="content">
            <h2>Confirm Your Account</h2>
            <p>Thank you for joining SmartMenu! We're excited to help you transform your restaurant with beautiful, digital menus.</p>
            <p>To get started, please confirm your email address by clicking the button below:</p>
            <a href="{{ .ConfirmationURL }}" class="button">Confirm Email Address</a>
            <p>Once confirmed, you'll be able to:</p>
            <ul>
                <li>Create stunning digital menus</li>
                <li>Manage your restaurant information</li>
                <li>Track menu analytics</li>
                <li>Customize your menu themes</li>
            </ul>
            <p>If you didn't create this account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>© 2024 SmartMenu. All rights reserved.</p>
            <p>This email was sent to {{ .Email }}</p>
        </div>
    </div>
</body>
</html>

PASSWORD RESET EMAIL TEMPLATE:

Subject: Reset Your SmartMenu Password

HTML Body:
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - SmartMenu</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white; }
        .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
        .content { padding: 40px 30px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { background: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        .security-notice { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">SmartMenu</div>
            <p>Password Reset Request</p>
        </div>
        <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset the password for your SmartMenu account.</p>
            <p>Click the button below to create a new password:</p>
            <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
            <div class="security-notice">
                <strong>Security Notice:</strong> This link will expire in 1 hour for your security. If you didn't request this password reset, please ignore this email.
            </div>
            <p>If you're having trouble clicking the button, copy and paste the following link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">{{ .ConfirmationURL }}</p>
        </div>
        <div class="footer">
            <p>© 2024 SmartMenu. All rights reserved.</p>
            <p>This email was sent to {{ .Email }}</p>
        </div>
    </div>
</body>
</html>
*/

-- Create a function to handle user profile creation after email confirmation
CREATE OR REPLACE FUNCTION public.handle_new_user_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile when email is confirmed
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    INSERT INTO public.profiles (id, email, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NOW(), NOW());
    
    -- Create user subscription with 14-day trial
    INSERT INTO public.user_subscriptions (
      user_id, 
      plan_type, 
      status, 
      trial_start, 
      trial_end, 
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
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for confirmed users
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_confirmed();
