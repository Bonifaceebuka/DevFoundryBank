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

    const originalJson = res.json;
    res.json = function (data) {
        const newResponse = {
            user_id: req?.authId && req?.authId.length > 0 ? req?.authId : null,
            user_email: req?.authEmail && req?.authEmail.length > 0 ? req?.authEmail : null,
            url: req.originalUrl,
            method: req.method,
            status_code: res.statusCode,
            data: JSON.stringify(data),
        }

        logResponse(newResponse);
        return originalJson.call(this, data);
    };
    next()
}


export const logResponse = async (newResponse: Object) => {
    await userServiceResponseDoc.create(newResponse)
}