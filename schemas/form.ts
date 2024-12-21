import * as z from "zod"

export const formSchema = z.object({
    name: z.string().min(4, 'Name is required'),
    description: z.string().min(5),
    prompt: z.string().min(0).max(1000),
})

export type formSchemeType = z.infer<typeof formSchema>
