import { z, ZodType } from "zod";

export class PropertyValidation {
    static readonly ADD: ZodType = z.object({
        type: z.number().nonnegative(),
        price: z.number().nonnegative(),
        description: z.string().min(1, { message: "Requried" })
    })

}