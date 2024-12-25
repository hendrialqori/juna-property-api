import { z, ZodType } from "zod";

export class PropertyValidation {
    static readonly ADD: ZodType = z.object({
        type: z.number().nonnegative(),
        price: z.number().nonnegative(),
        address: z.string().min(1, { message: "Requried" }),
        description: z.string().min(1, { message: "Requried" })
    })

}