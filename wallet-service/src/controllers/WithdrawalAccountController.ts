import { Inject, Service } from 'typedi';
import { Controller, Route, Post, Security, Request, Tags, Example, Get, Path, Delete } from "tsoa";
import { Logger } from '../common/configs/logger';
import WithdrawalAccountService from '../services/WithdrawalAccountService';
import { CustomApiResponse } from '../dto/CommonDTO';
import { CreateWithdrawalAccountDTO } from '../dto/WithdrawalAccountDTO';
import { ACTIVITY_TYPES } from '../common/constants/activity_types';
import { errorResponse, serverErrorResponse, successResponse } from '../common/helpers/responseHandlers';
import { dynamic_messages, MESSAGES } from '../common/constants/messages';
import { AppError } from '../common/errors/AppError';
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
                userId: user_id,
                bankName: req.body.bankName,
                bankCode: req.body.bankCode,
                accountNumber: req.body.accountNumber,
                accountName: req.body.accountName,
                currency: req.body.currency
            }
            const newWallet = await this.withdrawalAccountService.addWithdrawalAccount(user_id, createAccountData);
            const { message
                , account 
            } = newWallet;
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
            return errorResponse(message as string)
        } catch (error: any) {
               this.logger.error({
                activity_type: ACTIVITY_TYPES.WITHDRAWAL_ACCOUNT.CREATION,
                message: error.message,
                metadata: {}
            });
            if(error instanceof AppError && error.statusCode && error.statusCode == 400){
                return errorResponse(error.message);
            }
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