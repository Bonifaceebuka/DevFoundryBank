import { KYCStatus, KYCTiers } from "../models/postgres/UserKYCInfomation"

export const MESSAGES = {
    USER: {
        "NOT_FOUND": "User account was not found!",
        "INVALID_CREDENTIALS": "Invalid email or password",
        "INVALID_ACCOUNT": "User account not validated. Please check your email for further instructions",
        "INACTIVE_ACCOUNT": "User account is inactive. Please contact support",
        "DISABLED_ACCOUNT": "User account is disabled. Please contact support",
        "USER_ACCOUNT_FETCHED": "User account info was fetched!",
        REGISTRATION: {
            "SUCCESSFUL": "User registration was successful"
        },
        KYC:{
            "SUCCESSFUL": "User KYC verification was successful",
        }
    },
    PIN:{
        "ALREADY_EXISTS": "You already have a transaction PIN on your account!",
    },
    WITHDRAWAL_ACCOUNT: {
        'NAME': 'User withdrawal accounts' ,
        "ALREADY_EXISTS": `You already have an account!`
    },
    COMMON:{
        "INTERNAL_SERVER_ERROR": "Something went wrong",
        "EMAIL_EXISTS": "Email is already registered",
        "UNATHORISED_ACCESS": 'Unauthorized request!'
    }
}

export const dynamic_messages = {
    FETCHED_SUCCESSFULLY: (item_fetched: string) => `${item_fetched} fetched successfully`,
    NOT_FOUND: (item: string) => `${item} not found`,
    CONNECTION_FAILED: (item: string) => `${item} connection failed`,
    CONNECTION_SUCCESSFUL: (item: string) => `${item} connection was successful`,
    KYC_EXISTS:(current_status: KYCStatus, tier: KYCTiers) => `You have aleady performed ${tier} KYC verification and your KYC status is: ${current_status}`
}