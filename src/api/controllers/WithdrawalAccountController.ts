import { Service } from 'typedi';
import { Request, Response } from "express";
import WithdrawalAccountService from "../services/WithdrawalAccountService";

@Service()
export default class WithdrawalAccountController {
    constructor(
        private readonly withdrawalAccountService: WithdrawalAccountService
    ){}

    public async createNewWithdrawalAccount(req: Request, res: Response) {
        try {
                const user_id = req.authId;
                const newWallet = await this.withdrawalAccountService.addWithdrawalAccount(user_id, req.body);
                if (newWallet.isSuccess) {
                    return res.status(201).json({ message: newWallet.message })
                }
                return res.status(400).json({ message: newWallet.message })
            } catch (error) {
                throw new Error("Something went wrong");
            }
    }

    public async deleteWithdrawalAccount(req: Request, res: Response) {
        try {
            const account_id = req.params.id as number
            const user_id = req.authId;
            const withdrwalAccountDeleted = await this.withdrawalAccountService.deleteWithdrawalAccount(user_id,account_id);
            if (withdrwalAccountDeleted.isSuccess) {
                return res.status(200).json({ message: withdrwalAccountDeleted.message })
            }
            return res.status(403).json({ message: withdrwalAccountDeleted.message })
        } catch (error) {
            throw new Error("Something went wrong");
        }
    }

    public async listWithdrawalAccounts(req: Request, res: Response) {
        try {
            const user_id = req.authId;
            const withdrwalAccounts = await this.withdrawalAccountService.fetchWithdrawalAccounts(user_id);
            return res.status(200).json({ data: withdrwalAccounts })
        } catch (error) {
            throw new Error("Something went wrong");
        }
    }

    public async showWithdrawalAccountDetails(req: Request, res: Response) {
        try {
            const account_id = req.params.id as number
            const user_id = req.authId;
            const withdrwalAccount = await this.withdrawalAccountService.getWithdrawalAccount(user_id, account_id);
            if (withdrwalAccount.isSuccess) {
                return res.status(200).json({ data: withdrwalAccount?.data })
            }
            return res.status(403).json({ message: withdrwalAccount.message })
        } catch (error) {
            throw new Error("Something went wrong");
        }
    }
}