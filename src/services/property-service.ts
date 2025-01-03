import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { properties as propertiesTable } from "../model/schema";
import { db } from "../model/db";
import { InsertProperty } from "../@types";
import { Validation } from "../validation/validation";
import { PropertyValidation } from "../validation/property-validation";
import { cloudinaryUpload, cloudinaryDestroy, getPublicId } from "../lib/cloudinary"
import { uuid } from "../lib/utils";

import utc from "dayjs/plugin/utc"
import dayjs from "dayjs"
import { ApiError } from "../lib/error";
import { StatusCode } from "../lib/mock-response";
dayjs.extend(utc)

export default class PropertyService {

    static async list(req: Request, res: Response) {
        const result = await db.select().from(propertiesTable)
        return result
    }

    static async get(req: Request, res: Response) {
        const params = req.params as unknown as { id: string }

        const [result] = await db.select().from(propertiesTable).where(eq(propertiesTable.id, params.id))
        if (!result) throw new ApiError(StatusCode.NOT_FOUND, `Property with id ${params.id} not found`)

        return result
    }

    static async add(req: Request, res: Response) {
        const body = req.body as InsertProperty

        body.type = Number(body.type)
        body.price = Number(body.price)

        const thumbnail = req.files['thumbnail']?.[0] as Express.Multer.File
        const view = req.files['view']?.[0] as Express.Multer.File

        const { type, price, address, description } = Validation.validate(PropertyValidation.ADD, body)

        const thumbnailUpload = await cloudinaryUpload({ path: thumbnail.path, public_id: uuid() })
        const viewUpload = await cloudinaryUpload({ path: view.path, public_id: uuid() })

        const payload = {
            id: uuid(),
            thumbnail_url: thumbnailUpload.url,
            view_url: viewUpload.url,
            type, price, address, description,
            created_at: dayjs().utc().toDate()
        }

        await db.insert(propertiesTable).values(payload)
        return payload
    }

    static async update(req: Request, res: Response) {
        const params = req.params as { id: string }
        const body = req.body as InsertProperty
        
        body.type = Number(body.type)
        body.price = Number(body.price)

        const thumbnail = req.files['thumbnail']?.[0] as Express.Multer.File
        const view = req.files['view']?.[0] as Express.Multer.File

        const prevProperty = await PropertyService.get(req, res)

        const propertRequest = Validation.validate(PropertyValidation.ADD, body)
        const payload = structuredClone(propertRequest) as InsertProperty

        if (thumbnail) {
            // delete first
            const thumbnail_public_id = getPublicId(prevProperty.thumbnail_url)
            await cloudinaryDestroy({ public_id: thumbnail_public_id })
            // new upload
            const { url } = await cloudinaryUpload({ path: thumbnail.path, public_id: uuid() })
            payload.thumbnail_url = url
        }

        if (view) {
            // delete first
            const view_public_id = getPublicId(prevProperty.view_url)
            await cloudinaryDestroy({ public_id: view_public_id })
            // new upload
            const { url } = await cloudinaryUpload({ path: view.path, public_id: uuid() })
            payload.view_url = url
        }

        await db.update(propertiesTable)
            .set(payload)
            .where(eq(propertiesTable.id, params.id))
    }

    static async remove(req: Request, res: Response) {
        const params = req.params as unknown as { id: string }

        const [property] =
            await db.select().from(propertiesTable).where(eq(propertiesTable.id, params.id))

        if (!property)
            throw new ApiError(StatusCode.NOT_FOUND, `Property with id ${params.id} not found`)

        const thumbnail_public_id = getPublicId(property.thumbnail_url)
        const view_public_id = getPublicId(property.view_url)

        await cloudinaryDestroy({ public_id: thumbnail_public_id })
        await cloudinaryDestroy({ public_id: view_public_id })

        await db.delete(propertiesTable).where(eq(propertiesTable.id, params.id))

    }

}