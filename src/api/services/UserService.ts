import { Service } from "typedi";

// import { Logger } from "../../lib/logger";
import UpdateUserRequest from "../models/payload/requests/UpdateUserRequest";
import User from "../models/postgres/User";
import { UserRepository } from "../repositories/UserRepository";

import UtilityService from "./UtilityService";
import { CreatePinResponseDTO } from "../dtos/UserPinDTO";
import { UpdateProfileResponseDTO } from "../dtos/UserDTO";


@Service()
export default class UserService {
    constructor(
        // private log: Logger
    ){}
    
    public async getUserInformation(id: string): Promise<User|null> {
        const existingUser = await UserRepository.findById(id);
        if (!existingUser) return null;
        const user = UtilityService.sanitizeUserObject(existingUser);
        return user;
    }

    public async setPin(id: string, pin: string): Promise<CreatePinResponseDTO> {
        // Password verification
        const user = await UserRepository.findById(id);
        if (!user){
            return { isSuccess: false, message: "You account was not found!" };
        }
        if (user?.pin){
            return { isSuccess: false, message: "You already have a transaction PIN on your account!" };
        }
        else{
            await UserRepository.updateUserPin(user, { pin });
            return { isSuccess: true, message: "Transaction PIN created!" };
        }

    }

    public async update(id:string, req: UpdateUserRequest): Promise<UpdateProfileResponseDTO> {
       
        const existingUser = await UserRepository.findById(id);
        if(!existingUser) {
            return { isSuccess: false, message: "User doesn't exist!" };
        }

        const updatedUser = await UserRepository.updateById(id, { ...req });
        if (!updatedUser) {
            return { isSuccess: false, message: "User doesn't exist!" };
        }
        const user = UtilityService.sanitizeUserObject(updatedUser);
    
        return { isSuccess: true, user };
    }



}