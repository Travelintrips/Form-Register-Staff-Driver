-- Fix the handle_new_user trigger function to handle all the new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert basic user data
  INSERT INTO public.users (
    id, 
    email, 
    username,
    role,
    first_name,
    last_name,
    full_name,
    ktp_address,
    phone_number,
    family_phone_number,
    ktp_number,
    sim_number,
    sim_expiry_date,
    religion,
    ethnicity,
    education,
    vehicle_name,
    vehicle_type,
    vehicle_brand,
    license_plate,
    vehicle_year,
    vehicle_color,
    vehicle_status,
    selfie_photo_url,
    family_card_url,
    ktp_url,
    sim_url,
    skck_url,
    vehicle_photo_url
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'role',
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'ktp_address',
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'family_phone_number',
    NEW.raw_user_meta_data->>'ktp_number',
    NEW.raw_user_meta_data->>'sim_number',
    CASE 
      WHEN NEW.raw_user_meta_data->>'sim_expiry_date' IS NOT NULL AND NEW.raw_user_meta_data->>'sim_expiry_date' != ''
      THEN (NEW.raw_user_meta_data->>'sim_expiry_date')::DATE
      ELSE NULL
    END,
    NEW.raw_user_meta_data->>'religion',
    NEW.raw_user_meta_data->>'ethnicity',
    NEW.raw_user_meta_data->>'education',
    NEW.raw_user_meta_data->>'vehicle_name',
    NEW.raw_user_meta_data->>'vehicle_type',
    NEW.raw_user_meta_data->>'vehicle_brand',
    NEW.raw_user_meta_data->>'license_plate',
    CASE 
      WHEN NEW.raw_user_meta_data->>'vehicle_year' IS NOT NULL AND NEW.raw_user_meta_data->>'vehicle_year' != ''
      THEN (NEW.raw_user_meta_data->>'vehicle_year')::INTEGER
      ELSE NULL
    END,
    NEW.raw_user_meta_data->>'vehicle_color',
    NEW.raw_user_meta_data->>'vehicle_status',
    NEW.raw_user_meta_data->>'selfie_photo_url',
    NEW.raw_user_meta_data->>'family_card_url',
    NEW.raw_user_meta_data->>'ktp_url',
    NEW.raw_user_meta_data->>'sim_url',
    NEW.raw_user_meta_data->>'skck_url',
    NEW.raw_user_meta_data->>'vehicle_photo_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add missing sim_url column if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS sim_url TEXT;

-- Add role_id column if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role_id INTEGER;

-- Create INSERT policy for the trigger function
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
CREATE POLICY "Enable insert for authenticated users only"
  ON public.users
  FOR INSERT
  WITH CHECK (true);

-- Update the trigger to use the new function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for the users table (only if not already added)
DO $
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'users'
  ) THEN
    alter publication supabase_realtime add table public.users;
  END IF;
END
$;
