import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Upload } from "lucide-react";
import { registerUser } from "@/lib/supabase/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import PersonalInformationForm from "./PersonalInformationForm";
import ContactInformationForm from "./ContactInformationForm";
import VehicleInformationForm from "./VehicleInformationForm";

// Form validation schema
const registrationSchema = z
  .object({
    role: z.string({ required_error: "Role is required" }),
    // Authentication
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters"),
    // Personal information
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    fullName: z.string().optional(),
    ktpAddress: z.string().optional(),
    ktpNumber: z.string().optional(),
    religion: z.string().optional(),
    ethnicity: z.string().optional(),
    education: z.string().optional(),
    // Contact information
    phoneNumber: z.string().optional(),
    familyPhoneNumber: z.string().optional(),
    licenseNumber: z.string().optional(),
    licenseExpiry: z.string().optional(),
    // Vehicle information (only required for Driver Mitra)
    vehicleName: z.string().optional(),
    vehicleType: z.string().optional(),
    vehicleBrand: z.string().optional(),
    licensePlate: z.string().optional(),
    vehicleYear: z.string().optional(),
    vehicleColor: z.string().optional(),
    vehicleStatus: z.string().optional(),
    // Document uploads
    selfiePhoto: z.any().optional(),
    familyCard: z.any().optional(),
    ktpDocument: z.any().optional(),
    simDocument: z.any().optional(),
    skckDocument: z.any().optional(),
    vehiclePhoto: z.any().optional(),
  })
  .refine(
    (data) => {
      // If role is Driver Mitra, vehicle information is required
      if (data.role === "Driver Mitra") {
        return (
          !!data.vehicleName &&
          !!data.vehicleType &&
          !!data.vehicleBrand &&
          !!data.licensePlate &&
          !!data.vehicleYear &&
          !!data.vehicleColor &&
          !!data.vehicleStatus
        );
      }
      return true;
    },
    {
      message: "Vehicle information is required for Driver Mitra",
      path: ["vehicleName"],
    },
  );

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const RegistrationForm = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("personal");
  const [tabsSequence, setTabsSequence] = useState<string[]>([
    "personal",
    "contact",
    "documents",
  ]);
  const [fileUploads, setFileUploads] = useState({
    selfiePhoto: null,
    familyCard: null,
    ktpDocument: null,
    simDocument: null,
    skckDocument: null,
    vehiclePhoto: null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      role: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      fullName: "",
      ktpAddress: "",
      ktpNumber: "",
      phoneNumber: "",
      familyPhoneNumber: "",
      licenseNumber: "",
      licenseExpiry: "",
      religion: "",
      ethnicity: "",
      education: "",
      vehicleName: "",
      vehicleType: "",
      vehicleBrand: "",
      licensePlate: "",
      vehicleYear: "",
      vehicleColor: "",
      vehicleStatus: "",
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileUploads((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
      setValue(fieldName as any, file);
    }
  };

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsLoading(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      console.log("Starting registration process...");
      console.log("Form data:", {
        email: data.email,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
      });
      console.log("File uploads:", {
        selfiePhoto: fileUploads.selfiePhoto?.name,
        familyCard: fileUploads.familyCard?.name,
        ktpDocument: fileUploads.ktpDocument?.name,
        simDocument: fileUploads.simDocument?.name,
        skckDocument: fileUploads.skckDocument?.name,
        vehiclePhoto: fileUploads.vehiclePhoto?.name,
      });

      // Validate required fields based on role
      if (!data.email || !data.password || !data.role) {
        throw new Error("Email, password, and role are required");
      }

      // Call Supabase auth service
      const { data: userData, error } = await registerUser({
        email: data.email,
        password: data.password,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: data.fullName,
        ktpAddress: data.ktpAddress,
        phoneNumber: data.phoneNumber,
        familyPhoneNumber: data.familyPhoneNumber,
        ktpNumber: data.ktpNumber,
        licenseNumber: data.licenseNumber,
        licenseExpiry: data.licenseExpiry,
        religion: data.religion,
        ethnicity: data.ethnicity,
        education: data.education,
        // File uploads
        selfiePhoto: fileUploads.selfiePhoto,
        familyCard: fileUploads.familyCard,
        ktpDocument: fileUploads.ktpDocument,
        simDocument: fileUploads.simDocument,
        skckDocument: fileUploads.skckDocument,
        // Only include vehicle data if role is Driver Mitra
        ...(data.role === "Driver Mitra" && {
          vehicleName: data.vehicleName,
          vehicleType: data.vehicleType,
          vehicleBrand: data.vehicleBrand,
          licensePlate: data.licensePlate,
          vehicleYear: data.vehicleYear,
          vehicleColor: data.vehicleColor,
          vehicleStatus: data.vehicleStatus,
          vehiclePhoto: fileUploads.vehiclePhoto,
        }),
      });

      if (error) {
        console.error("Registration error:", error);
        let errorMessage = "Database error saving new user";

        if (error.message) {
          errorMessage = error.message;
        }

        // Handle specific error types
        if (error.message?.includes("duplicate key")) {
          errorMessage = "An account with this email already exists";
        } else if (error.message?.includes("invalid email")) {
          errorMessage = "Please enter a valid email address";
        } else if (error.message?.includes("weak password")) {
          errorMessage =
            "Password is too weak. Please use at least 6 characters";
        } else if (error.message?.includes("network")) {
          errorMessage =
            "Network error. Please check your internet connection and try again";
        } else if (error.message?.includes("storage")) {
          errorMessage = "Error uploading files. Please try again";
        }

        throw new Error(errorMessage);
      }

      console.log("Registration successful:", userData);
      setFormSuccess("Account created successfully! You can now login.");
      reset();
      setFileUploads({
        selfiePhoto: null,
        familyCard: null,
        ktpDocument: null,
        simDocument: null,
        skckDocument: null,
        vehiclePhoto: null,
      });
    } catch (error) {
      console.error("Form submission error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during registration. Please try again.";
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen px-0 py-4">
      <div className="w-full max-w-none p-4 md:p-10 rounded-lg bg-white shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-primary">
            {t("app.name")} <span className="text-yellow-500">★</span>
          </h1>
          <h2 className="text-2xl font-bold mt-2">{t("register.title")}</h2>
          <p className="text-muted-foreground">{t("register.subtitle")}</p>
        </div>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {formError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            {formSuccess && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{formSuccess}</AlertDescription>
              </Alert>
            )}

            <Tabs
              value={currentTab}
              onValueChange={setCurrentTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger id="tab-personal" value="personal">
                  {t("tabs.personal")}
                </TabsTrigger>
                <TabsTrigger id="tab-contact" value="contact">
                  {t("tabs.contact")}
                </TabsTrigger>
              </TabsList>

              {selectedRole === "Driver Mitra" && (
                <TabsList className="grid w-full grid-cols-2 mt-2">
                  <TabsTrigger id="tab-vehicle" value="vehicle">
                    {t("tabs.vehicle")}
                  </TabsTrigger>
                  <TabsTrigger id="tab-documents" value="documents">
                    {t("tabs.documents")}
                  </TabsTrigger>
                </TabsList>
              )}

              {selectedRole && selectedRole !== "Driver Mitra" && (
                <TabsList className="grid w-full grid-cols-1 mt-2">
                  <TabsTrigger id="tab-documents" value="documents">
                    {t("tabs.documents")}
                  </TabsTrigger>
                </TabsList>
              )}

              <TabsContent value="personal" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="role">
                    {t("role.label") || "Role"}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setSelectedRole(value);
                      const event = { target: { name: "role", value } };
                      register("role").onChange(event);

                      // Update tabs sequence based on role
                      if (value === "Driver Mitra") {
                        setTabsSequence([
                          "personal",
                          "contact",
                          "vehicle",
                          "documents",
                        ]);
                      } else {
                        setTabsSequence(["personal", "contact", "documents"]);
                      }
                    }}
                  >
                    <SelectTrigger
                      className={errors.role ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder={t("role.select")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Staff Admin">
                        {t("role.staffAdmin")}
                      </SelectItem>

                      <SelectItem value="Admin">{t("role.admin")}</SelectItem>

                      <SelectItem value="Staff Trips">
                        {t("role.staffTrips")}
                      </SelectItem>
                      <SelectItem value="Staff Traffic">
                        {t("role.staffTraffic")}
                      </SelectItem>
                      <SelectItem value="Driver Perusahaan">
                        {t("role.driverPerusahaan")}
                      </SelectItem>
                      <SelectItem value="Driver Mitra">
                        {t("role.driverMitra")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-red-500">
                      {errors.role.message as string}
                    </p>
                  )}
                </div>

                <PersonalInformationForm
                  register={register}
                  errors={errors}
                  setValue={setValue}
                />
              </TabsContent>

              <TabsContent value="contact" className="space-y-4 pt-4">
                <ContactInformationForm register={register} errors={errors} />
              </TabsContent>

              {selectedRole === "Driver Mitra" && (
                <TabsContent value="vehicle" className="space-y-4 pt-4">
                  <VehicleInformationForm register={register} errors={errors} />
                </TabsContent>
              )}

              <TabsContent value="documents" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="selfiePhoto">Selfie Photo</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="selfiePhoto"
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={(e) => handleFileChange(e, "selfiePhoto")}
                        className={errors.selfiePhoto ? "border-red-500" : ""}
                      />
                      {fileUploads.selfiePhoto && (
                        <span className="text-sm text-green-600">
                          ✓ {fileUploads.selfiePhoto.name}
                        </span>
                      )}
                    </div>
                    {errors.selfiePhoto && (
                      <p className="text-sm text-red-500">
                        {errors.selfiePhoto.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="familyCard">Family Card</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="familyCard"
                        type="file"
                        accept="image/*,.pdf"
                        capture="environment"
                        onChange={(e) => handleFileChange(e, "familyCard")}
                        className={errors.familyCard ? "border-red-500" : ""}
                      />
                      {fileUploads.familyCard && (
                        <span className="text-sm text-green-600">
                          ✓ {fileUploads.familyCard.name}
                        </span>
                      )}
                    </div>
                    {errors.familyCard && (
                      <p className="text-sm text-red-500">
                        {errors.familyCard.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ktpDocument">KTP Document</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="ktpDocument"
                        type="file"
                        accept="image/*,.pdf"
                        capture="environment"
                        onChange={(e) => handleFileChange(e, "ktpDocument")}
                        className={errors.ktpDocument ? "border-red-500" : ""}
                      />
                      {fileUploads.ktpDocument && (
                        <span className="text-sm text-green-600">
                          ✓ {fileUploads.ktpDocument.name}
                        </span>
                      )}
                    </div>
                    {errors.ktpDocument && (
                      <p className="text-sm text-red-500">
                        {errors.ktpDocument.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="simDocument">SIM</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="simDocument"
                        type="file"
                        accept="image/*,.pdf"
                        capture="environment"
                        onChange={(e) => handleFileChange(e, "simDocument")}
                        className={errors.simDocument ? "border-red-500" : ""}
                      />
                      {fileUploads.simDocument && (
                        <span className="text-sm text-green-600">
                          ✓ {fileUploads.simDocument.name}
                        </span>
                      )}
                    </div>
                    {errors.simDocument && (
                      <p className="text-sm text-red-500">
                        {errors.simDocument.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skckDocument">SKCK Document</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="skckDocument"
                        type="file"
                        accept="image/*,.pdf"
                        capture="environment"
                        onChange={(e) => handleFileChange(e, "skckDocument")}
                        className={errors.skckDocument ? "border-red-500" : ""}
                      />
                      {fileUploads.skckDocument && (
                        <span className="text-sm text-green-600">
                          ✓ {fileUploads.skckDocument.name}
                        </span>
                      )}
                    </div>
                    {errors.skckDocument && (
                      <p className="text-sm text-red-500">
                        {errors.skckDocument.message as string}
                      </p>
                    )}
                  </div>

                  {selectedRole === "Driver Mitra" && (
                    <div className="space-y-2">
                      <Label htmlFor="vehiclePhoto">Vehicle Photo</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="vehiclePhoto"
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleFileChange(e, "vehiclePhoto")}
                          className={
                            errors.vehiclePhoto ? "border-red-500" : ""
                          }
                        />
                        {fileUploads.vehiclePhoto && (
                          <span className="text-sm text-green-600">
                            ✓ {fileUploads.vehiclePhoto.name}
                          </span>
                        )}
                      </div>
                      {errors.vehiclePhoto && (
                        <p className="text-sm text-red-500">
                          {errors.vehiclePhoto.message as string}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-4">
              <div className="flex gap-2">
                {currentTab !== "personal" && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      const currentIndex = tabsSequence.indexOf(currentTab);
                      if (currentIndex > 0) {
                        const prevTab = tabsSequence[currentIndex - 1];
                        setCurrentTab(prevTab);
                      }
                    }}
                    disabled={isLoading}
                  >
                    {t("button.previous")}
                  </Button>
                )}

                {currentTab !== "documents" && (
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={() => {
                      const currentIndex = tabsSequence.indexOf(currentTab);
                      if (currentIndex < tabsSequence.length - 1) {
                        const nextTab = tabsSequence[currentIndex + 1];
                        setCurrentTab(nextTab);
                      }
                    }}
                    disabled={isLoading}
                  >
                    {t("button.next")}
                  </Button>
                )}

                {currentTab === "documents" && (
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>{t("register.creatingAccount")}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        <span>{t("register.createAccount")}</span>
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="text-center text-xs text-gray-500">
                <span className="text-red-500">*</span>{" "}
                {t("common.requiredFields") || "Required fields"}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            {t("auth.hasAccount")}{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              {t("auth.signin")}
            </a>
          </p>
        </CardFooter>
      </div>
    </div>
    // </div>
  );
};

export default RegistrationForm;
