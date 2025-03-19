import { UserWithdrawalInformationRepository } from './../repositories/UserWithdrawalInformationRepository';
import UserWithdrawalInformation from "../models/postgres/UserWithdrawalInformation";
import AddWithdrawalInformationRequest from "../models/payload/requests/AddWithdrawalInformationRequest";
import { Service } from "typedi";
import { CreateWithdrawalAccountDTO, CreateWithdrawalAccountResponseDTO, FetchOneAccountResponseDTO, ListUserAccountsResponseDTO } from '../dtos/WithdrawalAccountDTO';
import { dynamic_messages, MESSAGES } from '../constants/messages';
import { AppError } from '../errors/AppError';
// import { Logger } from "../../lib/logger";

@Service()
export default class WithdrawalAccountService {
    constructor(
        // private logger: Logger
    ){}
    public async updateWithdrawalAccount(user_id: string, id: number, req: AddWithdrawalInformationRequest) {
        await UserWithdrawalInformationRepository.updateUserAccount(user_id, id, req);
    }

    public async deleteWithdrawalAccount(user_id: string, id: number): Promise<FetchOneAccountResponseDTO>{
        const accountAlreadyExists = await UserWithdrawalInformationRepository.findById(id);
        if (accountAlreadyExists && accountAlreadyExists?.userId == user_id) {
            await UserWithdrawalInformationRepository.deleteUserWithdrawalAccount(user_id, id);
            return {
                isSuccess: true,
                account: accountAlreadyExists,
            };
        }
        if (accountAlreadyExists && accountAlreadyExists?.userId !== user_id) {
            throw new AppError(MESSAGES.COMMON.UNATHORISED_ACCESS); 
        }
        else{
            throw new AppError(dynamic_messages.NOT_FOUND('Account')); 
        }
    }

    public async getWithdrawalAccount(user_id: string, id: number): Promise<{ isSuccess: boolean, message?: string, data?: UserWithdrawalInformation }> {
        const withdrawalAccountDetails = await UserWithdrawalInformationRepository.findById(id);
        if (withdrawalAccountDetails && withdrawalAccountDetails?.userId == user_id) {
            await UserWithdrawalInformationRepository.getUserWithdrawalAccount(user_id, id);
            return {
                isSuccess: true,
                message: "User withdrawal account details fetched successfully",
                data: withdrawalAccountDetails,
            };
        }
        if (withdrawalAccountDetails && withdrawalAccountDetails?.userId !== user_id) {
            throw new AppError(MESSAGES.COMMON.UNATHORISED_ACCESS); 
        }
        else {
            throw new AppError(dynamic_messages.NOT_FOUND('Account'));
        }
    }


    public async fetchWithdrawalAccounts(user_id: string): Promise<ListUserAccountsResponseDTO> {
        const withdrawalAccounts = await UserWithdrawalInformationRepository.findByUser(user_id);
        return {
            accounts: withdrawalAccounts,
            isSuccess: withdrawalAccounts && withdrawalAccounts.length > 0 ? true : false,
            message: withdrawalAccounts && withdrawalAccounts.length > 0 ? "User accounts fetched successfully" : "No accounts were found!",
        }
    }

    
    public async addWithdrawalAccount(user_id: string, req: CreateWithdrawalAccountDTO): Promise<CreateWithdrawalAccountResponseDTO> {
        // Api to fetch list of banks
        const accountAlreadyExists = await UserWithdrawalInformationRepository.findByAccountNumber(req.accountNumber);
        if (accountAlreadyExists){
            throw new AppError(MESSAGES.WITHDRAWAL_ACCOUNT.ALREADY_EXISTS,400,accountAlreadyExists); 
            }
        else{
            const createAccountData: UserWithdrawalInformation ={
                userId: req.userId,
                bankName: req.bankName,
                bankCode: req.bankCode,
                accountNumber: req.accountNumber,
                accountName: req.accountName,
                currency: req.currency
            }
            const withdrawalInformation = await UserWithdrawalInformationRepository.add(user_id, createAccountData);
            return {
                isSuccess: true,
                message: `Withdrwal account details saved successfully!`,
                account: withdrawalInformation
            };
        }
    }
}