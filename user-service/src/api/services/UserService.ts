import { Service } from "typedi";

// import { Logger } from "../../lib/logger";
import UpdateUserRequest from "../models/payload/requests/UpdateUserRequest";
import User, { IUser } from "../models/postgres/User";
import { UserRepository } from "../repositories/UserRepository";

import UtilityService from "./UtilityService";
import { CreatePinResponseDTO } from "../dtos/UserPinDTO";
import { UpdateProfileResponseDTO } from "../dtos/UserDTO";
import { AppError } from "../errors/AppError";
import { MESSAGES } from "../constants/messages";
import { Logger } from "../../lib/logger";
import { ACTIVITY_TYPES } from "../constants/activity_types";


@Service()
export default class UserService {
    private readonly logger: Logger
    constructor(
    ){
        this.logger = new Logger(UserService.name);
    }
    
    public async getUserInformation(id: string): Promise<User|null> {
        const existingUser = await UserRepository.findById(id);
        if (!existingUser) return null;
        // const user = UtilityService.sanitizeUserObject(existingUser);
        return existingUser;
    }

    public async setPin(id: string, pin: string): Promise<CreatePinResponseDTO> 
    {
        // Password verification
        const user = await UserRepository.findById(id);
        if (!user){
            throw new AppError(MESSAGES.USER.NOT_FOUND, 404);
        }
        if (user?.pin){
            throw new AppError(MESSAGES.PIN.ALREADY_EXISTS);
        }
        else{
            // await UserRepository.updateUserPin(user, { pin });
            return { isSuccess: true, message: "Transaction PIN created!" };
        }

    }

    public async update(id:string, req: UpdateUserRequest)
    : Promise<UpdateProfileResponseDTO> 
    {
       
        const existingUser = await UserRepository.findById(id);
        if(!existingUser) {
            throw new AppError(MESSAGES.USER.NOT_FOUND, 404); 
        }

        const updatedUser = await UserRepository.updateById(id, { ...req });
        if (!updatedUser) {
            throw new AppError(MESSAGES.USER.NOT_FOUND, 404); 
        }    
        return { isSuccess: true, user: updatedUser };
    }

    public async createNewUser(userData: IUser): Promise<void> {
      try {
            const user = {
                id: userData._id.toString()
           }
        //    await UserRepository.add(user);
           this.logger.info({
                activity_type: ACTIVITY_TYPES.USER_REGISTRATION,
                message: MESSAGES.USER.REGISTRATION.SUCCESSFUL,
                metadata: {user}
            });
      } catch (error: any) {
        this.logger.error({
            activity_type: ACTIVITY_TYPES.USER_REGISTRATION,
            message: error.message,
            metadata: {}
        });
      }
    }


}