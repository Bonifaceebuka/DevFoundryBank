import jwt from "jsonwebtoken";
import { CONFIGS } from "../common/configs";
export function expressAuthentication(req: any, securityName: string, scopes?: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
        if (!req.headers["x-auth_user_email"] || !req.headers["x-auth_user_id"]) {
            return reject(new Error("Unauthorized access!"));
        }

            req.authEmail = req.headers["x-auth_user_email"];
            req.authId = req.headers["x-auth_user_id"];

            resolve(req);
    });
}
