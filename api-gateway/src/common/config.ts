import dotenv from "dotenv";
dotenv.config();

export const CONFIGS ={
    MONGO_DB_URL: process.env.MONGODB_URL,
    SERVER_PORT: process.env.PORT,
}