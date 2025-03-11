import { Inject, Service } from 'typedi';
import AuthService from "../services/AuthService";
import { Request, Response } from "express";
import { Logger } from '../../lib/logger';

@Service()
export default class AuthController {
    constructor(
       @Inject(()=> Logger) private readonly logger: Logger,
        private readonly authService: AuthService,
    ){}
    /**
     * register
     */
    public async register(req: Request, res: Response) {
    try {
            const newUser = await this.authService.registerUser(req.body);
            if (newUser.isExists) {
                this.logger.info(newUser?.message)
                return res.status(400).json({ message: newUser?.message })
            }

            this.logger.info(newUser?.message)
            return res.status(201).json({data: newUser})
        } catch (error: any) {
            this.logger.error(error.message)
            throw new Error("Something went wrong");
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const authUser = await this.authService.loginUser(req.body);
            if (!authUser?.isSuccess) {
                this.logger.info(authUser?.message,{email: req.body.email})
                return res.status(400).json({ message: authUser?.message })
            }
            return res.status(200).json({ data: authUser })
        } catch (error: any) {
            this.logger.error(error.message)
            throw new Error("Something went wrong");
        }
    }

    public async verifyEmail(req: Request, res: Response) {
        try {
            const user = await this.authService.validateEmail(req.body);
            let message = null;
            if (user) {
                message = "User email verification was successful";
                this.logger.info(message)
                return res.status(200).json({ message })
            }
            message = "User email verification failed";
            return res.status(400).json({ message })
        } catch (error: any) {
            this.logger.error(error.message)
            throw new Error("Something went wrong");
        }
    }
}