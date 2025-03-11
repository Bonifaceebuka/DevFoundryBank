import { dataSource } from "../../config/postgres";
import UserWithdrawalInformation from "../models/postgres/UserWithdrawalInformation";


export const UserWithdrawalInformationRepository = dataSource.getRepository(UserWithdrawalInformation).extend({
    async add(userId: string, accountDetails: Partial<UserWithdrawalInformation>): Promise<UserWithdrawalInformation> {
        const account ={
            ...accountDetails,
            userId
        }
        return this.save(account);
    },

    async findById(id: number): Promise<UserWithdrawalInformation> {
        return this.findOne({ where: { id } });
    },

    async findByUserAndId(userId: string, id: number): Promise<UserWithdrawalInformation> {
        return this.findOne({ where: { userId, id } });
    },

    async findByUser(userId: string): Promise<UserWithdrawalInformation[]> {
        return this.find({ where: { userId } });
    },
    
    async findByAccountNumber(accountNumber: string): Promise<UserWithdrawalInformation> {
        return this.findOne({ where: { accountNumber } });
    },

    async list(userId: string): Promise<UserWithdrawalInformation[]> {
        return this.find({ where: { userId } });
    },

    async updateUserAccount(user_id: string, accountId: number, updates?: Partial<UserWithdrawalInformation>): Promise<void> {
        await this.update({ id: accountId }, updates);
    },

    async deleteUserWithdrawalAccount(user_id: string, accountId: number) {
        const account = await this.findById(accountId);
        return this.remove([account]);
    },

    async getUserWithdrawalAccount(user_id: string, accountId: number) {
        const account = await this.findById(accountId);
        return account;
    }
});