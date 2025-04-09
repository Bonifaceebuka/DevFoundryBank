import { Service } from "typedi";
import { UserModel } from "../models/User";

@Service()
export class PasswordResetRepository {
    async setNewPasswordRequestToken(password_reset_token: string, token_expires_at: Date, id: string): Promise<void> 
    {
        await UserModel.updateOne({ id }, { password_reset_token, token_expires_at}); 
    }
};