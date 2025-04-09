import { Service } from "typedi";
import { UserModel, IUser } from "../models/User";

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
        return await UserModel.findOne({ email });
    }

    async findUserByOtp(otp: string, verification_token: string): Promise<IUser | null> {
        return await UserModel.findOne({ otp, verification_token });
    }

    async setUserToVerified(setUserToVerified: any, dataSet: Partial<IUser>) {
        const { id, verification_token, otp } = setUserToVerified;

        return await UserModel.updateOne({id, verification_token, otp}, dataSet, { new: true });
    }
}
