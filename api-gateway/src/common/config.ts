import dotenv from "dotenv";
dotenv.config();

export const CONFIGS ={
    MONGO_DB_URL: process.env.MONGODB_URL,
    SERVER_PORT: process.env.PORT,
    API_GATEWAY_PUBLIC_KEY: process.env.API_GATEWAY_PUBLIC_KEY,
    API_KEY_EXPIRES_AT: 24,
}