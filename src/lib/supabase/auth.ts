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
    console.log(`Uploading file: ${file.name} to ${bucket}/${folder}`);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      throw new Error(`File upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    console.log(`File uploaded successfully: ${data.publicUrl}`);
    return data.publicUrl;
  } catch (error) {
    console.error("File upload error:", error);
    throw error;
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
    console.log("Starting user registration for role:", role);
    console.log("Email:", email);

    // Validate required parameters
    if (!email || !role) {
      console.error("Missing required fields: email or role");
      return {
        data: null,
        error: new Error("Email and role are required") as AuthError,
      };
    }
    // Upload files to Supabase Storage
    console.log("Starting file uploads...");
    const selfiePhotoUrl = selfiePhoto
      ? await uploadFile(selfiePhoto, "user-documents", "selfies")
      : null;
    console.log(
      "Selfie photo uploaded:",
      selfiePhotoUrl ? "success" : "skipped",
    );

    const familyCardUrl = familyCard
      ? await uploadFile(familyCard, "user-documents", "family-cards")
      : null;
    console.log("Family card uploaded:", familyCardUrl ? "success" : "skipped");

    const ktpUrl = ktpDocument
      ? await uploadFile(ktpDocument, "user-documents", "ktp")
      : null;
    console.log("KTP document uploaded:", ktpUrl ? "success" : "skipped");

    const simUrl = simDocument
      ? await uploadFile(simDocument, "user-documents", "sim")
      : null;
    console.log("SIM document uploaded:", simUrl ? "success" : "skipped");

    const skckUrl = skckDocument
      ? await uploadFile(skckDocument, "user-documents", "skck")
      : null;
    console.log("SKCK document uploaded:", skckUrl ? "success" : "skipped");

    const vehiclePhotoUrl = vehiclePhoto
      ? await uploadFile(vehiclePhoto, "user-documents", "vehicles")
      : null;
    console.log(
      "Vehicle photo uploaded:",
      vehiclePhotoUrl ? "success" : "skipped",
    );

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

    // Use the password provided by the user
    const { password } = arguments[0];

    if (!password) {
      return {
        data: null,
        error: new Error("Password is required") as AuthError,
      };
    }

    console.log("Creating user account with Supabase Auth...");
    console.log("User data being sent to auth:", userData);
    console.log("Email being used:", email);

    console.log("Attempting Supabase Auth signup...");
    console.log("Email being passed to signUp:", email);
    const { data, error }: AuthResponse = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          email: email, // Explicitly include email in metadata first
          ...userData,
        },
      },
    });

    if (error) {
      console.error("Supabase Auth signup error:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        name: error.name,
        stack: error.stack,
      });
      console.error("User data that was sent:", userData);

      // Handle specific database errors with more detailed messages
      if (error.message?.includes("Database error saving new user")) {
        console.error("Database trigger error detected");
        console.error(
          "This indicates an issue with the handle_new_user() trigger function",
        );
        console.error("Possible causes:");
        console.error("1. Trigger function doesn't have proper permissions");
        console.error("2. RLS policies are blocking the insert");
        console.error("3. Missing columns in the users table");
        console.error("4. Data type mismatch in the trigger function");

        return {
          data: null,
          error: {
            ...error,
            message:
              "Registration failed due to database configuration. The system could not create your user profile. Please try again or contact support if the problem persists.",
          } as AuthError,
        };
      }

      // Handle other common auth errors
      if (error.message?.includes("User already registered")) {
        return {
          data: null,
          error: {
            ...error,
            message:
              "An account with this email already exists. Please try logging in instead.",
          } as AuthError,
        };
      }

      if (error.message?.includes("Invalid email")) {
        return {
          data: null,
          error: {
            ...error,
            message: "Please enter a valid email address.",
          } as AuthError,
        };
      }

      if (error.message?.includes("Password")) {
        return {
          data: null,
          error: {
            ...error,
            message: "Password must be at least 6 characters long.",
          } as AuthError,
        };
      }

      return { data: null, error };
    }

    console.log("User account created successfully:", data?.user?.id);
    console.log("User email:", data?.user?.email);
    console.log("User metadata:", data?.user?.user_metadata);

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
          console.log("Updating user profile in database...");
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
            throw new Error(`Database error: ${upsertError.message}`);
          }
          console.log("User profile updated successfully");
        }

        if (
          role === "Staff Admin" ||
          role === "Staff Trips" ||
          role === "Staff Traffick"
        ) {
          console.log("Inserting staff data...");
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
              family_phone_number: familyPhoneNumber || "",
              ktp_number: ktpNumber || "",
              sim_number: simNumber || "",
              selfie_url: selfiePhotoUrl || "",
              kk_url: familyCardUrl || "",
              ktp_url: ktpUrl || "",
              skck_url: skckUrl || "",
            });

          if (insertStaffError) {
            console.error("Error inserting into staff:", insertStaffError);
            throw new Error(
              `Staff database error: ${insertStaffError.message}`,
            );
          }
          console.log("Staff data inserted successfully");
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
            family_phone_number: familyPhoneNumber || "",
            license_number: simNumber || "",
            license_expiry: simExpiryDate || null,
            //ethnicity: ethnicity || "",
            //  education: education || "",
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
              vehicle_status: vehicleStatus || "",
            });
          }

          console.log("Inserting driver data...");
          const { error: insertDriverError } = await supabase
            .from("drivers")
            .insert(driverData);

          if (insertDriverError) {
            console.error("Error inserting into drivers:", insertDriverError);
            throw new Error(
              `Driver database error: ${insertDriverError.message}`,
            );
          }
          console.log("Driver data inserted successfully");
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
