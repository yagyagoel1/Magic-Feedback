import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "content must be of at least 10 character")
    .max(300, "content must be no longer than 300 characters"),
});
