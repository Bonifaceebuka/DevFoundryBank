import { dataSource } from "../common/configs/postgres";
import { dynamic_messages, MESSAGES } from "../common/constants/messages";
import { AppError } from "../common/errors/AppError";
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

    async findByUserId(user_id: string): Promise<Wallet[]> 
    {
        return this.find({where:{user_id}});
    },

    async findOneByConditions(conditions:object): Promise<Wallet|null> 
    {
        return this.findOne({where: conditions});
    },

    async fundOne(wallet_id: number,amount: number): Promise<{opening_balance: number, new_balance: number}> 
    {
       return this.findOneByConditions({id: wallet_id})
            .then(async (wallet: Wallet | null)=>{
                if (wallet) {
                    const openingBalance = Number(wallet.balance);
                    const new_balance = openingBalance + amount
    
                    wallet.balance = new_balance.toString();
                    await this.save(wallet);
                    
                    return {
                        opening_balance: openingBalance,
                        new_balance
                    }
                }
                else{
                    throw new AppError(dynamic_messages.NOT_FOUND('Wallet not found!'), 404)
                }
            })
            .catch((err)=>{
                throw new AppError(MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500)
            })
    },

    async debitOne(wallet_id: number,amount: number): Promise<{opening_balance: number, new_balance: number}> 
    {
       return this.findOneByConditions({id: wallet_id})
            .then(async (wallet: Wallet | null)=>{
                if (wallet) {
                    const openingBalance = Number(wallet.balance);
                    const new_balance = openingBalance - amount

                    wallet.balance = new_balance.toString();
                    await this.save(wallet);
                    
                    return {
                        opening_balance: openingBalance,
                        new_balance
                    }
                }
                else{
                    throw new AppError(dynamic_messages.NOT_FOUND('Wallet not found!'), 404)
                }
            })
            .catch((err)=>{
                throw new AppError(MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500)
            })
    },
});