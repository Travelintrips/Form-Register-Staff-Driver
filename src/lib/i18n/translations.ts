// Define translation types
export type Language = "en" | "id";

export interface Translations {
  [key: string]: {
    en: string;
    id: string;
  };
}

// Define translations
export const translations: Translations = {
  // Common terms
  "common.termsAgreement": {
    en: "By creating an account, you agree to our",
    id: "Dengan membuat akun, Anda menyetujui",
  },
  "common.termsOfService": {
    en: "Terms of Service",
    id: "Ketentuan Layanan",
  },
  "common.privacyPolicy": {
    en: "Privacy Policy",
    id: "Kebijakan Privasi",
  },
  "common.and": {
    en: "and",
    id: "dan",
  },
  // Common
  "app.name": {
    en: "Travelintrips",
    id: "Travelintrips",
  },
  "common.loading": {
    en: "Loading...",
    id: "Memuat...",
  },
  "common.error": {
    en: "An error occurred",
    id: "Terjadi kesalahan",
  },
  "common.success": {
    en: "Success",
    id: "Berhasil",
  },
  "common.required": {
    en: "Required",
    id: "Wajib",
  },
  "common.requiredFields": {
    en: "Required fields",
    id: "Kolom wajib diisi",
  },

  // Auth
  "auth.signin": {
    en: "Sign in",
    id: "Masuk",
  },
  "auth.signin.title": {
    en: "Sign in to your account",
    id: "Masuk ke akun Anda",
  },
  "auth.signin.subtitle": {
    en: "Enter your email and password to sign in",
    id: "Masukkan email dan kata sandi Anda untuk masuk",
  },
  "auth.signup": {
    en: "Sign up",
    id: "Daftar",
  },
  "auth.signout": {
    en: "Sign out",
    id: "Keluar",
  },
  "auth.email": {
    en: "Email",
    id: "Email",
  },
  "auth.password": {
    en: "Password",
    id: "Kata Sandi",
  },
  "auth.forgotPassword": {
    en: "Forgot password?",
    id: "Lupa kata sandi?",
  },
  "auth.noAccount": {
    en: "Don't have an account?",
    id: "Belum punya akun?",
  },
  "auth.hasAccount": {
    en: "Already have an account?",
    id: "Sudah punya akun?",
  },
  "auth.signingIn": {
    en: "Signing in...",
    id: "Sedang masuk...",
  },
  "auth.loginSuccess": {
    en: "Login successful! Redirecting...",
    id: "Login berhasil! Mengalihkan...",
  },

  // Registration
  "register.title": {
    en: "Create an account",
    id: "Buat akun",
  },
  "register.subtitle": {
    en: "Enter your information to create an account",
    id: "Masukkan informasi Anda untuk membuat akun",
  },
  "register.creatingAccount": {
    en: "Creating account...",
    id: "Membuat akun...",
  },
  "register.createAccount": {
    en: "Create account",
    id: "Buat akun",
  },
  "register.success": {
    en: "Registration successful! Your account has been created.",
    id: "Pendaftaran berhasil! Akun Anda telah dibuat.",
  },

  // Form Fields
  "form.firstName": {
    en: "First Name",
    id: "Nama Depan",
  },
  "form.lastName": {
    en: "Last Name",
    id: "Nama Belakang",
  },
  "form.fullName": {
    en: "Full Name",
    id: "Nama Lengkap",
  },
  "form.phoneNumber": {
    en: "Phone Number",
    id: "Nomor Telepon",
  },
  "form.familyPhoneNumber": {
    en: "Family Phone Number",
    id: "Nomor Telepon Keluarga",
  },
  "form.ktpAddress": {
    en: "KTP Address",
    id: "Alamat KTP",
  },
  "form.ktpNumber": {
    en: "KTP Number",
    id: "Nomor KTP",
  },
  "form.licenseNumber": {
    en: "Licence Number",
    id: "Nomor SIM",
  },
  "form.licenseExpiry": {
    en: "SIM/License Expiry Date",
    id: "Tanggal Kadaluarsa SIM",
  },
  "form.religion": {
    en: "Religion",
    id: "Agama",
  },
  "form.ethnicity": {
    en: "Ethnicity",
    id: "Etnis",
  },
  "form.education": {
    en: "Education",
    id: "Pendidikan",
  },

  // Tabs
  "tabs.personal": {
    en: "Personal",
    id: "Data Pribadi",
  },
  "tabs.contact": {
    en: "Contact",
    id: "Kontak",
  },
  "tabs.vehicle": {
    en: "Vehicle",
    id: "Kendaraan",
  },
  "tabs.documents": {
    en: "Documents",
    id: "Dokumen",
  },

  // Vehicle
  "vehicle.name": {
    en: "Vehicle Name",
    id: "Nama Kendaraan",
  },
  "vehicle.type": {
    en: "Vehicle Type",
    id: "Jenis Kendaraan",
  },
  "vehicle.brand": {
    en: "Vehicle Brand",
    id: "Merek Kendaraan",
  },
  "vehicle.licensePlate": {
    en: "License Plate",
    id: "Plat Nomor",
  },
  "vehicle.year": {
    en: "Vehicle Year",
    id: "Tahun Kendaraan",
  },
  "vehicle.color": {
    en: "Vehicle Color",
    id: "Warna Kendaraan",
  },
  "vehicle.status": {
    en: "Vehicle Status",
    id: "Status Kendaraan",
  },
  "vehicle.photo": {
    en: "Vehicle Photo",
    id: "Foto Kendaraan",
  },

  // Documents
  "document.selfiePhoto": {
    en: "Selfie Photo",
    id: "Foto Selfie",
  },
  "document.familyCard": {
    en: "Family Card",
    id: "Kartu Keluarga",
  },
  "document.ktpDocument": {
    en: "KTP Document",
    id: "Dokumen KTP",
  },
  "document.simDocument": {
    en: "SIM",
    id: "SIM",
  },
  "document.skckDocument": {
    en: "SKCK Document",
    id: "Dokumen SKCK",
  },

  // Buttons
  "button.previous": {
    en: "Previous",
    id: "Sebelumnya",
  },
  "button.next": {
    en: "Next",
    id: "Selanjutnya",
  },
  "button.submit": {
    en: "Submit",
    id: "Kirim",
  },

  // Roles
  "role.label": {
    en: "Role",
    id: "Peran",
  },
  "role.select": {
    en: "Select a role",
    id: "Pilih peran",
  },
  "religion.select": {
    en: "Select Religion",
    id: "Pilih Agama",
  },
  "ethnicity.select": {
    en: "Select Ethnicity",
    id: "Pilih Suku",
  },

  "education.select": {
    en: "Select Education",
    id: "Pilih Pendidikan",
  },
  "role.staffAdmin": {
    en: "Staff Admin",
    id: "Staf Admin",
  },
  "role.admin": {
    en: "Admin",
    id: "Admin",
  },
  "role.staffTrips": {
    en: "Staff Trips",
    id: "Staf Perjalanan",
  },
  "role.staffTraffick": {
    en: "Staff Traffic",
    id: "Staf Lalu Lintas",
  },
  "role.driverPerusahaan": {
    en: "Driver Perusahaan",
    id: "Pengemudi Perusahaan",
  },
  "role.driverMitra": {
    en: "Driver Mitra",
    id: "Pengemudi Mitra",
  },

  // Language
  "language.select": {
    en: "Language",
    id: "Bahasa",
  },
  "language.english": {
    en: "English",
    id: "Inggris",
  },
  "language.indonesian": {
    en: "Indonesian",
    id: "Indonesia",
  },
};
