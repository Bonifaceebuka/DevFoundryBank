import { Service } from "typedi";
import { Logger } from "../../lib/logger";
import CreateUserRequest from "../models/payload/requests/CreateUserRequest";
import { UserRepository } from "../repositories/UserRepository";
import UtilityService from "./UtilityService";
import AuthenticateUserRequest from "../models/payload/requests/AuthenticateUserRequest";
import User from "../models/postgres/User";
import AuthenticateUserOtp from "../models/payload/requests/AuthenticateUserOtp";
import { EmailVerificationResponseDTO, RegisterUserResponseDTO } from "../dtos/AuthDTO";

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
            message = "Email is already registered";
            return { itExists: true, user: existingUser, message };
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

    public async loginUser(req: AuthenticateUserRequest): Promise<{ isSuccess: boolean, message?: string, user?: User, token?: string }> {
        const { email, password } = req;

        const existingUser = await UserRepository.findByEmail(email);
        let message = null;
        if (!existingUser) {
            message = "Invalid email or password";
            return { isSuccess: false, message};
        }

        const isPasswordCheckOK = await UtilityService.compareHash(password, existingUser.password);
        if (!isPasswordCheckOK) {
            message = "Invalid email or password";
            return { isSuccess: false, message };
        }

        if (!existingUser.isValidated) {
            // resend Otp
            message = "User account not validated. Please check your email for further instructions";
            return { isSuccess: false, message };
        }

        if (!existingUser.isActive) {
            message = "User account is inactive. Please contact support";
            return { isSuccess: false, message };
        }

        if (!existingUser.isEnabled) {
            message = "User account is disabled. Please contact support";
            return { isSuccess: false, message };
        }

        if (existingUser.isDeleted) {
            message = "User account has been deleted. Please contact support if you want to restore your account";
            return { isSuccess: false, message};
        }
        
        const user = UtilityService.sanitizeUserObject(existingUser);
        message = "User object was sanitized";
        this.logger.debug(message)
        // generate JWT
        const jwtDetails = UtilityService.generateJWT(user.email, user.id);
        message = "User JWT was generated";
        this.logger.debug(message)
        return { isSuccess: true, user, token: jwtDetails, message:"Login was successful" };
    }

    public async validateEmail(req: AuthenticateUserOtp): Promise<EmailVerificationResponseDTO> {
        const { email, otp } = req;

        const user = await UserRepository.findByOtp(otp, email);
        // let message = "Could not validate user as user does not exist";
        if (!user) {
            // this.logger.error(message, { email, otp });
            return {
                isSuccess: false
            };
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