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
        <Label htmlFor="simNumber">{t("form.simNumber")}</Label>
        <Input
          id="simNumber"
          placeholder="SIM Number"
          {...register("simNumber")}
          className={errors.simNumber ? "border-red-500" : ""}
        />
        {errors.simNumber && (
          <p className="text-sm text-red-500">
            {errors.simNumber.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="simExpiryDate">{t("form.simExpiryDate")}</Label>
        <Input
          id="simExpiryDate"
          type="date"
          {...register("simExpiryDate")}
          className={errors.simExpiryDate ? "border-red-500" : ""}
        />
        {errors.simExpiryDate && (
          <p className="text-sm text-red-500">
            {errors.simExpiryDate.message as string}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactInformationForm;
