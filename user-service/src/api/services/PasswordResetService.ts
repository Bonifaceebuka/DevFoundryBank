import { Service } from "typedi";
import User from "../models/postgres/User";
import { UserRepository } from "../repositories/UserRepository";
import { PasswordResetRepository } from "../repositories/PasswordResetRepository";
import UtilityService from "../services/UtilityService";
import { PasswordResetRequestDTO, PasswordResetResponseDTO, SetNewPasswordRequestDTO } from "../dtos/PasswordResetDTO";

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
            return { isSuccess: false, message: "You don't have an account with us yet" };
        }
        else if (!existingUser.isActive) {
            return { isSuccess: false, message: "You can only reset the password of an active account" };
        }
        else if (!existingUser.isEnabled) {
            return { isSuccess: false, message: "You can only reset the password of an enabled account" };
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
            return { isSuccess: false, message: "You don't have an account with us yet" };
        }
        else if (!existingUser.isActive) {
            return { isSuccess: false, message: "You can only reset the password of an active account" };
        }
        else if (!existingUser.isEnabled) {
            return { isSuccess: false, message: "You can only reset the password of an enabled account" };
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