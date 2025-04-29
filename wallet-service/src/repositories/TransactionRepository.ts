import { dataSource } from "../common/configs/postgres";
import WalletTransaction from "../models/Transaction";
import Wallet from "../models/Wallet";

export const TransactionRepository = dataSource.getRepository(WalletTransaction).extend({
    async create(newTransaction: Partial<WalletTransaction>)
    : Promise<WalletTransaction> 
    {
        const transaction ={
            ...newTransaction
        }
        return this.save(transaction);
    },

    async findOne(conditions:object, order: 'DESC' | 'ASC', orderBy: string): Promise<WalletTransaction | null> 
    {
        return this.findOne({
            where: conditions,
            order: {[orderBy]: order}
        });
    },
});