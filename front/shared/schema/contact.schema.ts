import { z } from "zod";

const ContactFormSchema = z.object({
  contact: z.object({
    name: z
      .string()
      .max(100, "Fullname max length is 100")
      .refine((name) => name.trim().length > 0, {
        message: "Fullname is required",
      }),

    email: z
      .string()
      .email("Must be a valid email")
      .min(8, "Email min length is 8")
      .max(100, "Email max length is 100"),

    body: z
      .string()
      .max(3000, "Message max length is 3000")
      .refine((body) => body.trim().length > 0, {
        message: "Message is required",
      }),
  }),
});

export default ContactFormSchema;
