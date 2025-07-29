import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ContactInformationFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const ContactInformationForm: React.FC<ContactInformationFormProps> = ({
  register,
  errors,
}) => {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">
          {t("form.phoneNumber")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phoneNumber"
          placeholder="+62 123456789"
          {...register("phoneNumber", { required: "Phone number is required" })}
          className={errors.phoneNumber ? "border-red-500" : ""}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-red-500">
            {errors.phoneNumber.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="familyPhoneNumber">{t("form.familyPhoneNumber")}</Label>
        <Input
          id="familyPhoneNumber"
          placeholder="+62 123456789"
          {...register("familyPhoneNumber")}
          className={errors.familyPhoneNumber ? "border-red-500" : ""}
        />
        {errors.familyPhoneNumber && (
          <p className="text-sm text-red-500">
            {errors.familyPhoneNumber.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="licenseNumber">{t("form.licenseNumber")}</Label>
        <Input
          id="licenseNumber"
          placeholder="SIM Number"
          {...register("licenseNumber")}
          className={errors.licenseNumber ? "border-red-500" : ""}
        />
        {errors.licenseNumber && (
          <p className="text-sm text-red-500">
            {errors.licenseNumber.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="licenseExpiry">{t("form.licenseExpiry")}</Label>
        <Input
          id="licenseExpiry"
          type="date"
          {...register("licenseExpiry")}
          className={errors.licenseExpiry ? "border-red-500" : ""}
        />
        {errors.licenseExpiry && (
          <p className="text-sm text-red-500">
            {errors.licenseExpiry.message as string}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactInformationForm;
