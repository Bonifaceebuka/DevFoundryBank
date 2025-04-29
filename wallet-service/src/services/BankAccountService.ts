import { Inject, Service } from "typedi";
import { Logger } from "../common/configs/logger";
import { VirtualAccountRepository } from "../repositories/VirtualAccountRepository";
import { generateBankAccountNumber } from "../common/helpers/utils";
import { ACTIVITY_TYPES } from "../common/constants/activity_types";
import { dynamic_messages, MESSAGES } from "../common/constants/messages";
import { AppError } from "../common/errors/AppError";
import Bank from "../models/Bank";
import BankAccount from "../models/VirtualAccount";

@Service()
export default class BankAccountService {
    constructor(
        @Inject(() => Logger) private readonly logger: Logger,
    ) {
        this.logger = new Logger(BankAccountService.name);
    }

    public async create(first_name: string, last_name: string, user_id: string): Promise<any> {
        let message = null;

        const existingBankAccounts = await VirtualAccountRepository.findByUserId(user_id);
        if (!existingBankAccounts || existingBankAccounts.length == 0) {
            const account_number = generateBankAccountNumber();
            const newBankAccount = await VirtualAccountRepository.create({
                user_id,
                account_name: `${first_name} ${last_name}`,
                account_number
            })

            message = MESSAGES.BANK_ACCOUNT.SUCCESSFUL;
            this.logger.info({
                activity_type: ACTIVITY_TYPES.USER_BANK_ACCOUNT.CREATION,
                message,
                metadata: {
                    account: {
                        id: newBankAccount?.id
                    }
                }
            });
            return {
                message,
                data: newBankAccount
            }
        }
        else {
            message = MESSAGES.BANK_ACCOUNT.ALREADY_EXISTS
            this.logger.info({
                activity_type: ACTIVITY_TYPES.USER_BANK_ACCOUNT.CREATION,
                message,
                metadata: {
                    bankAccounts: existingBankAccounts
                }
            });
            throw new AppError(message, 400)
        }
    }

    public async findOneBankAccount(account_number:string): Promise<BankAccount>{
        let message = null
        const conditions = {
            account_number
        }
        const bankAccount = await VirtualAccountRepository.findOneByConditions(conditions);
        if (!bankAccount) {
            message = dynamic_messages.NOT_FOUND(`${account_number} bank account`)
            this.logger.info({
                activity_type: ACTIVITY_TYPES.USER_BANK_ACCOUNT.CREATION,
                message,
                metadata: {
                    bankAccount: null
                }
            });
            throw new AppError(message, 404)
        }
        else{
            return bankAccount;
        }
       
    }

}