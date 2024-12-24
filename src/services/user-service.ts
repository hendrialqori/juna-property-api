import { Request, Response } from "express";
import bycript from "bcrypt"
import jwt from "jsonwebtoken"
import { MySqlColumn } from "drizzle-orm/mysql-core";
import { eq } from "drizzle-orm";

import { db } from "../model/db";
import { users as usersTable } from "../model/schema";
import { Validation } from "../validation/validation";
import { UserValidation } from "../validation/user-validation";
import { ApiError } from "../lib/error";
import { InsertUser } from "../@types";
import { SECRET_KEY } from "../constant";
import { StatusCode } from "../lib/mock-response"
import { uuid } from "../lib/utils";

import utc from "dayjs/plugin/utc"
import dayjs from "dayjs"
dayjs.extend(utc)

export default class UserService {

    static async login(req: Request, res: Response) {
        const body = req.body as InsertUser
        const loginRequest = Validation.validate(UserValidation.LOGIN, body)

        const user = await UserService.checkUser(usersTable.username, loginRequest.username)
        if (!user) {
            throw new ApiError(404, `User ${loginRequest.username} doesn't exists`)
        }

        // password match checker
        const isPasswordValid = await bycript.compare(loginRequest.password, user.password)
        if (!isPasswordValid) {
            throw new ApiError(400, "Wrong password!")
        }

        // generate jwt token
        const payload = {
            id: user.id,
            username: user.username,
            created_at: user.created_at
        }

        const expiresIn = 60 * 60 * 24 * 30 // 30 days

        const token = jwt.sign(payload, SECRET_KEY, {
            expiresIn
        })

        return { ...payload, token }
    }

    static async register(req: Request, res: Response) {

        const body = req.body as InsertUser
        const registerRequest = Validation.validate(UserValidation.LOGIN, body)

        const checkUsername = await UserService.checkUser(usersTable.username, registerRequest.username)
        if (checkUsername) throw new ApiError(StatusCode.NOT_FOUND, `User ${body.username} already exists!`)

        // Number of salt rounds (the higher, the more secure but slower the hash generation) 
        const saltRounds = await bycript.genSalt(10)
        // hashing password
        const hashingPassword = await bycript.hash(registerRequest.password, saltRounds)
        // store data for new user
        const payload = {
            id: uuid(),
            username: registerRequest.username,
            password: hashingPassword,
            created_at: dayjs().utc().toDate()
        }

        await db
            .insert(usersTable)
            .values(payload)
            .$returningId()

        return payload
    }

    private static async checkUser<T extends {}>(column: MySqlColumn, value: T) {
        const [result] = await db.select().from(usersTable).where(eq(column, value))
        return result
    }
}