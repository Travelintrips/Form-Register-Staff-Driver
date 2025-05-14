import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PersonalInformationFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: (field: string, value: any) => void; // ✅ tambahkan ini
}

const PersonalInformationForm: React.FC<PersonalInformationFormProps> = ({
  register,
  errors,
  setValue,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            placeholder="John"
            {...register("firstName", { required: "First name is required" })}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
<<<<<<< HEAD
            <p className="text-sm text-red-500">
              {errors.firstName.message as string}
            </p>
=======
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
>>>>>>> a73acc1 (Reconnect to GitHub from VS Code)
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            placeholder="Doe"
            {...register("lastName", { required: "Last name is required" })}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
<<<<<<< HEAD
            <p className="text-sm text-red-500">
              {errors.lastName.message as string}
            </p>
=======
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
>>>>>>> a73acc1 (Reconnect to GitHub from VS Code)
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fullName"
          placeholder="John Doe"
          {...register("fullName", { required: "Full name is required" })}
          className={errors.fullName ? "border-red-500" : ""}
        />
        {errors.fullName && (
<<<<<<< HEAD
          <p className="text-sm text-red-500">
            {errors.fullName.message as string}
          </p>
=======
          <p className="text-sm text-red-500">{errors.fullName.message}</p>
>>>>>>> a73acc1 (Reconnect to GitHub from VS Code)
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john.doe@example.com"
          {...register("email")}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
<<<<<<< HEAD
          <p className="text-sm text-red-500">
            {errors.email.message as string}
          </p>
=======
          <p className="text-sm text-red-500">{errors.email.message}</p>
>>>>>>> a73acc1 (Reconnect to GitHub from VS Code)
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="personalInfoPassword">
          Password <span className="text-red-500">*</span>
        </Label>
        <Input
          id="personalInfoPassword"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && (
<<<<<<< HEAD
          <p className="text-sm text-red-500">
            {errors.password.message as string}
          </p>
=======
          <p className="text-sm text-red-500">{errors.password.message}</p>
>>>>>>> a73acc1 (Reconnect to GitHub from VS Code)
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ktpAddress">KTP Address</Label>
        <Input
          id="ktpAddress"
          placeholder="Address as per KTP"
          {...register("ktpAddress")}
          className={errors.ktpAddress ? "border-red-500" : ""}
        />
        {errors.ktpAddress && (
<<<<<<< HEAD
          <p className="text-sm text-red-500">
            {errors.ktpAddress.message as string}
          </p>
=======
          <p className="text-sm text-red-500">{errors.ktpAddress.message}</p>
>>>>>>> a73acc1 (Reconnect to GitHub from VS Code)
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ktpNumber">KTP Number</Label>
        <Input
          id="ktpNumber"
          placeholder="KTP Number"
          {...register("ktpNumber")}
          className={errors.ktpNumber ? "border-red-500" : ""}
        />
        {errors.ktpNumber && (
<<<<<<< HEAD
          <p className="text-sm text-red-500">
            {errors.ktpNumber.message as string}
          </p>
=======
          <p className="text-sm text-red-500">{errors.ktpNumber.message}</p>
>>>>>>> a73acc1 (Reconnect to GitHub from VS Code)
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="religion">Religion</Label>
        <Select
          onValueChange={(value) => {
            setValue("religion", value); // ✅ ini yang penting
          }}
        >
          <SelectTrigger className={errors.religion ? "border-red-500" : ""}>
            <SelectValue placeholder="Select Religion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Islam">Islam</SelectItem>
            <SelectItem value="Kristen">Kristen</SelectItem>
            <SelectItem value="Katolik">Katolik</SelectItem>
            <SelectItem value="Hindu">Hindu</SelectItem>
            <SelectItem value="Buddha">Buddha</SelectItem>
            <SelectItem value="Konghucu">Konghucu</SelectItem>
            <SelectItem value="Lainnya">Lainnya</SelectItem>
          </SelectContent>
        </Select>
        {errors.religion && (
<<<<<<< HEAD
          <p className="text-sm text-red-500">
            {errors.religion.message as string}
          </p>
=======
          <p className="text-sm text-red-500">{errors.religion.message}</p>
>>>>>>> a73acc1 (Reconnect to GitHub from VS Code)
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ethnicity">Ethnicity</Label>
        <Input
          id="ethnicity"
          placeholder="Ethnicity"
          {...register("ethnicity")}
          className={errors.ethnicity ? "border-red-500" : ""}
        />
        {errors.ethnicity && (
<<<<<<< HEAD
          <p className="text-sm text-red-500">
            {errors.ethnicity.message as string}
          </p>
=======
          <p className="text-sm text-red-500">{errors.ethnicity.message}</p>
>>>>>>> a73acc1 (Reconnect to GitHub from VS Code)
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="education">Education</Label>
        <Input
          id="education"
          placeholder="Highest Education"
          {...register("education")}
          className={errors.education ? "border-red-500" : ""}
        />
        {errors.education && (
<<<<<<< HEAD
          <p className="text-sm text-red-500">
            {errors.education.message as string}
          </p>
=======
          <p className="text-sm text-red-500">{errors.education.message}</p>
>>>>>>> a73acc1 (Reconnect to GitHub from VS Code)
        )}
      </div>
    </div>
  );
};

export default PersonalInformationForm;
