import { CONFIGS } from "./config.js";

const activeEnv = CONFIGS.NODE_ENV;
var userService
var notificationService
var authService

switch (activeEnv) {
    case "production":

        break;
    case "local":
        userService = `http://localhost:2025/`
        notificationService = `http://localhost:2027/`
        authService= `http://localhost:2028/`
        break
    default:
        break;
}

export const SERVICES = {
        user: {
            basePath: '/users',
            target: userService,
            changeOrigin: true,
        },
        auth: {
            basePath: '/auth',
            target: authService,
            changeOrigin: true,
        },
        notification: {
            basePath: '/notifications',
            target: notificationService,
            changeOrigin: true,
        },
};

export const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) => {
        if (CONFIGS.IS_PRODUCTION) {
            if (CONFIGS.GATEWAY_COR_ORIGINS.includes(origin || "")) {
                callback(null, true); 
            } else {
                callback(new Error(`Unathorized origin: ${origin}`), false);
            }
        }
        else{
            callback(null, true); 
        }
    },
    
    allowedHeaders: CONFIGS.HTTP_ALLOWED_HEADERS,
    methods: CONFIGS.HTTP_METHODS,
    credentials: true,
};