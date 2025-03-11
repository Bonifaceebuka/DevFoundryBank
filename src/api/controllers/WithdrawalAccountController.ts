import { Inject, Service } from 'typedi';
import { Request, Response } from "express";
import WithdrawalAccountService from "../services/WithdrawalAccountService";
import { Logger } from '../../lib/logger';

@Service()
export default class WithdrawalAccountController {
    constructor(
        private readonly withdrawalAccountService: WithdrawalAccountService,
        @Inject(()=> Logger) private readonly logger: Logger,
    ){}

    public async createNewWithdrawalAccount(req: Request, res: Response) {
        try {
                const user_id = req.authId;
                const newWallet = await this.withdrawalAccountService.addWithdrawalAccount(user_id, req.body);
                this.logger.info(newWallet.message)
                
                if (newWallet.isSuccess) {
                    return res.status(201).json({ message: newWallet.message })
                }
                return res.status(400).json({ message: newWallet.message })
        } catch (error: any) {
                this.logger.error(error.message)
                throw new Error("Something went wrong");
            }
    }

    public async deleteWithdrawalAccount(req: Request, res: Response) {
        try {
            const account_id = req.params.id as number
            const user_id = req.authId;
            const withdrwalAccountDeleted = await this.withdrawalAccountService.deleteWithdrawalAccount(user_id,account_id);
            this.logger.info(withdrwalAccountDeleted.message)
            if (withdrwalAccountDeleted.isSuccess) {
                return res.status(200).json({ message: withdrwalAccountDeleted.message })
            }
            return res.status(403).json({ message: withdrwalAccountDeleted.message })
        } catch (error: any) {
            this.logger.error(error.message)
            throw new Error("Something went wrong");
        }
    }

    public async listWithdrawalAccounts(req: Request, res: Response) {
        try {
            const user_id = req.authId;
            const withdrwalAccounts = await this.withdrawalAccountService.fetchWithdrawalAccounts(user_id);
            this.logger.info("User withdrawal accounts fetched successfully")
            return res.status(200).json({ data: withdrwalAccounts })
        } catch (error: any) {
            this.logger.error(error.message)
            throw new Error("Something went wrong");
        }
    }

    public async showWithdrawalAccountDetails(req: Request, res: Response) {
        try {
            const account_id = req.params.id as number
            const user_id = req.authId;
            const withdrwalAccount = await this.withdrawalAccountService.getWithdrawalAccount(user_id, account_id);
            if (withdrwalAccount.isSuccess) {
                this.logger.info("User withdrawal account details fetched successfully")
                return res.status(200).json({ data: withdrwalAccount?.data })
            }

            this.logger.info(withdrwalAccount.message)
            return res.status(403).json({ message: withdrwalAccount.message })
        } catch (error: any) {
            this.logger.error(error.message)
            throw new Error("Something went wrong");
        }
    }
}