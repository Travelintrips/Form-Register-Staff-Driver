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
import { useLanguage } from "@/lib/i18n/LanguageContext";

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
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            {t("form.firstName")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            placeholder="John"
            {...register("firstName", { required: "First name is required" })}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">
              {errors.firstName.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            {t("form.lastName")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            placeholder="Doe"
            {...register("lastName", { required: "Last name is required" })}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">
              {errors.lastName.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">
          {t("form.fullName")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fullName"
          placeholder="John Doe"
          {...register("fullName", { required: "Full name is required" })}
          className={errors.fullName ? "border-red-500" : ""}
        />
        {errors.fullName && (
          <p className="text-sm text-red-500">
            {errors.fullName.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          {t("auth.email")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john.doe@example.com"
          {...register("email")}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-500">
            {errors.email.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="personalInfoPassword">
          {t("auth.password")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="personalInfoPassword"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && (
          <p className="text-sm text-red-500">
            {errors.password.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ktpAddress">{t("form.ktpAddress")}</Label>
        <Input
          id="ktpAddress"
          placeholder="Address as per KTP"
          {...register("ktpAddress")}
          className={errors.ktpAddress ? "border-red-500" : ""}
        />
        {errors.ktpAddress && (
          <p className="text-sm text-red-500">
            {errors.ktpAddress.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ktpNumber">{t("form.ktpNumber")}</Label>
        <Input
          id="ktpNumber"
          placeholder="KTP Number"
          {...register("ktpNumber")}
          className={errors.ktpNumber ? "border-red-500" : ""}
        />
        {errors.ktpNumber && (
          <p className="text-sm text-red-500">
            {errors.ktpNumber.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="religion">{t("form.religion")}</Label>
        <Select
          onValueChange={(value) => {
            setValue("religion", value); // ✅ ini yang penting
          }}
        >
          <SelectTrigger className={errors.religion ? "border-red-500" : ""}>
            <SelectValue placeholder={t("religion.select")} />
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
          <p className="text-sm text-red-500">
            {errors.religion.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ethnicity" className="text-sm">
          {t("form.ethnicity")}
        </Label>
        <select
          id="ethnicity"
          {...register("ethnicity")}
          className={`w-full border rounded px-3 py-2 text-sm ${
            errors.ethnicity ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">{t("ethnicity.select")}</option>
          <option value="Sunda">Sunda</option>
          <option value="Batak">Batak</option>
          <option value="Jawa">Jawa</option>
          <option value="Madura">Madura</option>
          <option value="Dayak">Dayak</option>
          <option value="Betawi">Betawi</option>
          <option value="Asmat">Asmat</option>
          <option value="Bugis">Bugis</option>
          <option value="Ambon">Ambon</option>
          <option value="Balinese">Balinese</option>
        </select>
        {errors.ethnicity && (
          <p className="text-sm text-red-500">
            {errors.ethnicity.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="education" className="text-sm">
          {t("form.education")}
        </Label>
        <select
          id="education"
          {...register("education")}
          className={`w-full border rounded px-3 py-2 text-sm ${
            errors.education ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">{t("education.select")}</option>
          <option value="SMP">SMP</option>
          <option value="SMA">SMA</option>
          <option value="SMK">SMK</option>
          <option value="S1">S1</option>
          <option value="S2">S2</option>
          <option value="S3">S3</option>
        </select>
        {errors.education && (
          <p className="text-sm text-red-500">
            {errors.education.message as string}
          </p>
        )}
      </div>
    </div>
  );
};

export default PersonalInformationForm;
