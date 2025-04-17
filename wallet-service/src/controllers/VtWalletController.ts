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
import { WalletStatus } from '../models/Wallet';
import { generateBankAccountNumber } from '../common/helpers/utils';
import { VirtualAccountRepository } from '../repositories/VirtualAccountRepository';
@Tags("Wallets")
@Route("")
@Service()
export class VtWalletController extends Controller {
    constructor(
        @Inject(()=> Logger) private readonly logger: Logger,
        private readonly withdrawalAccountService: WithdrawalAccountService,
    ){
        super()
        this.logger = new Logger(VtWalletController.name);
    }

    @Get("/")
    @Security("bearerAuth")
    public async createNewVtWallet(@Request() req: any)
    : Promise<CustomApiResponse>
    {
        try {
            const userServiceResponse = await axios.get(`${CONFIGS.SERVICES_COR_ORIGINS[1]}/kyc`,{
                headers:{
                    "x-auth_user_email": req.authEmail,
                    "x-auth_user_id": req.authId
                }
            })
            let message;
            if (userServiceResponse.data.status_code == 200) {
                const kyc = userServiceResponse.data.data
                const {first_name, last_name} = kyc;

                await VtWalletRepository.create({
                    user_id: req.authId,
                    status: WalletStatus.ACTIVE
                })
            
                const account_number = generateBankAccountNumber();

                const newBankAccount = await VirtualAccountRepository.create({
                    user_id: req.authId,
                    account_name: `${first_name} ${last_name}`,
                    account_number
                })
                this.logger.info({
                    activity_type: ACTIVITY_TYPES.USER_VIRTUAL_ACCOUNT.CREATION,
                    message,
                    metadata: {
                        account: {
                            id: newBankAccount?.id
                        }
                    }
                });
                message = MESSAGES.VIRTUAL_ACCOUNT.SUCCESSFUL
                this.setStatus(201)
                return successResponse(message as string, newBankAccount, 201)
            }
            else{
                message = MESSAGES.VIRTUAL_ACCOUNT.FAILED
                this.logger.info({
                    activity_type: ACTIVITY_TYPES.USER_VIRTUAL_ACCOUNT.CREATION,
                    message,
                    metadata: {
                        user: {
                            id: req?.authId
                        }
                    }
                });
                this.setStatus(400);
                return errorResponse(message as string)
            }
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
}