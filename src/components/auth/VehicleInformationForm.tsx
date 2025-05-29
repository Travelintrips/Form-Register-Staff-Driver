import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface VehicleInformationFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const VehicleInformationForm: React.FC<VehicleInformationFormProps> = ({
  register,
  errors,
}) => {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleName">
            {t("vehicle.name")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="vehicleName"
            placeholder="Vehicle Name"
            {...register("vehicleName", {
              required: "Vehicle name is required",
            })}
            className={errors.vehicleName ? "border-red-500" : ""}
          />
          {errors.vehicleName && (
            <p className="text-sm text-red-500">
              {errors.vehicleName.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleType">
            {t("vehicle.type")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="vehicleType"
            placeholder="Car, Motorcycle, etc."
            {...register("vehicleType", {
              required: "Vehicle type is required",
            })}
            className={errors.vehicleType ? "border-red-500" : ""}
          />
          {errors.vehicleType && (
            <p className="text-sm text-red-500">
              {errors.vehicleType.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleBrand">
            {t("vehicle.brand")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="vehicleBrand"
            placeholder="Toyota, Honda, etc."
            {...register("vehicleBrand", {
              required: "Vehicle brand is required",
            })}
            className={errors.vehicleBrand ? "border-red-500" : ""}
          />
          {errors.vehicleBrand && (
            <p className="text-sm text-red-500">
              {errors.vehicleBrand.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="licensePlate">
            {t("vehicle.licensePlate")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="licensePlate"
            placeholder="B 1234 ABC"
            {...register("licensePlate", {
              required: "License plate is required",
            })}
            className={errors.licensePlate ? "border-red-500" : ""}
          />
          {errors.licensePlate && (
            <p className="text-sm text-red-500">
              {errors.licensePlate.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleYear">
            {t("vehicle.year")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="vehicleYear"
            placeholder="2020"
            type="number"
            {...register("vehicleYear", {
              required: "Vehicle year is required",
            })}
            className={errors.vehicleYear ? "border-red-500" : ""}
          />
          {errors.vehicleYear && (
            <p className="text-sm text-red-500">
              {errors.vehicleYear.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleColor">
            {t("vehicle.color")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="vehicleColor"
            placeholder="Black, White, etc."
            {...register("vehicleColor", {
              required: "Vehicle color is required",
            })}
            className={errors.vehicleColor ? "border-red-500" : ""}
          />
          {errors.vehicleColor && (
            <p className="text-sm text-red-500">
              {errors.vehicleColor.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vehicleStatus">
          {t("vehicle.status")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="vehicleStatus"
          placeholder="Owned, Rented, etc."
          {...register("vehicleStatus", {
            required: "Vehicle status is required",
          })}
          className={errors.vehicleStatus ? "border-red-500" : ""}
        />
        {errors.vehicleStatus && (
          <p className="text-sm text-red-500">
            {errors.vehicleStatus.message as string}
          </p>
        )}
      </div>
    </div>
  );
};

export default VehicleInformationForm;
