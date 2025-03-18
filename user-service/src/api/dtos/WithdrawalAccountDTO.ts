import AddWithdrawalInformationRequest from "../models/payload/requests/AddWithdrawalInformationRequest";
import UserWithdrawalInformation from "../models/postgres/UserWithdrawalInformation";

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