import { Inject, Service } from 'typedi';
import { Controller, Route, Post, Security, Request, Tags, Example, Get, Path, Delete } from "tsoa";
import WithdrawalAccountService from "../services/WithdrawalAccountService";
import { Logger } from '../../lib/logger';
import { CreateWithdrawalAccountDTO } from '../dtos/WithdrawalAccountDTO';
import { CustomApiResponse, serverErrorResponse, successResponse } from '../helpers/responseHandlers';
import { ACTIVITY_TYPES } from '../constants/activity_types';
import { dynamic_messages, MESSAGES } from '../constants/messages';
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
    @Security("bearerAuth")
    public async createNewWithdrawalAccount(@Request() req: any): Promise<CustomApiResponse>{
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
                activity_type: ACTIVITY_TYPES.WITHDRAWAL_ACCOUNT.CREATION,
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
                        return successResponse(message as string, account, 201)
                    }
                }
                this.setStatus(400);
            return successResponse(message as string)
        } catch (error: any) {
               this.logger.error({
                activity_type: ACTIVITY_TYPES.WITHDRAWAL_ACCOUNT.CREATION,
                message: error.message,
                metadata: {}
            });
                 return serverErrorResponse(MESSAGES.COMMON.INTERNAL_SERVER_ERROR);
            }
    }

    @Delete("/{account_id}")
    @Security("bearerAuth")
    public async deleteWithdrawalAccount(
            @Request() req: any,
            @Path() account_id: number
    ): Promise<CustomApiResponse> {
        try {
            const user_id = req.authId;
            const withdrwalAccountDeleted = await this.withdrawalAccountService.deleteWithdrawalAccount(user_id,account_id);
            const { isSuccess, message, account } = withdrwalAccountDeleted;

            this.logger.info({
                activity_type: ACTIVITY_TYPES.WITHDRAWAL_ACCOUNT.DELETE,
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
                    return successResponse(message as string,null)
                }
            }
            this.setStatus(400)
            return successResponse(message as string)
        } catch (error: any) {
           this.logger.error({
                activity_type: ACTIVITY_TYPES.WITHDRAWAL_ACCOUNT.DELETE,
                message: error.message,
                metadata: {}
            });
            return serverErrorResponse(MESSAGES.COMMON.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("/")
    @Security("bearerAuth")
    public async listWithdrawalAccounts(@Request() req: any): Promise<CustomApiResponse> {
        try {
            const user_id = req.authId;
            const withdrwalAccounts = await this.withdrawalAccountService.fetchWithdrawalAccounts(user_id);
            this.logger.info({
                activity_type: ACTIVITY_TYPES.WITHDRAWAL_ACCOUNT.LIST,
                message: dynamic_messages.FETCHED_SUCCESSFULLY(MESSAGES.WITHDRAWAL_ACCOUNT.NAME),
                metadata: {
                    user: {
                        email: req.authEmail
                    }
                }
            });

            if (withdrwalAccounts.isSuccess) {
                if (withdrwalAccounts.isSuccess) {
                    this.setStatus(200)
                    return successResponse(withdrwalAccounts.message as string, withdrwalAccounts.accounts)
                }
            }

            this.setStatus(400);
            return successResponse(withdrwalAccounts.message as string)
        } catch (error: any) {
           this.logger.error({
                activity_type: ACTIVITY_TYPES.WITHDRAWAL_ACCOUNT.LIST,
                message: error.message,
                metadata: {
                    user: {
                        email: req.authEmail
                    }
                }
            });
            return serverErrorResponse(MESSAGES.COMMON.INTERNAL_SERVER_ERROR)
        }
    }
    @Get("/{account_id}")
    @Security("bearerAuth")
    public async showWithdrawalAccountDetails(
        @Request() req: any,
        @Path() account_id: number
    ): Promise<CustomApiResponse> {
        try {
            const user_id = req.authId;
            const withdrwalAccount = await this.withdrawalAccountService.getWithdrawalAccount(user_id, account_id);
            this.logger.info({
                activity_type: ACTIVITY_TYPES.WITHDRAWAL_ACCOUNT.SHOW,
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
                    return successResponse(withdrwalAccount.message as string, withdrwalAccount.data)
                }
            }

            this.setStatus(400);
            return successResponse(withdrwalAccount.message as string)

        } catch (error: any) {
           this.logger.error({
               activity_type: ACTIVITY_TYPES.WITHDRAWAL_ACCOUNT.SHOW,
                message: error.message,
                metadata: {}
            });
            return serverErrorResponse(MESSAGES.COMMON.INTERNAL_SERVER_ERROR)
        }
    }
}