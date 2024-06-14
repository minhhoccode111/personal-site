import { FieldValues, UseFormSetError } from "react-hook-form";

function setFormFieldError<TFieldValues extends FieldValues>(
  cb: UseFormSetError<TFieldValues>,
  apiErrors: any,
) {
  Object.keys(apiErrors).forEach((key) => {
    cb(key as any, {
      type: "manual",
      message: apiErrors[key],
    });
  });
}

export default setFormFieldError;
