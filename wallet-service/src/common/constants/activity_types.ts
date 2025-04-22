export const ACTIVITY_TYPES = {
    USER_REGISTRATION: "User registration",
    USER_LOGIN: "User login",
    USER_PROFILE: "Fetch user profile",
    USER:{
        PROFILE_UPDATE: "Update user profile",
        PASSWORD_RESET:{
            REQUEST: "Request for password reset",
            NEW_PASSWORD: "Set a new password"
        }
    },
    USER_EMAIL_VERIFICATION: "Email Verification",
    USER_VIRTUAL_WALLET: {
        CREATION: "User virtual wallet",
        FETCH: "Fetch user virtual  wallets"
    },
    USER_BANK_ACCOUNT: {
        CREATION: "User bank account",
        FETCH: "Fetch user bank accounts"
    },
    WITHDRAWAL_ACCOUNT:{
        "CREATION": "Create new withdrawal bank account",
        "DELETE": "Remove withdrawal account",
        "LIST": "Fetch user's withdrawal accounts",
        "SHOW": "Fetch one withdrawal account of a user"
    },
    TRANSACTION_PIN: {
        "CREATION": "Create new transaction PIN"
    }
}