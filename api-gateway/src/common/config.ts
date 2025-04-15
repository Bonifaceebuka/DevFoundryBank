import dotenv from "dotenv";
dotenv.config();

export const CONFIGS ={
    MONGO_DB_URL: process.env.MONGODB_URL,
    SERVER_PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    IS_PRODUCTION: process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production" ? true : false,
    API_GATEWAY_PUBLIC_KEY: process.env.API_GATEWAY_PUBLIC_KEY,
    API_KEY_EXPIRES_AT: 24,
    HTTP_ALLOWED_HEADERS: [
        "Content-Type",
        "Authorization",
        "Origin",
        "Accept",
        "X-Requested-With",
        "x-jwt-token",
        "x-jwt-refresh-token",
        "Content-Length",
        "Accept-Language",
        "Accept-Encoding",
        "Connection",
        "Access-Control-Allow-Origin"
    ],
    HTTP_METHODS:["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    GATEWAY_COR_ORIGINS: [
        "http://localhost:3000"
    ],
    JWT:{
        JWT_SECRET: process.env.JWT_SECRET,
        STATELESS_EXPIRES_IN: '3600s',
        REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET,
        JWT_ISSUER: process.env.JWT_ISSUER
    },

}