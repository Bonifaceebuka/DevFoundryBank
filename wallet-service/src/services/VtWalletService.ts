import { Inject, Service } from "typedi";
import { Logger } from "../common/configs/logger";
import { CONFIGS } from "../common/configs";
import axios from "axios";
import { WalletStatus } from '../models/Wallet';
import { VtWalletRepository } from '../repositories/VtWalletRepository';
import { AppError } from "../common/errors/AppError";
import { MESSAGES } from "../common/constants/messages";
import { ACTIVITY_TYPES } from "../common/constants/activity_types";
import BankAccountService from "./BanAccountService";

@Service()
export default class VtWalletService {
    constructor(
        @Inject(()=> Logger) private readonly logger: Logger,
        private readonly bankAccountService: BankAccountService,

    ){
        this.logger = new Logger(VtWalletService.name);
    }
    
    public async create(req: any): Promise<any>{
        const user_id = req.authId;
        let message = null;

        const userServiceResponse = await axios.get(`${CONFIGS.SERVICES_COR_ORIGINS[1]}/kyc`,{
            headers:{
                "x-auth_user_email": req.authEmail,
                "x-auth_user_id": user_id
            }
        })

        if (userServiceResponse.data.status_code == 200) {
            const kyc = userServiceResponse.data.data
            const {first_name, last_name} = kyc;

            const existingWallets = await VtWalletRepository.findByUserId(user_id);
            if (!existingWallets || existingWallets.length == 0) {
               const newWallet = await VtWalletRepository.create({
                    user_id,
                    status: WalletStatus.ACTIVE
                })
                message = MESSAGES.VIRTUAL_WALLET.SUCCESSFUL
                this.logger.info({
                    activity_type: ACTIVITY_TYPES.USER_BANK_ACCOUNT.CREATION,
                    message,
                    metadata: {
                        wallets: newWallet
                    }
                });
                // Call the bank account service
                const newBankAccountResponse = await this.bankAccountService.create(first_name, last_name, user_id);
                return newBankAccountResponse;
            }
            else{
                message = MESSAGES.VIRTUAL_WALLET.ALREADY_EXISTS
                this.logger.info({
                    activity_type: ACTIVITY_TYPES.USER_BANK_ACCOUNT.CREATION,
                    message,
                    metadata: {
                        wallets: existingWallets
                    }
                });
                throw new AppError(message,400)
            }
        
        }
        else{
            message = MESSAGES.VIRTUAL_WALLET.FAILED
            this.logger.info({
                activity_type: ACTIVITY_TYPES.USER_BANK_ACCOUNT.CREATION,
                message,
                metadata: {
                    user: {
                        id: req?.authId
                    }
                }
            });
            throw new AppError(message,400)
        }
    }

}