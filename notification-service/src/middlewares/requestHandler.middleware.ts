import { Request, Response, NextFunction } from "express";
import { userServiceRequestDoc } from "../models/user_service.collection.js";
import { userServiceResponseDoc } from "../models/user_service.collection.js";

export const logRequest = async(req: any, res: Response, next: NextFunction) => {
    const newRequest = {
        user_id: req?.authId && req?.authId.length > 0 ? req?.authId :null ,
        user_email: req?.authEmail && req?.authEmail.length > 0 ? req?.authEmail : null,
        url: req.originalUrl,
        method: req.method,
        body: JSON.stringify(req.body),
    }

    await userServiceRequestDoc.create(newRequest)

    const newResponse = {
        user_id: req?.authId && req?.authId.length > 0 ? req?.authId : null,
        user_email: req?.authEmail && req?.authEmail.length > 0 ? req?.authEmail : null,
        url: req.originalUrl,
        method: req.method,
        status_code: res.statusCode,
        data: null,
    }

    await logResponse(newResponse)
    next()
}


export const logResponse = async (newResponse: Object) => {
    await userServiceResponseDoc.create(newResponse)
}