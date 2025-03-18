export const MESSAGES = {
    LOGIN:{
        "INVALID_LOGIN": "Invalid login credentials"
    },
    EMAIL_VERIFICATION:{
        "SUCCESS": "User email was successfully verified",
        "FAILED": "User email verification failed"
    },
    USER: {
        "NOT_FOUND": "User account was not found!",
        "USER_ACCOUNT_FETCHED": "User account info was fetched!"
    },
    PASSWWORD_RESET: {

    },
    WITHDRAWAL_ACCOUNT: {
        'NAME': 'User withdrawal accounts' 
    },
    COMMON:{
        "INTERNAL_SERVER_ERROR": "Something went wrong"
    }
}

export const dynamic_messages = {
    FETCHED_SUCCESSFULLY: (item_fetched: string) => `${item_fetched} fetched successfully`
}