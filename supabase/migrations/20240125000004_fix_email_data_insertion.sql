-- Fix email data insertion in users table
-- This migration ensures email is properly captured from auth.users

-- Drop existing trigger and function to recreate them
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create improved trigger function with better email handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
  role_mapping INTEGER;
  user_email TEXT;
BEGIN
  -- Log the trigger execution for debugging
  RAISE LOG 'handle_new_user trigger fired for user: %', NEW.id;
  RAISE LOG 'User email from NEW.email: %', NEW.email;
  RAISE LOG 'User email from metadata: %', NEW.raw_user_meta_data->>'email';
  RAISE LOG 'User metadata: %', NEW.raw_user_meta_data;
  
  -- Get email from NEW.email first, then fallback to metadata
  user_email := COALESCE(
    NULLIF(NEW.email, ''),
    NULLIF(NEW.raw_user_meta_data->>'email', ''),
    NEW.email
  );
  
  RAISE LOG 'Final email to be inserted: %', user_email;
  
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
      user_email,
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
      email = COALESCE(
        NULLIF(EXCLUDED.email, ''),
        NULLIF(users.email, ''),
        EXCLUDED.email
      ),
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
      
    RAISE LOG 'Successfully inserted/updated user: % with email: %', NEW.id, user_email;
    
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

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update existing NULL email records with email from auth.users
DO $
BEGIN
  UPDATE public.users 
  SET email = auth_users.email,
      updated_at = now()
  FROM auth.users auth_users 
  WHERE public.users.id = auth_users.id 
    AND (public.users.email IS NULL OR public.users.email = '')
    AND auth_users.email IS NOT NULL 
    AND auth_users.email != '';
  
  RAISE LOG 'Updated existing NULL email records in users table';
END
$;
