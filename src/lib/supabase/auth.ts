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
  licenseNumber?: string;
  licenseExpiry?: string;
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
    // console.log(`Uploading file: ${file.name} to ${bucket}/${folder}`);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      //  console.error("Error uploading file:", uploadError);
      throw new Error(`File upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    // console.log(`File uploaded successfully: ${data.publicUrl}`);
    return data.publicUrl;
  } catch (error) {
    //  console.error("File upload error:", error);
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
  licenseNumber,
  licenseExpiry,
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
    // console.log("Starting user registration for role:", role);
    //  console.log("Email:", email);

    // Validate required parameters
    if (!email || !role) {
      // console.error("Missing required fields: email or role");
      return {
        data: null,
        error: new Error("Email and role are required") as AuthError,
      };
    }
    // Upload files to Supabase Storage
    //  console.log("Starting file uploads...");
    const selfiePhotoUrl = selfiePhoto
      ? await uploadFile(selfiePhoto, "user-documents", "selfies")
      : null;
    /*   console.log(
      "Selfie photo uploaded:",
      selfiePhotoUrl ? "success" : "skipped",
    );*/

    const familyCardUrl = familyCard
      ? await uploadFile(familyCard, "user-documents", "family-cards")
      : null;
    //  console.log("Family card uploaded:", familyCardUrl ? "success" : "skipped");

    const ktpUrl = ktpDocument
      ? await uploadFile(ktpDocument, "user-documents", "ktp")
      : null;
    // console.log("KTP document uploaded:", ktpUrl ? "success" : "skipped");

    const simUrl = simDocument
      ? await uploadFile(simDocument, "user-documents", "sim")
      : null;
    // console.log("SIM document uploaded:", simUrl ? "success" : "skipped");

    const skckUrl = skckDocument
      ? await uploadFile(skckDocument, "user-documents", "skck")
      : null;
    //  console.log("SKCK document uploaded:", skckUrl ? "success" : "skipped");

    const vehiclePhotoUrl = vehiclePhoto
      ? await uploadFile(vehiclePhoto, "user-documents", "vehicles")
      : null;
    /* console.log(
      "Vehicle photo uploaded:",
      vehiclePhotoUrl ? "success" : "skipped",
    );*/

    // Prepare display name for Supabase Auth - MUST have a value
    // ✅ Priority: Full Name > First+Last > Email
    const displayName = (
      fullName?.trim() ||
      `${firstName || ""} ${lastName || ""}`.trim() ||
      email
    ).trim();

    console.log("=== DEBUG: Registration Data ===");
    console.log("firstName:", firstName);
    console.log("lastName:", lastName);
    console.log("fullName:", fullName);
    console.log("displayName (will be used as 'name'):", displayName);
    console.log("email:", email);

    // 🔢 Tentukan role_id berdasarkan role
    // ========================================
    let roleId = 10; // Default Customer

    if (role === "Admin") roleId = 1;
    else if (role === "Driver Mitra") roleId = 2;
    else if (role === "Driver Perusahaan") roleId = 3;
    else if (role === "Staff Traffic") roleId = 5;
    else if (role === "Staff Trips") roleId = 7;
    else if (role === "Dispatcher") roleId = 8;
    else if (role === "Agent") roleId = 11;

    console.log("Mapped role_id:", roleId);

    // Clean up the data by removing undefined values
    const userData = {
      role,
      role_id: roleId,
      name: displayName, // ✅ CRITICAL: This is what Supabase Auth uses for Display Name
      full_name: displayName,
      display_name: displayName,
      first_name: firstName || "",
      last_name: lastName || "",
      ktp_address: ktpAddress || null,
      phone_number: phoneNumber || null,
      family_phone_number: familyPhoneNumber || null,
      ktp_number: ktpNumber || null,
      license_number: licenseNumber || null,
      license_expiry: licenseExpiry || null,
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

    // Remove any null or undefined values EXCEPT full_name, first_name, last_name, name, display_name, and role
    Object.keys(userData).forEach((key) => {
      if (
        key === "full_name" ||
        key === "first_name" ||
        key === "last_name" ||
        key === "name" ||
        key === "display_name" ||
        key === "role" ||
        key === "role_id"
      ) {
        return;
      }
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

    console.log("=== DEBUG: userData being sent to Supabase Auth ===");
    console.log(JSON.stringify(userData, null, 2));

    // ✅ Sign up user - trigger database akan handle insert ke public.users, staff, drivers
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) {
      console.error("❌ Error signing up:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        name: error.name,
      });

      // Return user-friendly error messages
      if (error.message?.includes("Database error saving new user")) {
        return {
          data: null,
          error: {
            ...error,
            message:
              "Registration failed due to database configuration. Please try again or contact support.",
          } as AuthError,
        };
      }

      if (error.message?.includes("User already registered")) {
        return {
          data: null,
          error: {
            ...error,
            message:
              "An account with this email already exists. Please log in instead.",
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

    console.log("✅ User signed up successfully:", data?.user?.id);
    console.log("User email:", data?.user?.email);
    console.log("User metadata:", data?.user?.user_metadata);

    // ✅ Return signup result - database trigger will handle the rest
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
    //  console.error("Login error:", error);
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
    //  console.error("Logout error:", error);
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
    // console.error("Password reset error:", error);
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
    //  console.error("Get current user error:", error);
    return { user: null, error };
  }
}

export default supabase;
