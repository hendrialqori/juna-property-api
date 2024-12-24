import { NextFunction, Request, Response } from "express";
import PropertyService from "../services/property-service";
import { StatusCode, mockSuccessResponse } from "../lib/mock-response";

export default class PropertyController {
    static async list(req: Request, res: Response, next: NextFunction) {
        try {
            const results = await PropertyService.list(req, res)
            return mockSuccessResponse(res, {
                status: StatusCode.OK,
                data: results,
                message: "Success"
            })

        } catch (error) {
            next(error)
        }
    }

    static async add(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await PropertyService.add(req, res)
            return mockSuccessResponse(res, {
                status: StatusCode.OK,
                data: result,
                message: "Success"
            })

        } catch (error) {
            next(error)
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            await PropertyService.remove(req, res)
            return mockSuccessResponse(res, {
                status: StatusCode.OK,
                data: null,
                message: "Success"
            })
        } catch (error) {
            next(error)
        }
    }
}