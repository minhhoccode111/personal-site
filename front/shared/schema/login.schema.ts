import { z } from "zod";

const LoginFormSchema = z.object({
  // NOTE: data design like this to send to backend: { user: { email: string, password: string}, ...}
  user: z.object({
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
  }),
});

export default LoginFormSchema;
