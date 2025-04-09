import { env } from "../env";
import { CONFIGS } from ".";

export const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) => {
        if (env.isProduction) {
            if (CONFIGS.SERVICES_COR_ORIGINS.includes(origin || "")) {
                callback(null, true); 
            } else {
                callback(new Error(`Unathorized origins: ${origin}`), false);
            }
        }
        else{
            callback(null, true); 
        }
    },
    optionsSuccessStatus: 200,
    allowedHeaders: CONFIGS.HTTP_ALLOWED_HEADERS,
    methods: CONFIGS.HTTP_METHODS,
    credentials: true,
};