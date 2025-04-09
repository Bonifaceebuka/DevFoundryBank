import { Service } from "typedi";
import { Logger } from "../common/configs/logger";
import EmailVerificationDTO, { AuthUserDTO, EmailVerificationResponseDTO, RegisterUserResponseDTO } from "../dto/AuthDTO";
import { MESSAGES } from "../common/constants/messages";
import { AppError } from "../common/errors/AppError";
import { compareHash, generateJWT, generateRandomString, generateUUID, hasExpired, hashString } from "../common/helpers/utils";
import { QUEUE_NAMES } from "../common/constants/queues";
import { UserRepository } from "../repositories/UserRepository";
import { sendRabbitMQMessage } from "../queues/email/producer";
import { AccountStatus, IUser } from "../models/User";
import { CONFIGS } from "../common/configs";
import moment from "moment";

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
        const {uuid, expiresAt} = generateUUID();
        
        await this.userRepository.createUser({ email, otp, email_verification_token: uuid, email_verification_expires_at: expiresAt, password: hashedPassword });

        const queue_name = QUEUE_NAMES.EMAIL_VERIFICATION.NAME;
        const verification_link = `${CONFIGS.FRONT_ENDS.WEB}/email/verification/${uuid}`
        const messageBody = {
            otp,
            verification_link,
            email,
            subject: QUEUE_NAMES.EMAIL_VERIFICATION.SUBJECT,
            email_category: queue_name
        }

        await sendRabbitMQMessage(queue_name, messageBody);

        message = MESSAGES.REGISTRATION.SUCCESSFUL;
        return { itExists: false, user: null, message };
    }

    public async loginUser(req: AuthUserDTO): Promise<{ isSuccess: boolean, message?: string, user?: IUser|null|undefined, token?: string }> {
        const { email, password } = req;
        
        const existingUser = await this.userRepository.findUserByEmail(email);
        if (!existingUser) {
            throw new AppError(MESSAGES.USER.INVALID_CREDENTIALS)
        }

        const isPasswordCheckOK = await compareHash(password, existingUser.password);
        if (!isPasswordCheckOK) {
            console.log({ existingUser })
            throw new AppError(MESSAGES.USER.INVALID_CREDENTIALS) 
            }
        
        const jwtDetails = generateJWT(existingUser.email, existingUser.id as string);
        this.logger.debug(MESSAGES.LOGS.JWT_GENERRATED)

        return { isSuccess: true, user: existingUser, token: jwtDetails, message: MESSAGES.LOGIN.LOGIN_SUCCESSFUL};
    }

    public async validateEmail(req: EmailVerificationDTO): Promise<EmailVerificationResponseDTO> {
        const { verification_token, otp } = req;

        const user = await this.userRepository.findUserByOtp(otp, verification_token as string);
        
        if (!user) {
            throw new AppError(MESSAGES.USER.NOT_FOUND, 404) 
        }

        // Check if OTP has expired
        const expectedExpirationDate = user.email_verification_expires_at;
        const isExpired = hasExpired(expectedExpirationDate);
        if (isExpired) {
            throw new AppError(MESSAGES.EMAIL_VERIFICATION.EXPIRED, 400) 
        }
        else{
            const dataSet = {
                status: AccountStatus.ACTIVE
            }
            const verificationData = {
                id: user.id,
                verification_token, otp
            }
            await this.userRepository.setUserToVerified(verificationData, dataSet);
            // Send a message to the user service
            return {
                isSuccess: true
            };
        }
    }

}