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

    -- Tentukan nama tampilan
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

    RAISE NOTICE '=== handle_new_user DEBUG ===';
    RAISE NOTICE 'User ID: %', NEW.id;
    RAISE NOTICE 'Role ID: %', user_role_id;
    RAISE NOTICE 'Role: %', user_role;
    RAISE NOTICE 'Display Name: %', display_name;
    RAISE NOTICE 'Email: %', user_email;

    -- Pastikan metadata "name" ada
    IF NULLIF(NEW.raw_user_meta_data->>'name','') IS NULL THEN
        NEW.raw_user_meta_data := jsonb_set(
            COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
            '{name}',
            to_jsonb(display_name)
        );
    END IF;

    -- Insert ke tabel users
    INSERT INTO public.users (
        id, email, role_id, role,
        first_name, last_name, full_name, phone_number,
        created_at, updated_at
    )
    VALUES (
        NEW.id, user_email, user_role_id, user_role,
        COALESCE(NEW.raw_user_meta_data->>'first_name',''),
        COALESCE(NEW.raw_user_meta_data->>'last_name',''),
        display_name,
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

    RAISE NOTICE '✅ User inserted/updated in public.users';

    -- =========================================================
    -- 🚗 Driver Mitra (role_id = 2) → memiliki kendaraan sendiri
    -- =========================================================
    IF user_role_id = 2 OR user_role = 'Driver Mitra' THEN
        RAISE NOTICE '🚗 Attempting to insert Driver Mitra...';
        BEGIN
            INSERT INTO public.drivers (
                id, email, full_name, first_name, last_name,
                phone_number, role_name, role_id, driver_type,
                religion, ethnicity, education, ktp_address, ktp_number,
                family_phone_number, license_number, license_expiry,
                selfie_url, kk_url, ktp_url, sim_url, skck_url,
                vehicle_name, vehicle_brand, vehicle_color, vehicle_type,
                license_plate, vehicle_year, vehicle_status,
                status, created_at, updated_at
            )
            VALUES (
                NEW.id,
                user_email,
                display_name,
                COALESCE(NEW.raw_user_meta_data->>'first_name',''),
                COALESCE(NEW.raw_user_meta_data->>'last_name',''),
                COALESCE(NEW.raw_user_meta_data->>'phone_number',''),
                user_role,
                user_role_id,
                'Mitra',
                COALESCE(NEW.raw_user_meta_data->>'religion',''),
                COALESCE(NEW.raw_user_meta_data->>'ethnicity',''),
                COALESCE(NEW.raw_user_meta_data->>'education',''),
                COALESCE(NEW.raw_user_meta_data->>'ktp_address',''),
                COALESCE(NEW.raw_user_meta_data->>'ktp_number',''),
                COALESCE(NEW.raw_user_meta_data->>'family_phone_number',''),
                COALESCE(NEW.raw_user_meta_data->>'license_number',''),
                NULLIF(NEW.raw_user_meta_data->>'license_expiry','')::date,
                COALESCE(NEW.raw_user_meta_data->>'selfie_photo_url',''),
                COALESCE(NEW.raw_user_meta_data->>'family_card_url',''),
                COALESCE(NEW.raw_user_meta_data->>'ktp_url',''),
                COALESCE(NEW.raw_user_meta_data->>'sim_url',''),
                COALESCE(NEW.raw_user_meta_data->>'skck_url',''),
                COALESCE(NEW.raw_user_meta_data->>'vehicle_name',''),
                COALESCE(NEW.raw_user_meta_data->>'vehicle_brand',''),
                COALESCE(NEW.raw_user_meta_data->>'vehicle_color',''),
                COALESCE(NEW.raw_user_meta_data->>'vehicle_type',''),
                COALESCE(NEW.raw_user_meta_data->>'license_plate',''),
                COALESCE(NEW.raw_user_meta_data->>'vehicle_year',''),
                COALESCE(NEW.raw_user_meta_data->>'vehicle_status','available'),
                'available',
                now(), now()
            )
            ON CONFLICT (id) DO NOTHING;

            RAISE NOTICE '✅ Driver Mitra inserted successfully: %', display_name;
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING '❌ Failed inserting Driver Mitra %: % (SQLSTATE: %)', display_name, SQLERRM, SQLSTATE;
        END;

    -- =========================================================
    -- 🚛 Driver Perusahaan (role_id = 3) → tanpa kendaraan pribadi
    -- =========================================================
    ELSIF user_role_id = 3 OR user_role = 'Driver Perusahaan' THEN
        RAISE NOTICE '🚛 Attempting to insert Driver Perusahaan...';
        BEGIN
            INSERT INTO public.drivers (
                id, email, full_name, first_name, last_name,
                phone_number, role_name, role_id, driver_type,
                religion, ethnicity, education, ktp_address, ktp_number,
                family_phone_number, license_number, license_expiry,
                selfie_url, kk_url, ktp_url, sim_url, skck_url,
                status, created_at, updated_at
            )
            VALUES (
                NEW.id,
                user_email,
                display_name,
                COALESCE(NEW.raw_user_meta_data->>'first_name',''),
                COALESCE(NEW.raw_user_meta_data->>'last_name',''),
                COALESCE(NEW.raw_user_meta_data->>'phone_number',''),
                user_role,
                user_role_id,
                'Perusahaan',
                COALESCE(NEW.raw_user_meta_data->>'religion',''),
                COALESCE(NEW.raw_user_meta_data->>'ethnicity',''),
                COALESCE(NEW.raw_user_meta_data->>'education',''),
                COALESCE(NEW.raw_user_meta_data->>'ktp_address',''),
                COALESCE(NEW.raw_user_meta_data->>'ktp_number',''),
                COALESCE(NEW.raw_user_meta_data->>'family_phone_number',''),
                COALESCE(NEW.raw_user_meta_data->>'license_number',''),
                NULLIF(NEW.raw_user_meta_data->>'license_expiry','')::date,
                COALESCE(NEW.raw_user_meta_data->>'selfie_photo_url',''),
                COALESCE(NEW.raw_user_meta_data->>'family_card_url',''),
                COALESCE(NEW.raw_user_meta_data->>'ktp_url',''),
                COALESCE(NEW.raw_user_meta_data->>'sim_url',''),
                COALESCE(NEW.raw_user_meta_data->>'skck_url',''),
                'available',
                now(), now()
            )
            ON CONFLICT (id) DO NOTHING;

            RAISE NOTICE '✅ Driver Perusahaan inserted successfully: %', display_name;
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING '❌ Failed inserting Driver Perusahaan %: % (SQLSTATE: %)', display_name, SQLERRM, SQLSTATE;
        END;
    END IF;

    -- 👔 Jika Staff / Admin (role_id = 5 atau 7)
    IF user_role_id IN (5, 7) OR user_role ILIKE 'Staff%' OR user_role ILIKE 'Admin%' THEN
        RAISE NOTICE '👔 Attempting to insert Staff...';
        BEGIN
            INSERT INTO public.staff (
                id, user_id, name, email, phone, full_name,
                first_name, last_name, role, role_id,
                religion, ethnicity, address, family_phone_number,
                ktp_number, license_number, selfie_url, kk_url,
                ktp_url, skck_url, created_at, updated_at
            )
            VALUES (
                NEW.id,
                NEW.id,
                display_name,
                user_email,
                COALESCE(NEW.raw_user_meta_data->>'phone_number',''),
                display_name,
                COALESCE(NEW.raw_user_meta_data->>'first_name',''),
                COALESCE(NEW.raw_user_meta_data->>'last_name',''),
                user_role,
                user_role_id,
                COALESCE(NEW.raw_user_meta_data->>'religion',''),
                COALESCE(NEW.raw_user_meta_data->>'ethnicity',''),
                COALESCE(NEW.raw_user_meta_data->>'ktp_address',''),
                COALESCE(NEW.raw_user_meta_data->>'family_phone_number',''),
                COALESCE(NEW.raw_user_meta_data->>'ktp_number',''),
                COALESCE(NEW.raw_user_meta_data->>'license_number',''),
                COALESCE(NEW.raw_user_meta_data->>'selfie_photo_url',''),
                COALESCE(NEW.raw_user_meta_data->>'family_card_url',''),
                COALESCE(NEW.raw_user_meta_data->>'ktp_url',''),
                COALESCE(NEW.raw_user_meta_data->>'skck_url',''),
                now(), now()
            )
            ON CONFLICT (id) DO NOTHING;

            RAISE NOTICE '✅ Staff inserted successfully: %', display_name;
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING '❌ Failed inserting staff %: % (SQLSTATE: %)', display_name, SQLERRM, SQLSTATE;
        END;
    END IF;

    RAISE NOTICE '=== End handle_new_user ===';
    RETURN NEW;
END;
$$;
