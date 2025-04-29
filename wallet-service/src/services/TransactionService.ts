import { Inject, Service } from "typedi";
import { Logger } from "../common/configs/logger";
import { ACTIVITY_TYPES } from "../common/constants/activity_types";
import { dynamic_messages, MESSAGES } from "../common/constants/messages";
import { AppError } from "../common/errors/AppError";
import { NewTransactionDTO, PeformFundsTransfer } from "../dto/TransactionDTO";
import BankAccountService from "./BankAccountService";
import { CONFIGS } from "../common/configs";
import VtWalletService from "./VtWalletService";
import { TransactionRepository } from "../repositories/TransactionRepository";
import moment from "moment";
import WalletTransaction from "../models/Transaction";

@Service()
export default class TransactionService {
    constructor(
        @Inject(() => Logger) private readonly logger: Logger,
        private readonly bankAccountService: BankAccountService,
        private readonly vtWalletService: VtWalletService,
    ) {
        this.logger = new Logger(TransactionService.name);
    }

    public async create (newTransaction: NewTransactionDTO): Promise<WalletTransaction>{
       return await TransactionRepository.create(newTransaction)
    }

    public async performFundsTransfer(transferData: PeformFundsTransfer): Promise<any> {
        let message = null;
        const {
            user_id,
            amount,
            account_number
        } = transferData;
        
        const transaction_amount = Number(amount)
        // If account number is valid
        const {user_id: receiver_id} = await this.bankAccountService.findOneBankAccount(account_number)
        console.log({receiver_id})
        // if amount is above minimum transfer amount
        if (transaction_amount < CONFIGS.TRANSACTION.TRANSFER.MINIMUM) {
            message = dynamic_messages.MINIMUM('transfer', transaction_amount, CONFIGS.TRANSACTION.TRANSFER.MINIMUM)
            this.logger.info({
                activity_type: ACTIVITY_TYPES.TRANSACTION.CREATION,
                message,
                metadata: {
                    transaction: {
                        amount,
                        account_number
                    }
                }
            });
            throw new AppError(message, 400)
        }
        // Check if sender has upto the amount to be sent
        const sender_wallet = await this.vtWalletService.findOneWallet(user_id)
        if(!sender_wallet){
            throw new AppError(dynamic_messages.NOT_FOUND('Sender wallet not found!'), 404)
        }
        if (sender_wallet && Number(sender_wallet.balance) < transaction_amount) {
            message = MESSAGES.TRANSACTION.INSUFFICIENT
            this.logger.info({
                activity_type: ACTIVITY_TYPES.TRANSFER.CREATION,
                message,
                metadata: {
                    transaction: {
                        amount,
                        account_number
                    }
                }
            });
            throw new AppError(message, 400)
        }
        
        // Lock the wallet row
        const {id: wallet_id} = await this.vtWalletService.findOneWallet(receiver_id)

        // Warn the user about possible duplicate (transaction less than 5mins)
        const lastUserTransaction = await TransactionRepository.findOne({id: user_id},'DESC','created_at')
        if (lastUserTransaction) {
           const {created_at} = lastUserTransaction;
           const duplicate_window = CONFIGS.TRANSACTION.DUPLICATE_TIME_WINDOW
           const transactionAge = moment().subtract(duplicate_window, 'minutes')
           const transactionDate = moment(created_at)
           if (!transactionDate.isBefore(transactionAge)) {
            message = MESSAGES.TRANSACTION.DUPLICATE

            this.logger.info({
                activity_type: ACTIVITY_TYPES.TRANSACTION.CREATION,
                message,
                metadata: {
                    transaction: {
                        amount,
                        account_number
                    }
                }
            });
            throw new AppError(message, 400)
           }
        }

        // Debit the sender
        await this.vtWalletService.debitOneWallet(wallet_id, transaction_amount, user_id)


        // Credit the receiver's wallet with the wallet_id
        await this.vtWalletService.creditOneWallet(wallet_id, transaction_amount, user_id)
        

        // Send a notification to the user wallet owner

        // Store the the transaction details
        
    }
}