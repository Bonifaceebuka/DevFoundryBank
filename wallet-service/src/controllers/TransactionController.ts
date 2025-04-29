import { Inject, Service } from 'typedi';
import { Controller, Route, Post, Security, Request, Tags, Get, Path, Delete } from "tsoa";
import { Logger } from '../common/configs/logger';
import WithdrawalAccountService from '../services/WithdrawalAccountService';
import { CustomApiResponse } from '../dto/CommonDTO';
import { CreateWithdrawalAccountDTO } from '../dto/WithdrawalAccountDTO';
import { ACTIVITY_TYPES } from '../common/constants/activity_types';
import { errorResponse, serverErrorResponse, successResponse } from '../common/helpers/responseHandlers';
import { dynamic_messages, MESSAGES } from '../common/constants/messages';
import { AppError } from '../common/errors/AppError';
import axios from 'axios';
import { CONFIGS } from '../common/configs';
import { VtWalletRepository } from '../repositories/VtWalletRepository';

import TransactionService from '../services/TransactionService';
import { PeformFundsTransfer } from '../dto/TransactionDTO';
@Tags("Transactions")
@Route("transactions")
@Service()
export class TransactionController extends Controller {
    constructor(
        @Inject(()=> Logger) private readonly logger: Logger,
        private readonly transactionService: TransactionService,
    ){
        super()
        this.logger = new Logger(TransactionController.name);
    }

    @Post("/transfer")
    @Security("bearerAuth")
    public async fundsTransfer(@Request() req: any)
    : Promise<CustomApiResponse>
    {
        try {
            const {
                amount,
                account_number
            } = req.body;

            const transferData:PeformFundsTransfer = {
                user_id: req.authId,
                amount,
                account_number
            }
            
            const walletResponse = await this.transactionService.performFundsTransfer(transferData)
            this.setStatus(200)
            return successResponse(walletResponse?.message as string, walletResponse?.data, 201);
        } catch (error: any) {
            console.log({error})
               this.logger.error({
                activity_type: ACTIVITY_TYPES.USER_BANK_ACCOUNT.CREATION,
                message: error.message,
                metadata: {}
            });
            if(error instanceof AppError && error.statusCode && error.statusCode == 400){
                return errorResponse(error.message);
            }
                 return serverErrorResponse(MESSAGES.COMMON.INTERNAL_SERVER_ERROR);
            }
    }

    @Get("/")
    @Security("bearerAuth")
    public async fetchVtWallets(@Request() req: any)
    : Promise<CustomApiResponse>
    {
        try {
            let message;
                const accounts = await VtWalletRepository.findByUserId(req.authId)
                this.logger.info({
                    activity_type: ACTIVITY_TYPES.USER_VIRTUAL_WALLET.FETCH,
                    message,
                    metadata: {
                        accounts
                    }
                });
                message = dynamic_messages.FETCHED_SUCCESSFULLY('User vitrual accounts')
                this.setStatus(200)
                return successResponse(message as string, accounts, 200);
        } catch (error: any) {
               this.logger.error({
                activity_type: ACTIVITY_TYPES.USER_VIRTUAL_WALLET.FETCH,
                message: error.message,
                metadata: {}
            });

            if(error instanceof AppError && error.statusCode && error.statusCode == 400){
                return errorResponse(error.message);
            }
                 return serverErrorResponse(MESSAGES.COMMON.INTERNAL_SERVER_ERROR);
            }
    }
}