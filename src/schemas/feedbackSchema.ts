import { z } from "zod"

export const feedbackSchema = z.object({
  name: z.string().min(1, "write atleast something here"),
  email: z.string().email("Invalid email"),
  message: z.string().min(5, "Give some feedback"),
})

export type FeedbackForm = z.infer<typeof feedbackSchema>