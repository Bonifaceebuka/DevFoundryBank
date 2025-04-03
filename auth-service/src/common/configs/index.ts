import dotenv from "dotenv";
dotenv.config();

enum EnvironmentKeys {
    NODE_ENV = 'NODE_ENV',
    JWT_SECRET = 'JWT_SECRET',
    REFRESH_JWT_SECRET = 'REFRESH_JWT_SECRET',
    PORT = 'PORT',
    JWT_RESET_PASSWORD_TOKEN = 'JWT_RESET_PASSWORD_TOKEN',
    MONGODB_URL = 'MONGODB_URL',
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
    JWT_TOKEN:{
        JWT_SECRET: get(EnvironmentKeys.JWT_SECRET),
        REFRESH_JWT_SECRET: get(EnvironmentKeys.REFRESH_JWT_SECRET)
    },
    RABBITMQ: {
        RABBITMQ_URL: get(EnvironmentKeys.RABBITMQ_URL) || 'amqp://localhost',
        RABBITMQ_PUBLIC_KEY: get(EnvironmentKeys.RABBITMQ_PUBLIC_KEY)
    }
}