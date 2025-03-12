import { Inject, Service } from 'typedi';
import AuthService from "../services/AuthService";
import { Request, Response } from "express";
import { Logger } from '../../lib/logger';

@Service()
export default class AuthController {
    private readonly logger: Logger;
    constructor(
       @Inject(()=> Logger) logger: Logger,
        private readonly authService: AuthService,
    ){
        this.logger = new Logger(AuthController.name);
    }
    /**
     * register
     */
    public async register(req: Request, res: Response) {
    try {
            const newUser = await this.authService.registerUser(req.body);
            if (newUser.isExists) {
                this.logger.info({
                    activity_type: "User registration",
                    message: newUser?.message,
                    metadata: {
                        user: {
                            email: newUser.user.email
                        }
                    }
                });
                return res.status(400).json({ message: newUser?.message })
            }

            this.logger.info({
                activity_type: "User registration",
                message: newUser?.message,
                metadata: {
                    user: {
                        email: newUser.user.email
                    }
                }
            });
            return res.status(201).json({data: newUser})
        } catch (error: any) {
            this.logger.error({
                activity_type: "User registration",
                message: error.message,
                metadata: {
                    user: {
                        email: req.body?.email
                    }
                }
            });
            throw new Error("Something went wrong");
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const authUser = await this.authService.loginUser(req.body);
            this.logger.info({
                activity_type: "User login",
                message: authUser?.message,
                metadata: {
                    user: {
                        email: authUser.user.email
                    }
                }
            });
            if (!authUser?.isSuccess) {
                return res.status(400).json({ message: authUser?.message })
            }
            return res.status(200).json({ data: authUser })
        } catch (error: any) {
            this.logger.error({
                activity_type: "User registration",
                message: error.message,
                metadata: {
                    user: {
                        email: req.body?.email
                    }
                }
            });
            throw new Error("Something went wrong");
        }
    }

    public async verifyEmail(req: Request, res: Response) {
        try {
            const user = await this.authService.validateEmail(req.body);
            let message = null;
            if (user) {
                message = "User email verification was successful";
                this.logger.info({
                    activity_type: "User login",
                    message,
                    metadata: {
                        user: {
                            email: req.email
                        }
                    }
                });
                return res.status(200).json({ message })
            }
            message = "User email verification failed";
            return res.status(400).json({ message })
        } catch (error: any) {
            this.logger.error({
                activity_type: "User registration",
                message: error.message,
                metadata: {
                    user: {
                        email: req.body?.email
                    }
                }
            });
            throw new Error("Something went wrong");
        }
    }
}