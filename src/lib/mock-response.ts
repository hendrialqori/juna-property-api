import { Response } from 'express'
import type { Error, Success } from '../@types';
import { StatusCodes } from 'http-status-codes';

export const StatusCode = StatusCodes

export function mockSuccessResponse<T extends {}>(res: Response, body: Success<T>) {
    return res.status(body.status).send(body)
}

export function mockErrorResponse(res: Response, error: Error) {
    res.status(error.status).send(error)
}