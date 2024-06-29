import { z } from "zod";
import LoginFormSchema from "./login.schema";

const loginSchema = LoginFormSchema.shape.user;

const SignupFormSchema = z
  .object({
    login: loginSchema,

    username: z
      .string()
      .max(100, "Username max length is 100")
      // refine inside, no other field involve
      .refine((username) => username.trim().length > 0, {
        message: "Username is required",
      }),

    confirmPassword: z.string(),
  })

  // refine outside, need other field
  .refine((values) => values.login.password === values.confirmPassword, {
    message: "Confirm password does not match",
    path: ["confirmPassword"],
  });

export default SignupFormSchema;
