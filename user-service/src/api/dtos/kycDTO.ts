import { IsString } from "class-validator";
import UserKYCInfomation, { KYCTiers } from "../models/postgres/UserKYCInfomation";

export interface KycData {
    id: string;
    dob: string;
    bvn: string,
    tier: KYCTiers
}

export class FetchKYCResponseDTO { 
    kyc?: UserKYCInfomation|null;

    @IsString()
    message?: string 
}