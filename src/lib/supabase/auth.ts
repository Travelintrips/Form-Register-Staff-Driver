import { createClient } from "@supabase/supabase-js";
import type { AuthError, AuthResponse } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface RegisterCredentials {
  email?: string;
  password?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  ktpAddress?: string;
  phoneNumber?: string;
  familyPhoneNumber?: string;
  ktpNumber?: string;
  simNumber?: string;
  simExpiryDate?: string;
  religion?: string;
  ethnicity?: string;
  education?: string;
  vehicleName?: string;
  vehicleType?: string;
  vehicleBrand?: string;
  licensePlate?: string;
  vehicleYear?: string;
  vehicleColor?: string;
  vehicleStatus?: string;
  selfiePhoto?: File;
  familyCard?: File;
  ktpDocument?: File;
  simDocument?: File; // Added simDocument to the interface
  skckDocument?: File;
  vehiclePhoto?: File;
}

interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Upload a file to Supabase Storage
 */
async function uploadFile(
  file: File,
  bucket: string,
  folder: string,
): Promise<string | null> {
  if (!file) return null;

  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error("File upload error:", error);
    return null;
  }
}

/**
 * Register a new user with email and password
 */
export async function registerUser({
  role,
  firstName,
  lastName,
  fullName,
  email,
  ktpAddress,
  phoneNumber,
  familyPhoneNumber,
  ktpNumber,
  simNumber,
  simExpiryDate,
  religion,
  ethnicity,
  education,
  vehicleName,
  vehicleType,
  vehicleBrand,
  licensePlate,
  vehicleYear,
  vehicleColor,
  vehicleStatus,
  selfiePhoto,
  familyCard,
  ktpDocument,
  simDocument,
  skckDocument,
  vehiclePhoto,
}: RegisterCredentials): Promise<{ data: any; error: AuthError | null }> {
  try {
    // Upload files to Supabase Storage
    const selfiePhotoUrl = selfiePhoto
      ? await uploadFile(selfiePhoto, "user-documents", "selfies")
      : null;
    const familyCardUrl = familyCard
      ? await uploadFile(familyCard, "user-documents", "family-cards")
      : null;
    const ktpUrl = ktpDocument
      ? await uploadFile(ktpDocument, "user-documents", "ktp")
      : null;
    const simUrl = simDocument
      ? await uploadFile(simDocument, "user-documents", "sim")
      : null;
    const skckUrl = skckDocument
      ? await uploadFile(skckDocument, "user-documents", "skck")
      : null;
    const vehiclePhotoUrl = vehiclePhoto
      ? await uploadFile(vehiclePhoto, "user-documents", "vehicles")
      : null;

    // Clean up the data by removing undefined values
    const userData = {
      role,
      first_name: firstName || null,
      last_name: lastName || null,
      full_name: fullName || null,
      ktp_address: ktpAddress || null,
      phone_number: phoneNumber || null,
      family_phone_number: familyPhoneNumber || null,
      ktp_number: ktpNumber || null,
      sim_number: simNumber || null,
      sim_expiry_date: simExpiryDate || null,
      religion: religion || null,
      ethnicity: ethnicity || null,
      education: education || null,
      vehicle_name: vehicleName || null,
      vehicle_type: vehicleType || null,
      vehicle_brand: vehicleBrand || null,
      license_plate: licensePlate || null,
      vehicle_year: vehicleYear || null,
      vehicle_color: vehicleColor || null,
      vehicle_status: vehicleStatus || null,
      selfie_photo_url: selfiePhotoUrl || null,
      family_card_url: familyCardUrl || null,
      ktp_url: ktpUrl || null,
      skck_url: skckUrl || null,
      sim_url: simUrl || null,
      vehicle_photo_url: vehiclePhotoUrl || null,
    };

    // Remove any null or undefined values to avoid sending empty fields
    Object.keys(userData).forEach((key) => {
      if (userData[key] === null || userData[key] === undefined) {
        delete userData[key];
      }
    });

    // Use the password provided by the user, but generate a random email
    const { password } = arguments[0];

    if (!password) {
      return {
        data: null,
        error: new Error("Password is required") as AuthError,
      };
    }

    const uuid = crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    const timestamp = Date.now();
    const randomEmail = `user_${uuid}_${timestamp}@anonymous.user`; // 💥 Bikin email random baru

    const { data, error }: AuthResponse = await supabase.auth.signUp({
      email, // ✅ pakai email user
      password,
      options: {
        data: userData,
      },
    });

    const roleMapping: Record<string, number> = {
      Admin: 1,
      "Driver Mitra": 2,
      "Driver Perusahaan": 3,
      Staff: 4,
      "Staff Traffic": 5,
      "Staff Admin": 6,
      "Staff Trips": 7,
      Dispatcher: 8,
      Pengawas: 9,
      Customer: 10,
    };

    const roleId = roleMapping[role] || null;

    // If user creation was successful, update the user profile in the public.users table directly
    if (data?.user && !error) {
      try {
        // Prepare profile data for the users table update
        const profileData: {
          first_name?: string;
          last_name?: string;
          full_name?: string;
          ktp_address?: string;
          phone_number?: string;
          family_phone_number?: string;
          ktp_number?: string;
          sim_number?: string;
          sim_expiry_date?: string;
          religion?: string;
          ethnicity?: string;
          education?: string;
          vehicle_name?: string;
          vehicle_type?: string;
          vehicle_brand?: string;
          license_plate?: string;
          vehicle_year?: string;
          vehicle_color?: string;
          vehicle_status?: string;
          selfie_photo_url?: string;
          family_card_url?: string;
          ktp_url?: string;
          sim_url?: string;
          skck_url?: string;
          vehicle_photo_url?: string;
        } = {};

        // Only add fields that have values
        if (firstName) profileData.first_name = firstName;
        if (lastName) profileData.last_name = lastName;
        if (fullName) profileData.full_name = fullName;
        if (ktpAddress) profileData.ktp_address = ktpAddress;
        if (phoneNumber) profileData.phone_number = phoneNumber;
        if (familyPhoneNumber)
          profileData.family_phone_number = familyPhoneNumber;
        if (ktpNumber) profileData.ktp_number = ktpNumber;
        if (simNumber) profileData.sim_number = simNumber;
        if (simExpiryDate) profileData.sim_expiry_date = simExpiryDate;
        if (religion) profileData.religion = religion;
        if (ethnicity) profileData.ethnicity = ethnicity;
        if (education) profileData.education = education;
        if (vehicleName) profileData.vehicle_name = vehicleName;
        if (vehicleType) profileData.vehicle_type = vehicleType;
        if (vehicleBrand) profileData.vehicle_brand = vehicleBrand;
        if (licensePlate) profileData.license_plate = licensePlate;
        if (vehicleYear) profileData.vehicle_year = vehicleYear;
        if (vehicleColor) profileData.vehicle_color = vehicleColor;
        if (vehicleStatus) profileData.vehicle_status = vehicleStatus;
        if (selfiePhotoUrl) profileData.selfie_photo_url = selfiePhotoUrl;
        if (familyCardUrl) profileData.family_card_url = familyCardUrl;
        if (ktpUrl) profileData.ktp_url = ktpUrl;
        if (simUrl) profileData.sim_url = simUrl;
        if (skckUrl) profileData.skck_url = skckUrl;
        if (vehiclePhotoUrl) profileData.vehicle_photo_url = vehiclePhotoUrl;

        // Only update if there's data to update
        if (Object.keys(profileData).length > 0) {
          // Upsert to the public.users table directly
          const { error: upsertError } = await supabase.from("users").upsert(
            {
              id: data.user.id,
              ...profileData,
              role_id: roleId,
            },
            { onConflict: "id" },
          );

          if (upsertError) {
            console.error(
              "Error upserting user profile in database:",
              upsertError,
            );
          }
        }

        if (
          role === "Staff Admin" ||
          role === "Staff Trips" ||
          role === "Staff Traffick"
        ) {
          const { error: insertStaffError } = await supabase
            .from("staff")
            .insert({
              id: data.user.id,
              user_id: data.user.id,
              name: fullName || "",
              email: email || "",
              phone: phoneNumber || "",
              full_name: fullName || "",
              first_name: firstName || "",
              last_name: lastName || "",
              role: role || "",
              role_id: roleId,
              religion: religion || null,
              ethnicity: ethnicity || "",
              address: ktpAddress || "",
              relative_phone: familyPhoneNumber || "",
              ktp_number: ktpNumber || "",
              sim_number: simNumber || "",
              selfie_url: selfiePhotoUrl || "",
              kk_url: familyCardUrl || "",
              ktp_url: ktpUrl || "",
              skck_url: skckUrl || "",
            });

          if (insertStaffError) {
            console.error("Error inserting into staff:", insertStaffError);
          }
        }

        // Insert data into drivers table if role is Driver Mitra or Driver Perusahaan
        if (role === "Driver Mitra" || role === "Driver Perusahaan") {
          const driverData = {
            id: data.user.id,
            name: fullName || "",
            email: email || "",
            phone: phoneNumber || "",
            phone_number: phoneNumber ? Number(phoneNumber) : null,
            full_name: fullName || "",
            first_name: firstName || "",
            last_name: lastName || "",
            role_id: roleId,
            role_name: role || "",
            religion: religion || null,
            ktp_address: ktpAddress || "",
            address: ktpAddress || "",
            ktp_number: ktpNumber || "",
            relative_phone: familyPhoneNumber || "",
            family_phone: familyPhoneNumber || "",
            license_number: simNumber || "",

            selfie_url: selfiePhotoUrl || "",
            kk_url: familyCardUrl || "",
            ktp_url: ktpUrl || "",
            sim_url: simUrl || "",
            skck_url: skckUrl || "",
            status: "active",
          };

          // Add vehicle information if role is Driver Mitra
          if (
            role === "Driver Mitra" &&
            vehicleName &&
            vehicleType &&
            vehicleBrand &&
            licensePlate
          ) {
            Object.assign(driverData, {
              model: vehicleName || "",
              type: vehicleType || "",
              vehicle_type: vehicleType || "",
              make: vehicleBrand || "",
              license_plate: licensePlate || "",
              year: vehicleYear ? Number(vehicleYear) : null,
              color: vehicleColor || "",
              front_image_url: vehiclePhotoUrl || "",
            });
          }

          const { error: insertDriverError } = await supabase
            .from("drivers")
            .insert(driverData);

          if (insertDriverError) {
            console.error("Error inserting into drivers:", insertDriverError);
          }
        }
      } catch (updateError) {
        console.error("Error updating user profile:", updateError);
      }
    }

    return { data, error };
  } catch (error) {
    console.error("Registration error:", error);
    return { data: null, error: error as AuthError };
  }
}

/**
 * Login a user with email and password
 */
export async function loginUser({
  email,
  password,
}: LoginCredentials): Promise<{ data: any; error: AuthError | null }> {
  try {
    const { data, error }: AuthResponse =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    return { data, error };
  } catch (error) {
    console.error("Login error:", error);
    return { data: null, error: error as AuthError };
  }
}

/**
 * Logout the current user
 */
export async function logoutUser(): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error("Logout error:", error);
    return { error: error as AuthError };
  }
}

/**
 * Send a password reset email
 */
export async function resetPassword(
  email: string,
): Promise<{ data: any; error: AuthError | null }> {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  } catch (error) {
    console.error("Password reset error:", error);
    return { data: null, error: error as AuthError };
  }
}

/**
 * Get the current logged in user
 */
export async function getCurrentUser() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return { user, error: null };
  } catch (error) {
    console.error("Get current user error:", error);
    return { user: null, error };
  }
}

export default supabase;
