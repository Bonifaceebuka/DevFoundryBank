import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express";
import { env } from "../../env"
import { Service } from "typedi";
import { Logger } from "../../lib/logger";

@Service()
export default class AppMiddleware{
    constructor(
        private readonly logger: Logger
    ){

    }
    public async userAuthMiddleware(req: Request, res: Response, next: NextFunction) {
        const { headers } = req
        let message = "Unauthorized access!";
        if (headers.authorization && headers.authorization.startsWith('Bearer')) {
            const bearerToken = headers.authorization.split(' ')[1];

            jwt.verify(bearerToken, env.jwtConfig.secret,
                function(error, decoded){
                    const logger = new Logger();
                    if (error) {
                        logger.info(message)
                        return res.status(402).json({ message })
                    }

                    if (!decoded || !decoded.jwtData) {
                        let message = "Invalid request token!"
                        logger.info(message)
                        return res.status(402).json({ message })
                    }

                    req.authEmail = decoded.jwtData.email;
                    req.authId = decoded.jwtData.user_id;
                    logger.debug("User is authenticated!", { user: decoded.jwtData.email })
                    next();
                }
            )
        }
        else{
            this.logger.info(message)
            return res.status(402).json({ message })
        }
    }

}