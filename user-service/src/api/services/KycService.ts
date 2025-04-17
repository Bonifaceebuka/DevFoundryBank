import { Service } from "typedi";

// import { Logger } from "../../lib/logger";
import UpdateUserRequest from "../models/payload/requests/UpdateUserRequest";
import User, { IUser } from "../models/postgres/User";
import { UserRepository } from "../repositories/UserRepository";

import UtilityService from "./UtilityService";
import { CreatePinResponseDTO } from "../dtos/UserPinDTO";
import { UpdateProfileResponseDTO } from "../dtos/UserDTO";
import { AppError } from "../errors/AppError";
import { dynamic_messages, MESSAGES } from "../constants/messages";
import { Logger } from "../../lib/logger";
import { ACTIVITY_TYPES } from "../constants/activity_types";
import axios from "axios";
import { env } from "../../env";
import { KycData } from "../dtos/kycDTO";
import { UserKycRepository } from "../repositories/UserKycRepository";
import UserKYCInfomation, { KYCStatus, KYCTiers } from "../models/postgres/UserKYCInfomation";
import { DocumentType } from "../enums/DocumentType";


@Service()
export default class KycService {
    private readonly logger: Logger
    constructor(
    ){
        this.logger = new Logger(KycService.name);
    }
    
    public async performTier1KYC(kycData: KycData): Promise<User|null> {
        const { id, bvn, dob, tier } = kycData;
        const existingUser = await UserRepository.findById(id);        
        const existingTier = await UserKycRepository.findByIdAndTier(id, tier);        
       
        if (!existingUser) return null;
        if(existingTier){
            const message = dynamic_messages.KYC_EXISTS(existingTier.status, existingTier.tier);
            throw new AppError(message)
        }
        if (existingUser?.first_name && existingUser?.last_name) {
            const date_of_birth = new Date(dob);
            const newKyc={
                user_id: id,
                first_name: existingUser.first_name,
                last_name: existingUser.last_name,
                date_of_birth,
                date_of_birth_submitted: date_of_birth,
                document_id: bvn,
                document_type: DocumentType.BVN,
                tier,
                status: KYCStatus.ACTIVE

            }
            await UserKycRepository.create(newKyc)
        }
        else{
            throw new AppError("Please complete your personal profile submissions")
        }
        // await this.bvnVerification(bvn, dob)
        // const user = UtilityService.sanitizeUserObject(existingUser);
        return existingUser;
    }

    public async getUserKyc(user_id: string): Promise<UserKYCInfomation|null> {

        const existingUser = await UserRepository.findById(user_id);        
        if (!existingUser) return null;

        const foundUserKyc = await UserKycRepository.findByIdUserId(user_id);        
        if(foundUserKyc){
            return foundUserKyc;
        }
        throw new AppError(MESSAGES.USER.KYC.NOT_FOUND, 404)
    }

    public async bvnVerification(bvn: string, dob: string){
      try {
        const okraResponse =  await axios.post(`${env.OKRA.BASE_URL}/products/identity/search`,
            {bvn},
            {
                headers: {
                    Authorization: `Bearer ${env.OKRA.KEY}`,
                }
            }
           );
    
         if(okraResponse.data.success == true){
            return okraResponse.data;
         }
      } catch (error: any) {
        console.log(error.response.data)
        throw new AppError(error.response.data.message)
      }
    }

    public async setPin(id: string, pin: string)
    // : Promise<CreatePinResponseDTO> 
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
            // return { isSuccess: true, message: "Transaction PIN created!" };
        }

    }

    public async update(id:string, req: UpdateUserRequest)
    // : Promise<UpdateProfileResponseDTO> 
    {
       
        const existingUser = await UserRepository.findById(id);
        if(!existingUser) {
            throw new AppError(MESSAGES.USER.NOT_FOUND, 404); 
        }

        // const updatedUser = await UserRepository.updateById(id, { ...req });
        // if (!updatedUser) {
        //     throw new AppError(MESSAGES.USER.NOT_FOUND, 404); 
        // }
        // const user = UtilityService.sanitizeUserObject(updatedUser);
    
        // return { isSuccess: true, user: updatedUser };
    }

    public async createNewUser(userData: IUser): Promise<void> {
      try {
            const user = {
                id: userData._id.toString()
           }
        //    await UserRepository.add(user);
        //    this.logger.info({
        //         activity_type: ACTIVITY_TYPES.USER_REGISTRATION,
        //         message: MESSAGES.USER.REGISTRATION.SUCCESSFUL,
        //         metadata: {user}
        //     });
      } catch (error: any) {
        this.logger.error({
            activity_type: ACTIVITY_TYPES.USER_REGISTRATION,
            message: error.message,
            metadata: {}
        });
      }
    }


}