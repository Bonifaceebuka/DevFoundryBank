import { dataSource } from "../common/configs/postgres";
import BankAccount from "../models/VirtualAccount";
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

    async findByUserId(user_id: string): Promise<VirtualAccount[]> 
    {
        return this.find({where:{user_id}});
    },

    async findOneByConditions(conditions:object)
    : Promise<BankAccount|null> 
    {
        console.log("hhhhhhhhhhhhh")
        return this.findOne({where: conditions});
    },
});