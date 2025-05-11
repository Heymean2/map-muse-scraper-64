
-- Add new columns for Google authentication
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email',
ADD COLUMN IF NOT EXISTS display_name TEXT DEFAULT NULL;

-- Update the handle_new_user function to capture Google profile data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  provider_type TEXT;
  display_name TEXT;
  avatar TEXT;
BEGIN
  -- Determine auth provider
  IF new.app_metadata->>'provider' = 'google' THEN
    provider_type := 'google';
    display_name := new.raw_user_meta_data->>'full_name';
    avatar := new.raw_user_meta_data->>'avatar_url';
  ELSE
    provider_type := 'email';
    display_name := NULL;
    avatar := NULL;
  END IF;

  INSERT INTO public.profiles (
    id, 
    email,
    avatar_url,
    provider,
    display_name
  )
  VALUES (
    new.id, 
    new.email,
    avatar,
    provider_type,
    display_name
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
