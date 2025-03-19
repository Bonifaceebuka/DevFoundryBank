import compression from "compression";
import cors from "cors";
import { Application, json, 
    Request, Response, 
    urlencoded } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { env } from "../env";

import { logLoader } from "./logger";
import { mongoDBLoader } from "./mongodb";
import { postgresLoader } from "./postgres";
import { redisLoader } from "./redis";
// import routes from "../api/routes";
import { RegisterRoutes } from "../api/routes/routes";

// const { app: appInfo } = env;

const corsOptions = {
    origin(origin: any, callback: any) {
        callback(null, true);
    },
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 50 // limit each IP to 50 requests per windowMs
});


const expressConfig = async (app: Application): Promise<void> => {
    app.use(cors(corsOptions));
    app.use(limiter);
    app.use(compression());
    app.use(urlencoded({ extended: true }));
    app.use(json());
    
    app.use(helmet());
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"]
        }
    }));

    await logLoader();
    await postgresLoader();
    await mongoDBLoader();
    // await redisLoader();

    // app.use('/api',routes);

    // app.get("/", (req:any, res:any) => res.send(`${appInfo.displayName} - v${appInfo.version}`));
    RegisterRoutes(app);
};

export default expressConfig;