import UserService from "../services/UserService";
import { Service } from 'typedi';
import { Request, Response } from "express";

@Service()
export default class UserController {
      constructor(
            private readonly userService: UserService
        ){}

    public async fetchProfile(req: Request, res: Response) {
        try {
            const authUserId = req.authId
            const newUser = await this.userService.getUserInformation(authUserId);
            if (!newUser) {
                return res.status(404).json({ message: "User account was not found!" })
            }
            return res.status(200).json({data: newUser})
        } catch (error) {
            throw new Error("Something went wrong");
        }
    }

    public async createNewPin(req: Request, res: Response) {
        try {
            const pin = req.body.pin;
            const user_id = req.authId;
            const createPin = await this.userService.setPin(user_id, pin);
            if (createPin.isSuccess) {
                return res.status(200).json({ message: createPin.message })
            }
            return res.status(400).json({ message: createPin.message })
        } catch (error) {
            throw new Error("Something went wrong");
        }
    }

    public async updateProfile(req: Request, res: Response) {
        try {
            const updatedUser = await this.userService.update(req.authId, req.body);
            if (!updatedUser?.isSuccess) {
                return res.status(400).json({ message: updatedUser?.message })
            }
            return res.status(200).json({ data: updatedUser })
        } catch (error) {
            throw new Error("Something went wrong");
        }
    }
}