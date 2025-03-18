import { dataSource } from "../../config/postgres";
import User from "../models/postgres/User";

export const PasswordResetRepository = dataSource.getRepository(User).extend({
   
    async setNewPasswordRequestToken(token: string, expiresAt: Date, email: string): Promise<void> 
    {
        await this.update({ email }, { password_reset_token: token, token_expires_at: expiresAt }); 
    },
});