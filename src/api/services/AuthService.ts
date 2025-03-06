import { Service } from "typedi";
import { Logger } from "../../lib/logger";
import CreateUserRequest from "../models/payload/requests/CreateUserRequest";
import { UserRepository } from "../repositories/UserRepository";
import UtilityService from "./UtilityService";
import AuthenticateUserRequest from "../models/payload/requests/AuthenticateUserRequest";
import User from "../models/postgres/User";
import AuthenticateUserOtp from "../models/payload/requests/AuthenticateUserOtp";

@Service()
export default class AuthService {
    constructor(
        private logger: Logger,
    ) { }

    public async registerUser(req: CreateUserRequest): Promise<{ isExists: boolean, user: User, otp?: string }> {
        const { email, password } = req;

        const existingUser = await UserRepository.findByEmail(email);
        // this.logger.log({existingUser})
        if (existingUser) {
            return { isExists: true, user: existingUser };
        }

        const hashedPassword = await UtilityService.hashString(password);
        const otp = UtilityService.generateRandomString({ length: 6, numericOnly: true });
        const createdUser = await UserRepository.add({ ...req, otp, password: hashedPassword });
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        otp; // send otp to user
        // todo:: calculate OTP expriation time and save
        return { isExists: false, user: createdUser, otp };
    }

    public async loginUser(req: AuthenticateUserRequest): Promise<{ isSuccess: boolean, message?: string, user?: User, token?: string }> {
        const { email, password } = req;

        const existingUser = await UserRepository.findByEmail(email);
        if (!existingUser) {
            return { isSuccess: false, message: "Invalid email or password" };
        }

        const isPasswordCheckOK = await UtilityService.compareHash(password, existingUser.password);
        if (!isPasswordCheckOK) {
            return { isSuccess: false, message: "Invalid email or password" };
        }

        if (!existingUser.isValidated) {
            // resend Otp
            return { isSuccess: false, message: "User account not validated. Please check your email for further instructions" };
        }

        if (!existingUser.isActive) {
            return { isSuccess: false, message: "User account is inactive. Please contact support" };
        }

        if (!existingUser.isEnabled) {
            return { isSuccess: false, message: "User account is disabled. Please contact support" };
        }

        if (existingUser.isDeleted) {
            return { isSuccess: false, message: "User account has been deleted. Please contact support if you want to restore your account" };
        }
        
        const user = UtilityService.sanitizeUserObject(existingUser);

        // generate JWT
        const jwtDetails = UtilityService.generateJWT(user.email, user.id);

        return { isSuccess: true, user, token: jwtDetails };
    }

    public async validateEmail(req: AuthenticateUserOtp): Promise<boolean> {
        const { email, otp } = req;

        const user = await UserRepository.findByOtp(otp, email);
        if (!user) {
            this.logger.error("Could not validate user as user does not exist", { email, otp });
            return false;
        }

        // check otp storage to validate sent otp
        // Check if OTP has expired

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        email;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        otp;

        await UserRepository.updateByUser(user, { isActive: true, isEnabled: true, isValidated: true });

        return true;
    }

}