import { Service } from "typedi";
import { Logger } from "../common/configs/logger";
import { AuthUserDataDTO, AuthUserDTO, RegisterUserResponseDTO } from "../dto/AuthDTO";
import { MESSAGES } from "../common/constants/messages";
import { AppError } from "../common/errors/AppError";
import { generateRandomString, hashString } from "../helpers/utils";
import { QUEUE_NAMES } from "../common/constants/queues";
import { UserRepository } from "../repositories/UserRepository";

@Service()
export default class AuthService {
    private readonly logger: Logger;
    private userRepository: UserRepository;
    constructor(
        userRepository: UserRepository
    ) { 
        this.logger = new Logger(AuthService.name);
        this.userRepository = userRepository;
    }

    public async registerUser(req: AuthUserDTO): Promise<RegisterUserResponseDTO> 
    {
        const { email, password } = req;

        const existingUser = await this.userRepository.findUserByEmail(email);
        let message = null;
        if (existingUser) {
            message = MESSAGES.COMMON.EMAIL_EXISTS;
            throw new AppError(message);
        }

        const hashedPassword = await hashString(password);
        const otp = generateRandomString({ length: 6, numericOnly: true });
        // const createdUser = await UserRepository.add({ ...req, otp, password: hashedPassword });
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        otp; // send otp to user
        // todo:: calculate OTP expriation time and save
        const queue_name = QUEUE_NAMES.EMAIL_VERIFICATION.NAME;
        const messageBody = {
            otp,
            email,
            subject: QUEUE_NAMES.EMAIL_VERIFICATION.SUBJECT,
            email_category: queue_name
        }

        // await sendRabbitMQMessage(queue_name, messageBody);

        message = MESSAGES.REGISTRATION.SUCCESSFUL;
        return { itExists: false, user: null, message };
    }

    // public async loginUser(req: AuthenticateUserRequest): Promise<{ isSuccess: boolean, message?: string, user?: User|null|undefined, token?: string }> {
    //     const { email, password } = req;
        
    //     const existingUser = await UserRepository.findByEmail(email);
    //     if (!existingUser) {
    //         throw new AppError(MESSAGES.USER.INVALID_CREDENTIALS)
    //     }

    //     const isPasswordCheckOK = await UtilityService.compareHash(password, existingUser.password);
    //     if (!isPasswordCheckOK) {
    //         console.log({ existingUser })
    //         throw new AppError(MESSAGES.USER.INVALID_CREDENTIALS) 
    //         }

    //     if (!existingUser.isValidated) {
    //         // resend Otp
    //         throw new AppError(MESSAGES.USER.INVALID_ACCOUNT);
    //     }

    //     if (!existingUser.isActive) {
    //         throw new AppError(MESSAGES.USER.INACTIVE_ACCOUNT);
    //     }

    //     if (!existingUser.isEnabled) {
    //         throw new AppError(MESSAGES.USER.DISABLED_ACCOUNT);
    //     }
        
    //     const jwtDetails = UtilityService.generateJWT(existingUser.email, existingUser.id as string);
    //     this.logger.debug(MESSAGES.LOGS.JWT_GENERRATED)

    //     const sanitizedUser = UtilityService.sanitizeUserObject(existingUser);
    //     this.logger.debug(MESSAGES.LOGS.USER_SANITIZED)
    //     // generate JWT
    //     return { isSuccess: true, user: sanitizedUser, token: jwtDetails, message: MESSAGES.LOGIN.LOGIN_SUCCESSFUL};
    // }

    // public async validateEmail(req: AuthenticateUserOtp): Promise<EmailVerificationResponseDTO> {
    //     const { email, otp } = req;

    //     const user = await UserRepository.findByOtp(otp, email);
    //     // let message = "Could not validate user as user does not exist";
    //     if (!user) {
    //         throw new AppError(MESSAGES.USER.NOT_FOUND, 404) 
    //     }

    //     // check otp storage to validate sent otp
    //     // Check if OTP has expired

    //     // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    //     email;
    //     // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    //     otp;

    //     await UserRepository.updateByUser(user, { isActive: true, isEnabled: true, isValidated: true });

    //     return {
    //         isSuccess: true
    //     };
    // }

}