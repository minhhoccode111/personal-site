// NOTE: split to multiple files when things bloat

import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email("Email must be a valid email address.")
    .min(8, "Email must be at least 8 characters long."),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, "Password must be at least 8 characters long.")
    .max(32, "Password must be at max 32 characters long.")
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/,
      {
        message:
          "Password must contain at least: 1 uppercase, 1 lowercase, 1 digit, 1 special character.",
      },
    ),
});

export const SignupFormSchema = LoginFormSchema.extend({
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
