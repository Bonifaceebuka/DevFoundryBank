import { Service } from "typedi";
import { UserRepository } from "../repositories/UserRepository";
// import { PasswordResetRequestDTO, PasswordResetResponseDTO, SetNewPasswordRequestDTO } from "../dtos/PasswordResetDTO";
import { Logger } from "../common/configs/logger";
import { AccountStatus } from "../models/User";
import { PasswordResetRepository } from "../repositories/PasswordResetRepository";
import { AppError } from "../common/errors/AppError";
import { MESSAGES } from "../common/constants/messages";
import { generateUUID } from "../common/helpers/utils";
import OnlyEmailDTO, { CommonResponseDTO } from "../dto/CommonDTO";
import { SetNewPasswordRequestDTO, ValidatePasswordResetTokenDTO } from "../dto/PasswordDTO";

@Service()
export default class PasswordResetService {
    private readonly logger: Logger;
    private passwordResetRepository: PasswordResetRepository;
    private userRepository: UserRepository;
    constructor(
        passwordResetRepository: PasswordResetRepository,
        userRepository: UserRepository
    ){
        this.logger = new Logger(PasswordResetService.name);
        this.passwordResetRepository = passwordResetRepository;
        this.userRepository = userRepository;
    }

    public async requestPasswordReset(req: OnlyEmailDTO)
    : Promise<CommonResponseDTO>
     {
       const { email } = req;
       const existingUser = await this.userRepository.findUserByEmail(email);
        if(!existingUser) {
            throw new AppError(MESSAGES.USER.NOT_FOUND, 404) 
        }
        else if (existingUser.status !== AccountStatus.ACTIVE) {
            throw new AppError(MESSAGES.PASSWWORD_RESET.INACTIVE_ACCOUNT) 
        }
        else{
            const passwordResetToken = generateUUID();
            const { expiresAt, uuid } = passwordResetToken;
            await this.passwordResetRepository.setNewPasswordRequestToken(uuid, expiresAt, email);
            // Make a call to the notication microservice via a Message broker(RabbitMQ)
            return { isSuccess: true, message: `Password reset email has been sent ${email}` };
        }
    }

    public async setNewPassword(req: SetNewPasswordRequestDTO)
        : Promise<CommonResponseDTO> {
        const { password_reset_token } = req;
        const existingUser = await this.userRepository.findByPasswordResetToken(password_reset_token);
        if (!existingUser) {
            throw new AppError(MESSAGES.USER.NOT_FOUND, 404); 
        }
        else if (existingUser.status !== AccountStatus.ACTIVE) {
            throw new AppError(MESSAGES.PASSWWORD_RESET.INACTIVE_ACCOUNT) 
        }
        else {
            // const passwordResetToken = UtilityService.generateUUID();
            // const { expiresAt, uuid } = passwordResetToken;
            // await this.passwordResetRepository.setNewPasswordRequestToken(uuid, expiresAt, email);
            // Make a call to the notication microservice via a Message broker(RabbitMQ)
            return { isSuccess: true, message: `Your account password was successfully changed` };
        }
    }

    public async validatePasswordResetToken(req: ValidatePasswordResetTokenDTO)
    : Promise<CommonResponseDTO> {
    const { password_reset_token } = req;
    const existingUser = await this.userRepository.findByPasswordResetToken(password_reset_token);
    if (!existingUser) {
        throw new AppError(MESSAGES.USER.NOT_FOUND, 404); 
    }
    else if (existingUser.status !== AccountStatus.ACTIVE) {
        throw new AppError(MESSAGES.PASSWWORD_RESET.INACTIVE_ACCOUNT) 
    }
    else {
        // const passwordResetToken = UtilityService.generateUUID();
        // const { expiresAt, uuid } = passwordResetToken;
        // await this.passwordResetRepository.setNewPasswordRequestToken(uuid, expiresAt, email);
        // Make a call to the notication microservice via a Message broker(RabbitMQ)
        return { isSuccess: true, message: `Your account password was successfully changed` };
    }
}


}