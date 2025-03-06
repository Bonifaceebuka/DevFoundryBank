import { IsEnum, IsOptional, IsString } from "class-validator";

import { Currency } from "../../../enums/Currency";


export default class AddWithdrawalInformationRequest {
    userId: string;

    @IsString({ message: "Bank Name is required" })
        bankName: string;

    @IsString({ message: "Bank Code is required" })
        bankCode: string;

    @IsString({ message: "Account Number is required" })
        accountNumber: string;

    @IsString({ message: "Account Name is required" })
        accountName: string;

    @IsOptional()
    @IsEnum(Currency, { message: `Currency can either be ${Object.values(Currency).join(", ")}` })
        currency?: Currency;
}