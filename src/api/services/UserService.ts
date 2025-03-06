import { Service } from "typedi";

// import { Logger } from "../../lib/logger";
import UpdateUserRequest from "../models/payload/requests/UpdateUserRequest";
import User from "../models/postgres/User";
import { UserRepository } from "../repositories/UserRepository";

import UtilityService from "./UtilityService";


@Service()
export default class UserService {
    constructor(
        // private log: Logger
    ){}
    
    public async getUserInformation(id: string): Promise<User> {
        const existingUser = await UserRepository.findById(id);
        const user = UtilityService.sanitizeUserObject(existingUser);
        return user;
    }

    public async setPin(id: string, pin: string): Promise<{ isSuccess: boolean, message?: string }> {
        // Password verification
        const user = await UserRepository.findById(id);

        if (user?.pin){
            return { isSuccess: false, message: "You already have a transaction PIN on your account!" };
        }
        else{
            await UserRepository.updateUserPin(user, { pin });
            return { isSuccess: true, message: "Transaction PIN created!" };
        }

    }

    public async update(id:string, req: UpdateUserRequest): Promise<{isSuccess: boolean, message?: string, user?: User}> {
       
        const existingUser = await UserRepository.findById(id);
        if(!existingUser) {
            return { isSuccess: false, message: "User doesn't exist!" };
        }

        const updatedUser = await UserRepository.updateById(id, { ...req });
        const user = UtilityService.sanitizeUserObject(updatedUser);
    
        return { isSuccess: true, user };
    }



}