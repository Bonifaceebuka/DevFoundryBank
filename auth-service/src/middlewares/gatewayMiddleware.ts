import { Response, NextFunction } from "express";
import { CONFIGS } from "../common/configs";
import { verifySignature } from "../helpers/security";
import { AppError } from "../common/errors/AppError";

export const gatewayMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const validApiKey = CONFIGS.API_GATEWAY_PUBLIC_KEY as string

    if (!req.headers["x-api-gateway-key"] || req.headers["x-api-gateway-key"].trim().length === 0) {
        return next(new AppError("Unauthorized access!", 403));
    }

    if (!req.headers["x-api-gateway-timestamp"] || req.headers["x-api-gateway-timestamp"].trim().length === 0) {
        return next(new AppError("Unauthorized access!", 403));
    }

    if (!req.headers["x-api-gateway-signature"] || req.headers["x-api-gateway-signature"].trim().length === 0) {
        return next(new AppError("Unauthorized access!", 403));
    }
    const timestamp = req.headers["x-api-gateway-timestamp"]
    const signature = req.headers["x-api-gateway-signature"]
    const receivedKey = req.headers["x-api-gateway-key"]
    await verifySignature(receivedKey, timestamp, signature)
    
    if (validApiKey !== receivedKey) {
        console.log(`Invalid API KEY: Sent: ${receivedKey}`)
        return next(new AppError("Unauthorized access!", 403));
    }

    next()
}