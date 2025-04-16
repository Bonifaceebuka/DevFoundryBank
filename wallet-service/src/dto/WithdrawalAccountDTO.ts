import UserWithdrawalInformation from "../models/UserWithdrawalInformation";
import AddWithdrawalInformationRequest from "../requests/AddWithdrawalInformationRequest";

export class CreateWithdrawalAccountDTO extends AddWithdrawalInformationRequest{}

export class CreateWithdrawalAccountResponseDTO {
   isSuccess!: boolean;
   message ?: string;
   account!: UserWithdrawalInformation|null;
}

export class FetchOneAccountResponseDTO { 
    account?: UserWithdrawalInformation;

    message ?: string 

    isSuccess!: boolean;
}

export class ListUserAccountsResponseDTO {
    accounts?: UserWithdrawalInformation[]|null;

    message?: string

    isSuccess!: boolean;
}