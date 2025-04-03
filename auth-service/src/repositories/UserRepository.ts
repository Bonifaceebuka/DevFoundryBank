import { UserModel, IUser } from "../models/User";

export class UserRepository {
    async createUser(data: Partial<IUser>): Promise<IUser> {
        const user = new UserModel(data);
        return await user.save();
    }

    async findUserById(id: string): Promise<IUser | null> {
        return await UserModel.findById(id);
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email });
    }
}
