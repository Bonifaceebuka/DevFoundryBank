import dotenv from "dotenv";
dotenv.config();

enum EnvironmentKeys {
    NODE_ENV = 'NODE_ENV',
    JWT_SECRET = 'JWT_SECRET',
    REFRESH_JWT_SECRET = 'REFRESH_JWT_SECRET',
    JWT_ISSUER = 'JWT_ISSUER',
    PORT = 'PORT',
    JWT_RESET_PASSWORD_TOKEN = 'JWT_RESET_PASSWORD_TOKEN',
    MONGODB_URL = 'MONGODB_URL',
    RABBITMQ_URL = 'RABBITMQ_URL',
    RABBITMQ_PUBLIC_KEY ='RABBITMQ_PUBLIC_KEY',
    API_GATEWAY_PUBLIC_KEY = 'API_GATEWAY_PUBLIC_KEY',

    PG_HOST = 'PG_HOST',
    PG_PORT = 'PG_PORT',
    PG_USERNAME = 'PG_USERNAME',
    PG_DATABASE = 'PG_DATABASE',
    PG_PASSWORD = 'PG_PASSWORD',
}

export function get(key: EnvironmentKeys): string {
    const envKey = EnvironmentKeys[key];
    return process.env[envKey] as string;
}

export const CONFIGS ={
    MONGO_DB_URL: get(EnvironmentKeys.MONGODB_URL),
    NODE_ENV: get(EnvironmentKeys.NODE_ENV),
    APP_NAME:"Wallet Service",
    SERVER_PORT: get(EnvironmentKeys.PORT),
    DEFAULT_CHARACTER_LENGTH: 12,
    API_GATEWAY_PUBLIC_KEY: get(EnvironmentKeys.API_GATEWAY_PUBLIC_KEY),
    API_KEY_EXPIRES_AT: 24,
    IS_PRODUCTION: process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production" ? true : false,
    JWT_TOKEN:{
        JWT_SECRET: get(EnvironmentKeys.JWT_SECRET),
        STATELESS_EXPIRES_IN: '3600s',
        REFRESH_JWT_SECRET: get(EnvironmentKeys.REFRESH_JWT_SECRET),
        JWT_ISSUER: get(EnvironmentKeys.JWT_ISSUER)
    },
    TRANSACTION:{
        TRANSFER:{
            MINIMUM: 100,
            TRANSACTION_FEE: 50
        },
        DUPLICATE_TIME_WINDOW: 5
    },
    DATABASE:{
        HOST: get(EnvironmentKeys.PG_HOST),
        PORT: get(EnvironmentKeys.PG_PORT) as unknown as number,
        USERNAME: get(EnvironmentKeys.PG_USERNAME),
        PASSWORD: get(EnvironmentKeys.PG_PASSWORD),
        DATABASE: get(EnvironmentKeys.PG_DATABASE),
    },
    RABBITMQ: {
        RABBITMQ_URL: get(EnvironmentKeys.RABBITMQ_URL) || 'amqp://localhost',
        RABBITMQ_PUBLIC_KEY: get(EnvironmentKeys.RABBITMQ_PUBLIC_KEY)
    },
    FRONT_ENDS:{
        WEB: "localhost:3000"
    },
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
    SERVICES_COR_ORIGINS: [
        "http://localhost:2026", // API Gateway
        "http://localhost:2025", // User service
        "http://localhost:2027"  // Notification
    ]
}