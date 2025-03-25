import { Response, NextFunction } from "express";
import { verifySignature } from "../helpers/security";
import { env } from "../../env";
import { AppError } from "../errors/AppError";

export const gatewayMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const validApiKey = env.api_keys.API_GATEWAY as string

    if (!req.headers["x-api-gateway-key"] || req.headers["x-api-gateway-key"].trim().length === 0) {
        throw new AppError("Unauthorized access!",403);
    }

    if (!req.headers["x-api-gateway-timestamp"] || req.headers["x-api-gateway-timestamp"].trim().length === 0) {
        throw new AppError("Unauthorized access!",403);
    }

    if (!req.headers["x-api-gateway-signature"] || req.headers["x-api-gateway-signature"].trim().length === 0) {
        throw new AppError("Unauthorized access!",403);
    }
    const timestamp = req.headers["x-api-gateway-timestamp"]
    const signature = req.headers["x-api-gateway-signature"]
    const receivedKey = req.headers["x-api-gateway-key"]
    console.log(await verifySignature(receivedKey, timestamp, signature));
    
    if (validApiKey !== receivedKey) {
        console.log(`Invalid API KEY: Sent: ${receivedKey}`)
        throw new AppError("Unauthorized access!",403);
    }

    next()
}