import { UserWithdrawalInformationRepository } from './../repositories/UserWithdrawalInformationRepository';
import UserWithdrawalInformation from "../models/postgres/UserWithdrawalInformation";
import AddWithdrawalInformationRequest from "../models/payload/requests/AddWithdrawalInformationRequest";
import { Service } from "typedi";
import { CreateWithdrawalAccountDTO, CreateWithdrawalAccountResponseDTO, FetchOneAccountResponseDTO, ListUserAccountsResponseDTO } from '../dtos/WithdrawalAccountDTO';
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
            return {
                isSuccess: false,
                message: 'Unauthorized request!',
            };
        }
        else{
            return {
                isSuccess: false,
                message: 'Account not found!',
            }; 
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
            return {
                isSuccess: false,
                message: 'Unauthorized request!',
            };
        }
        else {
            return {
                isSuccess: false,
                message: 'Account not found!',
            };
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
                return { 
                    isSuccess: false, 
                    message: `You already have an account with the account number ${req.accountNumber}!`, 
                    account: accountAlreadyExists 
                };
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