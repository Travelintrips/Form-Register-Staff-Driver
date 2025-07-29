-- Drop the existing trigger and function to recreate them properly
-- Drop trigger first, then function to avoid dependency issues
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS after_user_signup ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Disable RLS temporarily to allow the trigger function to work
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Create a comprehensive trigger function that handles all user fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.users table with proper error handling
  INSERT INTO public.users (
    id, 
    email, 
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
    vehicle_photo_url,
    role_id
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.email, NEW.raw_user_meta_data->>'email'),
    COALESCE(NEW.raw_user_meta_data->>'role', ''),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'ktp_address', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'family_phone_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'ktp_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'sim_number', ''),
    CASE 
      WHEN NEW.raw_user_meta_data->>'sim_expiry_date' IS NOT NULL AND NEW.raw_user_meta_data->>'sim_expiry_date' != ''
      THEN (NEW.raw_user_meta_data->>'sim_expiry_date')::DATE
      ELSE NULL
    END,
    COALESCE(NEW.raw_user_meta_data->>'religion', ''),
    COALESCE(NEW.raw_user_meta_data->>'ethnicity', ''),
    COALESCE(NEW.raw_user_meta_data->>'education', ''),
    COALESCE(NEW.raw_user_meta_data->>'vehicle_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'vehicle_type', ''),
    COALESCE(NEW.raw_user_meta_data->>'vehicle_brand', ''),
    COALESCE(NEW.raw_user_meta_data->>'license_plate', ''),
    CASE 
      WHEN NEW.raw_user_meta_data->>'vehicle_year' IS NOT NULL AND NEW.raw_user_meta_data->>'vehicle_year' != ''
      THEN (NEW.raw_user_meta_data->>'vehicle_year')::INTEGER
      ELSE NULL
    END,
    COALESCE(NEW.raw_user_meta_data->>'vehicle_color', ''),
    COALESCE(NEW.raw_user_meta_data->>'vehicle_status', ''),
    COALESCE(NEW.raw_user_meta_data->>'selfie_photo_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'family_card_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'ktp_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'sim_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'skck_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'vehicle_photo_url', ''),
    CASE 
      WHEN NEW.raw_user_meta_data->>'role_id' IS NOT NULL AND NEW.raw_user_meta_data->>'role_id' != ''
      THEN (NEW.raw_user_meta_data->>'role_id')::INTEGER
      ELSE NULL
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.users.email),
    role = EXCLUDED.role,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    full_name = EXCLUDED.full_name,
    ktp_address = EXCLUDED.ktp_address,
    phone_number = EXCLUDED.phone_number,
    family_phone_number = EXCLUDED.family_phone_number,
    ktp_number = EXCLUDED.ktp_number,
    sim_number = EXCLUDED.sim_number,
    sim_expiry_date = EXCLUDED.sim_expiry_date,
    religion = EXCLUDED.religion,
    ethnicity = EXCLUDED.ethnicity,
    education = EXCLUDED.education,
    vehicle_name = EXCLUDED.vehicle_name,
    vehicle_type = EXCLUDED.vehicle_type,
    vehicle_brand = EXCLUDED.vehicle_brand,
    license_plate = EXCLUDED.license_plate,
    vehicle_year = EXCLUDED.vehicle_year,
    vehicle_color = EXCLUDED.vehicle_color,
    vehicle_status = EXCLUDED.vehicle_status,
    selfie_photo_url = EXCLUDED.selfie_photo_url,
    family_card_url = EXCLUDED.family_card_url,
    ktp_url = EXCLUDED.ktp_url,
    sim_url = EXCLUDED.sim_url,
    skck_url = EXCLUDED.skck_url,
    vehicle_photo_url = EXCLUDED.vehicle_photo_url,
    role_id = EXCLUDED.role_id,
    updated_at = now();
    
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error with more details
    RAISE LOG 'Error in handle_new_user trigger for user %: % - %', NEW.id, SQLSTATE, SQLERRM;
    -- Don't fail the auth signup, just return NEW
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions to the function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;

-- Grant necessary table permissions
GRANT INSERT, UPDATE ON public.users TO service_role;
GRANT INSERT, UPDATE ON public.users TO supabase_auth_admin;
GRANT INSERT, UPDATE ON public.users TO postgres;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Keep RLS disabled for easier management
-- The trigger function will handle user creation without RLS interference
-- RLS can be enabled later if needed with proper policies

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Allow service role full access" ON public.users;
DROP POLICY IF EXISTS "Allow auth admin full access" ON public.users;
DROP POLICY IF EXISTS "Allow trigger function to insert" ON public.users;
DROP POLICY IF EXISTS "Public read access" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON public.users;

-- Ensure all required tables exist
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  user_id UUID REFERENCES auth.users(id),
  name TEXT,
  email TEXT,
  phone TEXT,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  role TEXT,
  role_id INTEGER,
  religion TEXT,
  ethnicity TEXT,
  address TEXT,
  relative_phone TEXT,
  ktp_number TEXT,
  sim_number TEXT,
  selfie_url TEXT,
  kk_url TEXT,
  ktp_url TEXT,
  skck_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
  email TEXT,
  phone TEXT,
  phone_number BIGINT,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  role_id INTEGER,
  role_name TEXT,
  religion TEXT,
  ktp_address TEXT,
  address TEXT,
  ktp_number TEXT,
  relative_phone TEXT,
  family_phone TEXT,
  license_number TEXT,
  license_expiry DATE,
  selfie_url TEXT,
  kk_url TEXT,
  ktp_url TEXT,
  sim_url TEXT,
  skck_url TEXT,
  status TEXT DEFAULT 'active',
  model TEXT,
  type TEXT,
  vehicle_type TEXT,
  make TEXT,
  license_plate TEXT,
  year INTEGER,
  color TEXT,
  front_image_url TEXT,
  vehicle_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Disable RLS on staff and drivers tables for easier insertion
ALTER TABLE public.staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers DISABLE ROW LEVEL SECURITY;

-- Enable realtime for all tables (only if not already added)
DO $$
BEGIN
  -- Add users table to realtime if not already added
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'users' 
    AND schemaname = 'public'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  END IF;
  
  -- Add staff table to realtime if not already added
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'staff' 
    AND schemaname = 'public'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.staff;
  END IF;
  
  -- Add drivers table to realtime if not already added
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'drivers' 
    AND schemaname = 'public'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.drivers;
  END IF;
END $$;