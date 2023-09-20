import { z } from 'zod'

export const SubpedditValidator = z.object({
  name: z.string().min(3).max(21), //ssr validation
})

export const SubpedditSubscriptionValidator = z.object({
  subpedditId: z.string()
})

export type CreateSubpedditPayload = z.infer<typeof SubpedditValidator>
export type SubcribeToSubpedditPayload = z.infer<typeof SubpedditSubscriptionValidator>