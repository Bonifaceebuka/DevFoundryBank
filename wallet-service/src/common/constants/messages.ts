export const MESSAGES = {
    LOGIN:{
        "INVALID_LOGIN": "Invalid login credentials",   
        "LOGIN_SUCCESSFUL": "Login was successful"
    },
    EMAIL_VERIFICATION:{
        "SUCCESS": "User email was successfully verified",
        "FAILED": "User email verification failed",
        "EXPIRED": "Email verification token has expired",
        "INVALID": "Email Invalid account activation request"
    },
    REGISTRATION: {
        "SUCCESSFUL": "User registration was successful"
    },
    BANK_ACCOUNT: {
        "SUCCESSFUL": "User bank account was successfully created",
        "FAILED": "User bank account creation failed",
        "ALREADY_EXISTS": "You already have a bank account",
    },
    TRANSACTION: {
        "SUCCESSFUL": "User bank account was successfully created",
        "FAILED": "User bank account creation failed",
        "INSUFFICIENT": "Insufficient fund.",
        "DUPLICATE": "This might transaction might be a duplicate transaction",
    },
    VIRTUAL_WALLET: {
        "SUCCESSFUL": "User virtual wallet was successfully created",
        "FAILED": "User virtual wallet creation failed",
        "ALREADY_EXISTS": "You already have a virtual wallet",
    },
    USER: {
        "NOT_FOUND": "User account was not found!",
        "INVALID_CREDENTIALS": "Invalid email or password",
        "INVALID_ACCOUNT": "User account not validated. Please check your email for further instructions",
        "INACTIVE_ACCOUNT": "User account is inactive. Please contact support",
        "DISABLED_ACCOUNT": "User account is disabled. Please contact support",
        "USER_ACCOUNT_FETCHED": "User account info was fetched!"
    },
    PASSWWORD_RESET: {
        "DISABLED_ACCOUNT": "You can only reset the password of an enabled account",
        "INACTIVE_ACCOUNT": "You can only reset the password of an active account"
    },
    WITHDRAWAL_ACCOUNT: {
        'NAME': 'User withdrawal accounts' ,
        "ALREADY_EXISTS": `You already have an account!`
    },
    COMMON:{
        "INTERNAL_SERVER_ERROR": "Something went wrong",
        "EMAIL_EXISTS": "Email is already registered",
        "UNATHORISED_ACCESS": 'Unauthorized request!'
    },
    LOGS:{
        "JWT_GENERRATED": "User JWT was generated",
        "USER_SANITIZED": "User object was sanitized"
    }
}

export const dynamic_messages = {
    FETCHED_SUCCESSFULLY: (item_fetched: string) => `${item_fetched} fetched successfully`,
    NOT_FOUND: (item: string) => `${item} not found`,
    CONNECTION_FAILED: (item: string) => `${item} connection failed`,
    ALREADY_EXISTS: (item: string) => `${item} already exists`,
    MINIMUM:(transaction_type: string, amount: number, minimum: number)=>`You cannot ${transaction_type} ${amount} because it is lower than the permitted minumum amount of ${minimum}`,
    CONNECTION_SUCCESSFUL: (item: string) => `${item} connection was successful`,
}