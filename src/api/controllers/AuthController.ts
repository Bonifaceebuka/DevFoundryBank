import { Service } from 'typedi';
import AuthService from "../services/AuthService";
import { Request, Response } from "express";

@Service()
export default class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}
    /**
     * register
     */
    public async register(req: Request, res: Response) {
    try {
            const newUser = await this.authService.registerUser(req.body);
            if (newUser.isExists) {
                return res.status(400).json({ message: "User email is already registered" })
            }
            return res.status(201).json({data: newUser})
        } catch (error) {
            throw new Error("Something went wrong");
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const authUser = await this.authService.loginUser(req.body);
            if (!authUser?.isSuccess) {
                return res.status(400).json({ message: authUser?.message })
            }
            return res.status(200).json({ data: authUser })
        } catch (error) {
            throw new Error("Something went wrong");
        }
    }

    public async verifyEmail(req: Request, res: Response) {
        try {
            const user = await this.authService.validateEmail(req.body);
            if (user) {
                return res.status(200).json({ message: "User email verification was successful" })
            }
            return res.status(400).json({ message: "User email verification failed" })
        } catch (error) {
            throw new Error("Something went wrong");
        }
    }
}