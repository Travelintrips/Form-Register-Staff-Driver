CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role text;
    user_email text;
    user_role_id int;
    display_name text;
BEGIN
    -- Ambil metadata dari Supabase Auth
    user_role_id := COALESCE(NULLIF(NEW.raw_user_meta_data->>'role_id','')::int, 10);
    user_role := NULLIF(NEW.raw_user_meta_data->>'role','');
    user_email := COALESCE(NULLIF(NEW.raw_user_meta_data->>'email',''), NEW.email);

    -- Ambil role name dari tabel roles jika belum diisi
    IF user_role IS NULL THEN
        SELECT role_name INTO user_role
        FROM roles
        WHERE role_id = user_role_id;

        IF user_role IS NULL THEN
            CASE user_role_id
                WHEN 10 THEN user_role := 'Customer';
                WHEN 2  THEN user_role := 'Driver Mitra';
                WHEN 3  THEN user_role := 'Driver Perusahaan';
                WHEN 5  THEN user_role := 'Staff Traffic';
                WHEN 7  THEN user_role := 'Staff Trips';
                ELSE        user_role := 'Customer';
            END CASE;
        END IF;
    END IF;

    -- Tentukan nama tampilan (display_name) - ambil dari metadata yang sudah dikirim frontend
    display_name := COALESCE(
        NULLIF(NEW.raw_user_meta_data->>'name',''),
        NULLIF(NEW.raw_user_meta_data->>'full_name',''),
        trim(
          concat(
            COALESCE(NEW.raw_user_meta_data->>'first_name',''),
            ' ',
            COALESCE(NEW.raw_user_meta_data->>'last_name','')
          )
        ),
        NEW.email
    );

    -- Logging
    RAISE NOTICE 'handle_new_user → id=%, role_id=%, role=%, display_name=%, raw_name=%', 
        NEW.id, user_role_id, user_role, display_name, NEW.raw_user_meta_data->>'name';

    -- ✅ CRITICAL: Pastikan field 'name' ada di raw_user_meta_data
    -- Jika field 'name' tidak ada atau kosong, set dengan display_name
    IF NULLIF(NEW.raw_user_meta_data->>'name','') IS NULL THEN
        NEW.raw_user_meta_data := jsonb_set(
            COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
            '{name}',
            to_jsonb(display_name)
        );
        RAISE NOTICE 'Set name field to: %', display_name;
    END IF;

    -- Insert / Update ke tabel public.users
    INSERT INTO public.users (
        id, email, role_id, role,
        first_name, last_name, full_name, phone_number,
        created_at, updated_at
    )
    VALUES (
        NEW.id, user_email, user_role_id, user_role,
        COALESCE(NEW.raw_user_meta_data->>'first_name',''),
        COALESCE(NEW.raw_user_meta_data->>'last_name',''),
        COALESCE(NEW.raw_user_meta_data->>'full_name',''),
        COALESCE(NEW.raw_user_meta_data->>'phone_number',''),
        now(), now()
    )
    ON CONFLICT (id) DO UPDATE
    SET email        = EXCLUDED.email,
        role_id      = EXCLUDED.role_id,
        role         = COALESCE(EXCLUDED.role, users.role),
        first_name   = EXCLUDED.first_name,
        last_name    = EXCLUDED.last_name,
        full_name    = EXCLUDED.full_name,
        phone_number = EXCLUDED.phone_number,
        updated_at   = now();

    RETURN NEW;
END;
$$;
