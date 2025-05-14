import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
    simNumber: z.string().optional(),
    simExpiryDate: z.string().optional(),
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
      simNumber: "",
      simExpiryDate: "",
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
        simNumber: data.simNumber,
        simExpiryDate: data.simExpiryDate,
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
        throw new Error(error.message);
      }

      setFormSuccess("Registration successful! Your account has been created.");
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
      setFormError(
        error instanceof Error
          ? error.message
          : "An error occurred during registration",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    //  <div className="flex justify-center items-center min-h-screen bg-gray-50 p-2">
    <div className="bg-gray-50">
      <div className="pt-1 pb-2 text-center">
        <h1 className="text-4xl font-bold text-primary">
          Travelintrips <span className="text-yellow-500">★</span>
        </h1>
      </div>
      <Card className="w-full max-w-full sm:max-w-2xl md:max-w-4xl p-2 md:p-10 rounded-2xl shadow-lg bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
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
                  Personal
                </TabsTrigger>
                <TabsTrigger id="tab-contact" value="contact">
                  Contact
                </TabsTrigger>
              </TabsList>

              {selectedRole === "Driver Mitra" && (
                <TabsList className="grid w-full grid-cols-2 mt-2">
                  <TabsTrigger id="tab-vehicle" value="vehicle">
                    Vehicle
                  </TabsTrigger>
                  <TabsTrigger id="tab-documents" value="documents">
                    Documents
                  </TabsTrigger>
                </TabsList>
              )}

              {selectedRole && selectedRole !== "Driver Mitra" && (
                <TabsList className="grid w-full grid-cols-1 mt-2">
                  <TabsTrigger id="tab-documents" value="documents">
                    Documents
                  </TabsTrigger>
                </TabsList>
              )}

              <TabsContent value="personal" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="role">
                    Role <span className="text-red-500">*</span>
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
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Staff Admin">Staff Admin</SelectItem>

                      <SelectItem value="Admin">Admin</SelectItem>

                      <SelectItem value="Staff Trips">Staff Trips</SelectItem>
                      <SelectItem value="Staff Traffick">
                        Staff Traffick
                      </SelectItem>
                      <SelectItem value="Driver Perusahaan">
                        Driver Perusahaan
                      </SelectItem>
                      <SelectItem value="Driver Mitra">Driver Mitra</SelectItem>
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

                  {(selectedRole === "Driver Perusahaan" ||
                    selectedRole === "Driver Mitra") && (
                    <div className="space-y-2">
                      <Label htmlFor="simDocument">SIM</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="simDocument"
                          type="file"
                          accept="image/*,.pdf"
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
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="skckDocument">SKCK Document</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="skckDocument"
                        type="file"
                        accept="image/*,.pdf"
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
                    Previous
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
                    Next
                  </Button>
                )}

                {currentTab === "documents" && (
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        <span>Create account</span>
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="text-center text-xs text-gray-500">
                <span className="text-red-500">*</span> Required fields
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegistrationForm;
