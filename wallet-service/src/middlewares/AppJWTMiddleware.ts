import jwt from "jsonwebtoken";
import { CONFIGS } from "../common/configs";
export function expressAuthentication(req: any, securityName: string, scopes?: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
        if (!req.headers.authorization) {
            return reject(new Error("Unauthorized access!"));
        }

        const token = req.headers.authorization.split(" ")[1];

        jwt.verify(token, CONFIGS.JWT_TOKEN.JWT_SECRET, (error:any, decoded: any) => {
            if (error || !decoded || !decoded.jwtData) {
                return reject(new Error("Invalid token!"));
            }

            // Attach user data to request
            req.authEmail = decoded.jwtData.email;
            req.authId = decoded.jwtData.user_id;

            resolve(decoded.jwtData);
        });
    });
}
