import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express";
import { env } from "../../env"
import { Service } from "typedi";

@Service()
export default class AppMiddleware{
    public async userAuthMiddleware(req: Request, res: Response, next: NextFunction) {
        const { headers } = req
        if (headers.authorization && headers.authorization.startsWith('Bearer')) {
            const bearerToken = headers.authorization.split(' ')[1];

            jwt.verify(bearerToken, env.jwtConfig.secret,
                function(error, decoded){
                    if (error) {
                        return res.status(402).json({ message: "Unauthorized access!" })
                    }

                    if (!decoded || !decoded.jwtData) {
                        return res.status(402).json({ message: "Invalid request token!" })
                    }

                    req.authEmail = decoded.jwtData.email;
                    req.authId = decoded.jwtData.user_id;
                    next();
                }
            )
        }
        else{
            return res.status(402).json({ message: "Unauthorized access!" })
        }
    }

}