import { z } from "zod";
import LoginFormSchema from "./login.schema";

const SignupFormSchema = LoginFormSchema.extend({
  username: z
    .string({ required_error: "Username is required." })
    .min(1, "Username is required.")
    .max(50, "Username must be at max 50 characters long."),
  confirmPassword: z.string({
    required_error: "Confirm password is required.",
  }),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password does not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.username.trim().length > 0, {
    message: "Username is required",
    path: ["username"],
  });

export default SignupFormSchema;
