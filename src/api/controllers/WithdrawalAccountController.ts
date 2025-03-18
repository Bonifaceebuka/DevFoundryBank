import { Inject, Service } from 'typedi';
import { Controller, Route, Post, Security, Request, Tags, Example, Get, Path, Delete } from "tsoa";
import WithdrawalAccountService from "../services/WithdrawalAccountService";
import { Logger } from '../../lib/logger';
import { CreateWithdrawalAccountDTO, CreateWithdrawalAccountResponseDTO, FetchOneAccountResponseDTO, ListUserAccountsResponseDTO } from '../dtos/WithdrawalAccountDTO';
import { Currency } from '../enums/Currency';
@Tags("Withdrawal Bank Accounts")
@Route("withdrawal-accounts")
@Service()
export class WithdrawalAccountController extends Controller {
    constructor(
        @Inject(()=> Logger) private readonly logger: Logger,
        private readonly withdrawalAccountService: WithdrawalAccountService,
    ){
        super()
        this.logger = new Logger(WithdrawalAccountController.name);
    }

    @Post("/")
    @Security("jwt")
    @Example<CreateWithdrawalAccountDTO>({
        userId: "a150226a-125b-4ccf-a89e-698c6b59da38",
        bankName: "DF Foundry",
        bankCode: "97776",
        accountNumber: "97776",
        accountName: "97776",
        currency: Currency.NGN
    })
    public async createNewWithdrawalAccount(@Request() req: any): Promise<CreateWithdrawalAccountResponseDTO>{
        try {
            const user_id = req.authId;
            const createAccountData: CreateWithdrawalAccountDTO ={
                userId: req.userId,
                bankName: req.bankName,
                bankCode: req.bankCode,
                accountNumber: req.accountNumber,
                accountName: req.accountName,
                currency: req.currency
            }
            const newWallet = await this.withdrawalAccountService.addWithdrawalAccount(user_id, createAccountData);
            const { message, account } = newWallet;
            this.logger.info({
                activity_type: "Create new withdrawal bank account",
                message,
                metadata: {
                    account: {
                        id: account?.id
                    }
                }
            });
                
                if (newWallet.isSuccess) {
                    if (newWallet.isSuccess) {
                        this.setStatus(201)
                        return {
                            ...newWallet
                        }
                    }
                }
                this.setStatus(400);
                return {
                    ...newWallet
                }
        } catch (error: any) {
               this.logger.error({
                activity_type: "User registration",
                message: error.message,
                metadata: {}
            });
                throw new Error("Something went wrong");
            }
    }

    @Delete("/{account_id}")
    @Security("jwt")
    public async deleteWithdrawalAccount(
            @Request() req: any,
            @Path() account_id: number
    ): Promise<FetchOneAccountResponseDTO> {
        try {
            const user_id = req.authId;
            const withdrwalAccountDeleted = await this.withdrawalAccountService.deleteWithdrawalAccount(user_id,account_id);
            const { isSuccess, message, account } = withdrwalAccountDeleted;

            this.logger.info({
                activity_type: "Remove withdrawal account",
                message: withdrwalAccountDeleted?.message,
                metadata: {
                    account:{
                        id: account_id
                    }
                }
            });
            if (withdrwalAccountDeleted.isSuccess) {
                if (isSuccess) {
                    this.setStatus(200)
                    return {
                        ...withdrwalAccountDeleted
                    }
                }
            }
            this.setStatus(400)
            return {
                ...withdrwalAccountDeleted
            }
        } catch (error: any) {
           this.logger.error({
                activity_type: "Remove withdrawal account",
                message: error.message,
                metadata: {}
            });
            throw new Error("Something went wrong");
        }
    }

    @Get("/")
    @Security("jwt")
    public async listWithdrawalAccounts(@Request() req: any): Promise<ListUserAccountsResponseDTO> {
        try {
            const user_id = req.authId;
            const withdrwalAccounts = await this.withdrawalAccountService.fetchWithdrawalAccounts(user_id);
            this.logger.info({
                activity_type: "Fetch user's withdrawal accounts",
                message: "User withdrawal accounts fetched successfully",
                metadata: {
                    user: {
                        email: req.authEmail
                    }
                }
            });

            if (withdrwalAccounts.isSuccess) {
                if (withdrwalAccounts.isSuccess) {
                    this.setStatus(200)
                    return {
                        ...withdrwalAccounts
                    }
                }
            }

            this.setStatus(400);
            return {
                ...withdrwalAccounts
            }
        } catch (error: any) {
           this.logger.error({
                activity_type: "User registration",
                message: error.message,
                metadata: {
                    user: {
                        email: req.authEmail
                    }
                }
            });
            throw new Error("Something went wrong");
        }
    }
    @Get("/{account_id}")
    @Security("jwt")
    public async showWithdrawalAccountDetails(
        @Request() req: any,
        @Path() account_id: number
    ): Promise<FetchOneAccountResponseDTO> {
        try {
            const user_id = req.authId;
            const withdrwalAccount = await this.withdrawalAccountService.getWithdrawalAccount(user_id, account_id);
            this.logger.info({
                activity_type: "Fetch one withdrawal account of a user",
                message: withdrwalAccount.message,
                metadata: {
                    user: {
                        email: req.authEmail
                    }
                }
            });

            if (withdrwalAccount.isSuccess) {
                if (withdrwalAccount.isSuccess) {
                    this.setStatus(200)
                    return {
                        ...withdrwalAccount
                    }
                }
            }

            this.setStatus(400);
            return {
                ...withdrwalAccount
            }
        } catch (error: any) {
           this.logger.error({
               activity_type: "Fetch one withdrawal account of a user",
                message: error.message,
                metadata: {}
            });
            throw new Error("Something went wrong");
        }
    }
}