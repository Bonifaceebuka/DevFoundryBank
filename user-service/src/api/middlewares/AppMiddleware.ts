import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { env } from "../../env";
export function expressAuthentication(req: any, securityName: string, scopes?: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
        if (!req.headers["x-auth_user_email"] || !req.headers["x-auth_user_id"]) {
            return reject(new Error("Unauthorized access!"));
        }
        // const token = req.headers.authorization.split(" ")[1];

        // jwt.verify(token, env.jwtConfig.secret, (error:any, decoded: any) => {
        //     if (error || !decoded || !decoded.jwtData) {
        //         return reject(new Error("Invalid token!"));
        //     }

        //     // Attach user data to request
            req.authEmail = req.headers["x-auth_user_email"];
            req.authId = req.headers["x-auth_user_id"];

            resolve(req);
        // });
    });
}
