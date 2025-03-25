import { Response, NextFunction } from "express";
import { CONFIGS } from "../common/config.js";
import { verifySignature } from "../helpers/security.js";

export const gatewayMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const validApiKey = CONFIGS.API_GATEWAY_PUBLIC_KEY as string

    if (!req.headers["x-api-gateway-key"] || req.headers["x-api-gateway-key"].trim().length === 0) {
        throw new Error("Unauthorized access!");
    }

    if (!req.headers["x-api-gateway-timestamp"] || req.headers["x-api-gateway-timestamp"].trim().length === 0) {
        throw new Error("Unauthorized access!");
    }

    if (!req.headers["x-api-gateway-signature"] || req.headers["x-api-gateway-signature"].trim().length === 0) {
        throw new Error("Unauthorized access!");
    }
    const timestamp = req.headers["x-api-gateway-timestamp"]
    const signature = req.headers["x-api-gateway-signature"]
    const receivedKey = req.headers["x-api-gateway-key"]
    await verifySignature(receivedKey, timestamp, signature)
    
    if (validApiKey !== receivedKey) {
        console.log(`Invalid API KEY: Sent: ${receivedKey}`)
        throw new Error("Unauthorized access!");
    }

    next()
}