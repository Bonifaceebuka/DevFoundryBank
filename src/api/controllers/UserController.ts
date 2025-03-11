import UserService from "../services/UserService";
import { Inject, Service } from 'typedi';
import { Request, Response } from "express";
import { Logger } from "../../lib/logger";

@Service()
export default class UserController {
      constructor(
            private readonly userService: UserService,
            @Inject(()=> Logger) private readonly logger: Logger,
        ){}

    public async fetchProfile(req: Request, res: Response) {
        try {
            const authUserId = req.authId
            const newUser = await this.userService.getUserInformation(authUserId);
            let message = "User account was not found!";
            this.logger.info(message)
            if (!newUser) {
                return res.status(404).json({ message })
            }
            message = "User account info was fetched!";
            this.logger.info(message)
            return res.status(200).json({data: newUser})
        } catch (error: any) {
            this.logger.error(error.message)
            throw new Error("Something went wrong");
        }
    }

    public async createNewPin(req: Request, res: Response) {
        try {
            const pin = req.body.pin;
            const user_id = req.authId;
            const createPin = await this.userService.setPin(user_id, pin);
            let message = createPin.message;
            if (createPin.isSuccess) {
                this.logger.info(message)
                return res.status(200).json({ message})
            }
            this.logger.info(message)
            return res.status(400).json({ message})
        } catch (error: any) {
            this.logger.error(error.message)
            throw new Error("Something went wrong");
        }
    }

    public async updateProfile(req: Request, res: Response) {
        try {
            const updatedUser = await this.userService.update(req.authId, req.body);
            if (!updatedUser?.isSuccess) {
                this.logger.info(updatedUser?.message)
                return res.status(400).json({ message: updatedUser?.message })
            }
            this.logger.info(updatedUser?.message)
            return res.status(200).json({ data: updatedUser })
        } catch (error: any) {
            this.logger.error(error.message)
            throw new Error("Something went wrong");
        }
    }
}