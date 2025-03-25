import dotenv from "dotenv";
dotenv.config();

const COMPANY_NAME = "DevFoundry Bank";

export const CONFIGS ={
    MONGO_DB_URL: process.env.MONGODB_URL,
    SERVER_PORT: process.env.PORT,
    API_GATEWAY_PUBLIC_KEY: process.env.API_GATEWAY_PUBLIC_KEY,
    API_KEY_EXPIRES_AT: 24,
    COMPANY_NAME,
    MAIL:{
        MAIL_HOST: process.env.MAIL_HOST,
        SENDER_NAME: COMPANY_NAME,
        MAIL_USERNAME: process.env.MAIL_USERNAME,
        MAIL_PASSWORD: process.env.MAIL_PASSWORD,
        MAIL_SECURE: process.env.MAIL_SECURE || true
    }
}