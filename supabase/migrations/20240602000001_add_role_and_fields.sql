-- Add role column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role VARCHAR(50);

-- Add common fields for all roles
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name VARCHAR(200);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ktp_address TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS family_phone_number VARCHAR(20);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ktp_number VARCHAR(50);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS sim_number VARCHAR(50);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS sim_expiry_date DATE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS religion VARCHAR(50);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ethnicity VARCHAR(50);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS education VARCHAR(100);

-- Add fields for file uploads
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS selfie_photo_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS family_card_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ktp_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS skck_url TEXT;

-- Add fields specific to Driver Mitra role
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS vehicle_name VARCHAR(100);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS vehicle_type VARCHAR(100);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS vehicle_brand VARCHAR(100);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS license_plate VARCHAR(20);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS vehicle_year INTEGER;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS vehicle_color VARCHAR(50);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS vehicle_status VARCHAR(50);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS vehicle_photo_url TEXT;