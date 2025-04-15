import { Service } from "typedi";
import { UserModel, IUser, AccountStatus } from "../models/User";
import moment from "moment";

@Service()
export class UserRepository {
    async createUser(data: Partial<IUser>): Promise<IUser> {
        const user = new UserModel(data);
        return await user.save();
    }

    async findUserById(id: string): Promise<IUser | null> {
        return await UserModel.findById(id);
    }

    async findByPasswordResetToken(password_reset_token: string): Promise<IUser | null> {
        return await UserModel.findOne({password_reset_token});
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email });//.select('id email status');
    }

    async findUserByOtp(otp: string, verification_token: string): Promise<IUser | null> {
        return await UserModel.findOne({ otp, email_verification_token: verification_token });
    }

    async setUserToVerified(setUserToVerified: any) {
        const { id, verification_token, otp } = setUserToVerified;

        return await UserModel.updateOne({_id: id, email_verification_token: verification_token, otp}, 
            { $set: {status: AccountStatus.ACTIVE, verified_at: moment()}}, 
            { new: true });
    }
}
