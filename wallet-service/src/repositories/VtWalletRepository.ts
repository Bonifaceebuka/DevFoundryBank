import { dataSource } from "../common/configs/postgres";
import Wallet from "../models/Wallet";

export const VtWalletRepository = dataSource.getRepository(Wallet).extend({
    async create(walletDetails: Partial<Wallet>)
    : Promise<Wallet> 
    {
        const account ={
            ...walletDetails
        }
        return this.save(account);
    },

});