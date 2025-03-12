import UserService from "../services/UserService";
import { Inject, Service } from 'typedi';
import { Request, Response } from "express";
import { Logger } from "../../lib/logger";

@Service()
export default class UserController {
    private readonly logger: Logger
      constructor(
            private readonly userService: UserService,
            @Inject(()=> Logger) logger: Logger,
        ){
          this.logger = new Logger(UserController.name);
        }

    public async fetchProfile(req: Request, res: Response) {
        try {
            const authUserId = req.authId
            const newUser = await this.userService.getUserInformation(authUserId);
            let message = "User account was not found!";
            this.logger.info({
                    activity_type: "Fetch user profile",
                    message,
                    metadata: {
                        user: {
                            email: newUser.email
                        }
                    }
                });
            if (!newUser) {
                return res.status(404).json({ message })
            }
            message = "User account info was fetched!";
            this.logger.info({
                    activity_type: "Fetch user profile",
                    message,
                    metadata: {
                        user: {
                            email: newUser.email
                        }
                    }
                });
            return res.status(200).json({data: newUser})
        } catch (error: any) {
            this.logger.error({
                activity_type: "Fetch user profile",
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

    public async createNewPin(req: Request, res: Response) {
        try {
            const pin = req.body.pin;
            const user_id = req.authId;
            const createPin = await this.userService.setPin(user_id, pin);
            let message = createPin.message;
            if (createPin.isSuccess) {
                this.logger.info({
                    activity_type: "Fetch user profile",
                    message: createPin.message,
                    metadata: {}
                });
                return res.status(200).json({ message})
            }
            this.logger.info({
                    activity_type: "Fetch user profile",
                    message: createPin.message,
                    metadata: {
                        user: {}
                    }
                });
            return res.status(400).json({ message})
        } catch (error: any) {
            this.logger.error({
                activity_type: "User registration",
                message: error.message,
                metadata: {}
            });
            throw new Error("Something went wrong");
        }
    }

    public async updateProfile(req: Request, res: Response) {
        try {
            const updatedUser = await this.userService.update(req.authId, req.body);
            if (!updatedUser?.isSuccess) {
                this.logger.info({
                    activity_type: "Update user profile",
                    message: updatedUser.message,
                    metadata: {
                        user: {
                            email: updatedUser.user.email
                        }
                    }
                });
                return res.status(400).json({ message: updatedUser?.message })
            }
            this.logger.info({
                    activity_type: "Update user profile",
                    message: updatedUser.message,
                    metadata: {
                        user: {
                            email: updatedUser.user.email
                        }
                    }
                });
            return res.status(200).json({ data: updatedUser })
        } catch (error: any) {
            this.logger.error({
                activity_type: "Update User profile",
                message: error.message,
                metadata: {}
            });
            throw new Error("Something went wrong");
        }
    }
}