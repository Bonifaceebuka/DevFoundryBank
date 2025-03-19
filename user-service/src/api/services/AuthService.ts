import { Service } from "typedi";
import { Logger } from "../../lib/logger";
import CreateUserRequest from "../models/payload/requests/CreateUserRequest";
import { UserRepository } from "../repositories/UserRepository";
import UtilityService from "./UtilityService";
import AuthenticateUserRequest from "../models/payload/requests/AuthenticateUserRequest";
import User from "../models/postgres/User";
import AuthenticateUserOtp from "../models/payload/requests/AuthenticateUserOtp";
import { EmailVerificationResponseDTO, RegisterUserResponseDTO } from "../dtos/AuthDTO";
import { AppError } from "../errors/AppError";
import { MESSAGES } from "../constants/messages";

@Service()
export default class AuthService {
    private readonly logger: Logger;
    constructor(
    ) { 
        this.logger = new Logger(AuthService.name);
    }

    public async registerUser(req: CreateUserRequest): Promise<RegisterUserResponseDTO> {
        const { email, password } = req;

        const existingUser = await UserRepository.findByEmail(email);
        let message = null;
        if (existingUser) {
            message = MESSAGES.COMMON.EMAIL_EXISTS;
            throw new AppError(message);
        }

        const hashedPassword = await UtilityService.hashString(password);
        const otp = UtilityService.generateRandomString({ length: 6, numericOnly: true });
        const createdUser = await UserRepository.add({ ...req, otp, password: hashedPassword });
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        otp; // send otp to user
        // todo:: calculate OTP expriation time and save
        
        message = "User registration was successful";
        return { itExists: false, user: createdUser, message };
    }

    public async loginUser(req: AuthenticateUserRequest): Promise<{ isSuccess: boolean, message?: string, user?: User|null|undefined, token?: string }> {
        const { email, password } = req;
        
        const existingUser = await UserRepository.findByEmail(email);
        if (!existingUser) {
            throw new AppError(MESSAGES.USER.INVALID_CREDENTIALS)
        }

        const isPasswordCheckOK = await UtilityService.compareHash(password, existingUser.password);
        if (!isPasswordCheckOK) {
            console.log({ existingUser })
            throw new AppError(MESSAGES.USER.INVALID_CREDENTIALS) 
            }

        if (!existingUser.isValidated) {
            // resend Otp
            throw new AppError(MESSAGES.USER.INVALID_ACCOUNT);
        }

        if (!existingUser.isActive) {
            throw new AppError(MESSAGES.USER.INACTIVE_ACCOUNT);
        }

        if (!existingUser.isEnabled) {
            throw new AppError(MESSAGES.USER.DISABLED_ACCOUNT);
        }
        
        const jwtDetails = UtilityService.generateJWT(existingUser.email, existingUser.id as string);
        this.logger.debug(MESSAGES.LOGS.JWT_GENERRATED)

        const sanitizedUser = UtilityService.sanitizeUserObject(existingUser);
        this.logger.debug(MESSAGES.LOGS.USER_SANITIZED)
        // generate JWT
        return { isSuccess: true, user: sanitizedUser, token: jwtDetails, message: MESSAGES.LOGIN.LOGIN_SUCCESSFUL};
    }

    public async validateEmail(req: AuthenticateUserOtp): Promise<EmailVerificationResponseDTO> {
        const { email, otp } = req;

        const user = await UserRepository.findByOtp(otp, email);
        // let message = "Could not validate user as user does not exist";
        if (!user) {
            throw new AppError(MESSAGES.USER.NOT_FOUND, 404) 
        }

        // check otp storage to validate sent otp
        // Check if OTP has expired

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        email;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        otp;

        await UserRepository.updateByUser(user, { isActive: true, isEnabled: true, isValidated: true });

        return {
            isSuccess: true
        };
    }

}