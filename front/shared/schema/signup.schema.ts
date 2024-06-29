import { z } from "zod";

const SignupFormSchema = z.object({
  user: z
    .object({
      // repeat myself because i don't know how to extend nest user object inside
      email: z
        .string()
        .email("Email is required")
        .min(8, "Email min length is 8")
        .max(100, "Email max length is 100"),

      password: z
        .string()
        .min(8, "Password min length is 8")
        .max(32, "Password max length is 32")
        .regex(/(?=.*\d)/, "Password need 1 digit")
        .regex(/(?=.*[A-Z])/, "Password need 1 uppercase")
        .regex(/(?=.*[a-z])/, "Password need 1 lowercase")
        .regex(/(?=.*[@$!%*#?&])/, "Password need 1 special character"),

      username: z
        .string()
        .max(100, "Username max length is 100")
        // refine inside, no other field involve
        .refine((username) => username.trim().length > 0, {
          message: "Username is required",
        }),

      confirmPassword: z.string({
        required_error: "Confirm password is required",
      }),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: "Confirm password does not match",
      path: ["confirmPassword"],
    }),
});

export default SignupFormSchema;
