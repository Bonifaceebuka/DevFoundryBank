import dotenv from "dotenv";
dotenv.config();
const COMPANY_NAME = "DevFoundry Bank";

enum EnvironmentKeys {
    NODE_ENV = 'NODE_ENV',
    JWT_SECRET = 'JWT_SECRET',
    REFRESH_JWT_SECRET = 'REFRESH_JWT_SECRET',
    PORT = 'PORT',
    JWT_RESET_PASSWORD_TOKEN = 'JWT_RESET_PASSWORD_TOKEN',
    MONGODB_URL = 'MONGODB_URL',
    MAIL_HOST = 'MAIL_HOST',
    MAIL_USERNAME = 'MAIL_USERNAME',
    MAIL_PASSWORD = 'MAIL_PASSWORD',
    MAIL_SECURE = 'MAIL_SECURE',
    MAIL_PORT = 'MAIL_PORT',
    RABBITMQ_URL = 'RABBITMQ_URL',
    RABBITMQ_PUBLIC_KEY ='RABBITMQ_PUBLIC_KEY',
    API_GATEWAY_PUBLIC_KEY = 'API_GATEWAY_PUBLIC_KEY'
}

export function get(key: EnvironmentKeys): string {
    const envKey = EnvironmentKeys[key];
    return process.env[envKey] as string;
}

export const CONFIGS ={
    MONGO_DB_URL: get(EnvironmentKeys.MONGODB_URL),
    NODE_ENV: get(EnvironmentKeys.NODE_ENV),
    APP_NAME:"Notification Service",
    SERVER_PORT: get(EnvironmentKeys.PORT),
    API_GATEWAY_PUBLIC_KEY: get(EnvironmentKeys.API_GATEWAY_PUBLIC_KEY),
    API_KEY_EXPIRES_AT: 24,
    COMPANY_NAME,
    MAIL:{
        MAIL_HOST: process.env.MAIL_HOST,
        SENDER_NAME: COMPANY_NAME,
        MAIL_USERNAME: get(EnvironmentKeys.MAIL_USERNAME),
        MAIL_PORT: get(EnvironmentKeys.MAIL_PORT),
        MAIL_PASSWORD: get(EnvironmentKeys.MAIL_PASSWORD),
        MAIL_SECURE: get(EnvironmentKeys.MAIL_SECURE) || true
    },
    JWT_TOKEN:{
        JWT_SECRET: get(EnvironmentKeys.JWT_SECRET),
        REFRESH_JWT_SECRET: get(EnvironmentKeys.REFRESH_JWT_SECRET)
    },
    RABBITMQ: {
        RABBITMQ_URL: get(EnvironmentKeys.RABBITMQ_URL) || 'amqp://localhost',
        RABBITMQ_PUBLIC_KEY: get(EnvironmentKeys.RABBITMQ_PUBLIC_KEY)
    }
}