import { Response, NextFunction } from "express";
import { CONFIGS } from "../common/config.js";
import { verifySignature } from "../helpers/security.js";
import { AppError } from "../common/AppError.js";
import jwt from "jsonwebtoken";

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

    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, CONFIGS.JWT.JWT_SECRET as string, (error:any, decoded: any) => {
            if (error || !decoded || !decoded.jwtData) {
                return next(new AppError("Invalid token!"));
            }
            
            // Attach user data to request
            req.authEmail = decoded.jwtData.email;
            req.authId = decoded.jwtData.user_id; 
            
            req.headers["x-auth_user_email"] = req.authEmail
            req.headers["x-auth_user_id"] = req.authId
        });
    }

    next()
}