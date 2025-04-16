import { KYCTiers } from "../models/postgres/UserKYCInfomation";

export interface KycData {
    id: string;
    dob: string;
    bvn: string,
    tier: KYCTiers
}