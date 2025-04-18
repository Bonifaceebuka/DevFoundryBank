import { dataSource } from "../common/configs/postgres";
import VirtualAccount from "../models/VirtualAccount";

export const VirtualAccountRepository = dataSource.getRepository(VirtualAccount).extend({
    async create(virtualAccountDetails: Partial<VirtualAccount>)
    : Promise<VirtualAccount> 
    {
        const account ={
            ...virtualAccountDetails
        }
        return this.save(account);
    },

});