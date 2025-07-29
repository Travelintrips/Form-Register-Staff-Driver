-- Fix the trigger function to ensure data is properly inserted into users table
-- This migration addresses the issue where no data is being inserted

-- First, let's check if the users table exists and has the right structure
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  username TEXT,
  role VARCHAR(50),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  full_name VARCHAR(200),
  ktp_address TEXT,
  phone_number VARCHAR(20),
  family_phone_number VARCHAR(20),
  ktp_number VARCHAR(50),
  sim_number VARCHAR(50),
  sim_expiry_date DATE,
  religion VARCHAR(50),
  ethnicity VARCHAR(50),
  education VARCHAR(100),
  vehicle_name VARCHAR(100),
  vehicle_type VARCHAR(100),
  vehicle_brand VARCHAR(100),
  license_plate VARCHAR(20),
  vehicle_year INTEGER,
  vehicle_color VARCHAR(50),
  vehicle_status VARCHAR(50),
  selfie_photo_url TEXT,
  family_card_url TEXT,
  ktp_url TEXT,
  sim_url TEXT,
  skck_url TEXT,
  vehicle_photo_url TEXT,
  role_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ensure RLS is disabled for easier trigger operation
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Drop existing trigger and function to recreate them
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS after_user_signup ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create a simplified but robust trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
  role_mapping INTEGER;
BEGIN
  -- Log the trigger execution for debugging
  RAISE LOG 'handle_new_user trigger fired for user: %', NEW.id;
  RAISE LOG 'User email: %', NEW.email;
  RAISE LOG 'User metadata: %', NEW.raw_user_meta_data;
  
  -- Get role from metadata
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', '');
  
  -- Map role to role_id
  CASE user_role
    WHEN 'Admin' THEN role_mapping := 1;
    WHEN 'Driver Mitra' THEN role_mapping := 2;
    WHEN 'Driver Perusahaan' THEN role_mapping := 3;
    WHEN 'Staff' THEN role_mapping := 4;
    WHEN 'Staff Traffic' THEN role_mapping := 5;
    WHEN 'Staff Admin' THEN role_mapping := 6;
    WHEN 'Staff Trips' THEN role_mapping := 7;
    WHEN 'Dispatcher' THEN role_mapping := 8;
    WHEN 'Pengawas' THEN role_mapping := 9;
    WHEN 'Customer' THEN role_mapping := 10;
    ELSE role_mapping := NULL;
  END CASE;
  
  -- Insert into public.users table with proper error handling
  BEGIN
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
      COALESCE(NEW.email, ''),
      user_role,
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
      role_mapping
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
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
      
    RAISE LOG 'Successfully inserted/updated user: %', NEW.id;
    
  EXCEPTION
    WHEN OTHERS THEN
      RAISE LOG 'Error in handle_new_user trigger for user %: % - %', NEW.id, SQLSTATE, SQLERRM;
      -- Don't fail the auth signup, just log the error
  END;
    
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
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.users TO supabase_auth_admin;
GRANT ALL ON public.users TO postgres;
GRANT INSERT, UPDATE, SELECT ON public.users TO authenticated;
GRANT INSERT, UPDATE, SELECT ON public.users TO anon;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure staff and drivers tables exist with proper structure
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
  family_phone_number TEXT,
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
  family_phone_number TEXT,
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

-- Disable RLS on staff and drivers tables
ALTER TABLE public.staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers DISABLE ROW LEVEL SECURITY;

-- Grant permissions on staff and drivers tables
GRANT ALL ON public.staff TO service_role;
GRANT ALL ON public.staff TO supabase_auth_admin;
GRANT ALL ON public.staff TO postgres;
GRANT INSERT, UPDATE, SELECT ON public.staff TO authenticated;

GRANT ALL ON public.drivers TO service_role;
GRANT ALL ON public.drivers TO supabase_auth_admin;
GRANT ALL ON public.drivers TO postgres;
GRANT INSERT, UPDATE, SELECT ON public.drivers TO authenticated;

-- Enable realtime for all tables
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
