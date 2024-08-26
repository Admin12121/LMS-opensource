import { z } from "zod"


export const courseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  image: z.string().url(),
  courseslug: z.string(),
  price: z.number(),
  isPublished: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  user: z.number(),
  category: z.number(),
})

export type Course = z.infer<typeof courseSchema>