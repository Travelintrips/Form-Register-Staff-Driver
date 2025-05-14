import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface VehicleInformationFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const VehicleInformationForm: React.FC<VehicleInformationFormProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleName">
            Vehicle Name <span className="text-red-500">*</span>
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
<<<<<<< HEAD
            <p className="text-sm text-red-500">
              {errors.vehicleName.message as string}
            </p>
=======
            <p className="text-sm text-red-500">{errors.vehicleName.message}</p>
>>>>>>> a73acc1 (Reconnect to GitHub from VS Code)
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleType">
            Vehicle Type <span className="text-red-500">*</span>
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
<<<<<<< HEAD
            <p className="text-sm text-red-500">
              {errors.vehicleType.message as string}
            </p>
=======
            <p className="text-sm text-red-500">{errors.vehicleType.message}</p>
>>>>>>> a73acc1 (Reconnect to GitHub from VS Code)
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleBrand">
            Vehicle Brand <span className="text-red-500">*</span>
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
<<<<<<< HEAD
              {errors.vehicleBrand.message as string}
=======
              {errors.vehicleBrand.message}
>>>>>>> a73acc1 (Reconnect to GitHub from VS Code)
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="licensePlate">
            License Plate <span className="text-red-500">*</span>
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
<<<<<<< HEAD
              {errors.licensePlate.message as string}
=======
              {errors.licensePlate.message}
>>>>>>> a73acc1 (Reconnect to GitHub from VS Code)
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleYear">
            Vehicle Year <span className="text-red-500">*</span>
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
<<<<<<< HEAD
            <p className="text-sm text-red-500">
              {errors.vehicleYear.message as string}
            </p>
=======
            <p className="text-sm text-red-500">{errors.vehicleYear.message}</p>
>>>>>>> a73acc1 (Reconnect to GitHub from VS Code)
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleColor">
            Vehicle Color <span className="text-red-500">*</span>
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
<<<<<<< HEAD
              {errors.vehicleColor.message as string}
=======
              {errors.vehicleColor.message}
>>>>>>> a73acc1 (Reconnect to GitHub from VS Code)
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vehicleStatus">
          Vehicle Status <span className="text-red-500">*</span>
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
<<<<<<< HEAD
          <p className="text-sm text-red-500">
            {errors.vehicleStatus.message as string}
          </p>
=======
          <p className="text-sm text-red-500">{errors.vehicleStatus.message}</p>
>>>>>>> a73acc1 (Reconnect to GitHub from VS Code)
        )}
      </div>
    </div>
  );
};

export default VehicleInformationForm;
