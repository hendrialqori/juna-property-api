import { Request, Response, NextFunction } from "express";
import { StatusCode, mockSuccessResponse } from "../lib/mock-response";
import UserService from "../services/user-service";

export default class UserController {

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await UserService.login(req, res)
            return mockSuccessResponse(res, {
                status: StatusCode.OK,
                data: result,
                message: "Success"
            })

        } catch (error) {
            next(error)
        }
    }

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await UserService.register(req, res)
            return mockSuccessResponse(res, {
                status: StatusCode.OK,
                data: result,
                message: "Success"
            })
        } catch (error) {
            next(error)
        }
    }

}