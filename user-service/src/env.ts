import * as path from "path";

import * as dotenv from "dotenv";

import * as pkg from "../package.json";

import {
    getOsEnv,
    getOsEnvWithDefault,
    normalizePort
} from "./lib/env";

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({
    path: path.join(
        process.cwd(),
        `.env${process.env.NODE_ENV === "test" ? ".test" : ""}`
    ),
});


export const env = {
    isProduction: ["prod", "production"].includes(process.env.NODE_ENV as unknown as string),
    isDevelopment: ["dev", "development"].includes(process.env.NODE_ENV as unknown as string),
    isLocal: process.env.NODE_ENV === "local",
    isTest: process.env.NODE_ENV === "test",

    app: {
        name: (pkg as any).name,
        displayName: (pkg as any).displayName || (pkg as any).name,
        version: (pkg as any).version,
        url: getOsEnv("APP_URL"),
        port: normalizePort(process.env.PORT || "")
    },
    log: {
        level: getOsEnvWithDefault("LOG_LEVEL", "debug"),
    },
    db: {
        mongo: {
            host: getOsEnv("MONGODB_HOST"),
            port: normalizePort(getOsEnv("MONGODB_PORT")) || 5432,
            user: getOsEnv("MONGODB_USERNAME"),
            pass: getOsEnv("MONGODB_PASSWORD"),
            database: getOsEnv("MONGODB_DATABASE"),
        },
        pg: {
            host: getOsEnv("PG_HOST"),
            port: normalizePort(getOsEnv("PG_PORT")) || 27017,
            user: getOsEnv("PG_USERNAME"),
            pass: getOsEnv("PG_PASSWORD"),
            database: getOsEnv("PG_DATBASE"),
        },
    },
    cache: {
        redis: {
            host: getOsEnv("REDIS_HOST"),
            port: normalizePort(getOsEnv("REDIS_PORT")),
            user: getOsEnv("REDIS_USERNAME"),
            pass: getOsEnv("REDIS_PASSWORD"),
        }
    },
    jwtConfig:{
        secret: getOsEnv('JWT_SECRET'),
        issuer: getOsEnv('JWT_ISSUER'),
    },
    api_keys:{
        API_GATEWAY: getOsEnv("API_GATEWAY_PUBLIC_KEY"),
        API_KEY_EXPIRES_AT: 24
    }
};