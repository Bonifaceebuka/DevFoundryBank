import { Service } from "typedi";
import User from "../models/postgres/User";
import { UserRepository } from "../repositories/UserRepository";
import { PasswordResetRepository } from "../repositories/PasswordResetRepository";
import UtilityService from "../services/UtilityService";
import { PasswordResetRequestDTO, PasswordResetResponseDTO, SetNewPasswordRequestDTO } from "../dtos/PasswordResetDTO";
import { AppError } from "../errors/AppError";
import { MESSAGES } from "../constants/messages";

@Service()
export default class PasswordResetService {
    constructor(
        // private log: Logger
    ){}

    public async requestPasswordReset(req: PasswordResetRequestDTO)
    : Promise<PasswordResetResponseDTO>
     {
       const { email } = req;
       const existingUser = await UserRepository.findByEmail(email);
        if(!existingUser) {
            throw new AppError(MESSAGES.USER.NOT_FOUND, 404) 
        }
        else if (!existingUser.isActive) {
            throw new AppError(MESSAGES.PASSWWORD_RESET.INACTIVE_ACCOUNT) 
        }
        else if (!existingUser.isEnabled) {
            throw new AppError(MESSAGES.PASSWWORD_RESET.DISABLED_ACCOUNT);
        }
        else{
            const passwordResetToken = UtilityService.generateUUID();
            const { expiresAt, uuid } = passwordResetToken;
            await PasswordResetRepository.setNewPasswordRequestToken(uuid, expiresAt, email);
            // Make a call to the notication microservice via a Message broker(RabbitMQ)
            return { isSuccess: true, message: `Password reset email has been sent ${email}` };
        }
    }

    public async setNewPassword(req: SetNewPasswordRequestDTO)
        : Promise<PasswordResetResponseDTO> {
        const { password_reset_token } = req;
        const existingUser = await UserRepository.findByPasswordResetToken(password_reset_token);
        if (!existingUser) {
            throw new AppError(MESSAGES.USER.NOT_FOUND, 404); 
        }
        else if (!existingUser.isActive) {
            throw new AppError(MESSAGES.PASSWWORD_RESET.INACTIVE_ACCOUNT) 
        }
        else if (!existingUser.isEnabled) {
            throw new AppError(MESSAGES.PASSWWORD_RESET.DISABLED_ACCOUNT);
        }
        else {
            // const passwordResetToken = UtilityService.generateUUID();
            // const { expiresAt, uuid } = passwordResetToken;
            // await PasswordResetRepository.setNewPasswordRequestToken(uuid, expiresAt, email);
            // Make a call to the notication microservice via a Message broker(RabbitMQ)
            return { isSuccess: true, message: `Your account password was successfully changed` };
        }
    }



}